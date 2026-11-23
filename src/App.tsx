import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  CalendarDays,
  CircleHelp,
  Columns2,
  Flame,
  History,
  Info,
  Layers,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Trash2,
  X,
} from 'lucide-react'
import {apps as builtInApps} from './data'
import {loadAppsFromJson} from './data/loadJson'
import type {AppData, AppKey, BackupData, Entry, ExportScope} from './types'
import type {ExportEntry} from './utils/export'
import {
  useCopyCounts,
  useCustomCategories,
  useCustomEntries,
  useEntryNotes,
  useFavorites,
  useLocale,
  useSearchHistory,
  useTheme,
} from './utils/storage'
import {dict, fmt, trAppLabel, trAppSubtitle, trCategory} from './i18n'
import {fuzzyMatch} from './utils/search'
import {highlight} from './utils/highlight'
import EntryCard from './components/EntryCard'
import ExportMenu from './components/ExportMenu'
import AddEntryModal from './components/AddEntryModal'
import type {ToastItem, ToastType} from './components/Toast'
import Toast from './components/Toast'
import NoteModal from './components/NoteModal'
import BatchImportModal from './components/BatchImportModal'
import DataBackupPanel from './components/DataBackupPanel'
import type {DailyEntry} from './components/DailyPickModal'
import DailyPickModal from './components/DailyPickModal'
import ShortcutsHelpModal from './components/ShortcutsHelpModal'

type ViewMode = 'card' | 'table' | 'compare'

export default function App() {
  const [appKey, setAppKey] = useState<AppKey>('excel')
  const [category, setCategory] = useState<string>('全部')
  const [query, setQuery] = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [priorityByFreq, setPriorityByFreq] = useState(false)
  const [view, setView] = useState<ViewMode>('card')
  const [scope, setScope] = useState<ExportScope>('filtered')
  const [showAdd, setShowAdd] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [noteEntry, setNoteEntry] = useState<Entry | null>(null)
  const [showBatch, setShowBatch] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  // 交互增强状态
  const [immersive, setImmersive] = useState(false)
  const [showDaily, setShowDaily] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')
  // 工程化：外置 JSON 数据（失败回退内置）+ 界面语言
  const [apps, setApps] = useState<AppData[]>(builtInApps)
  const [loading, setLoading] = useState(true)
  const searchRef = useRef<HTMLInputElement>(null)

  const { favs, toggle, isFav, replace: replaceFavs } = useFavorites()
  const {
    custom, add: addCustom, remove: removeCustom,
    updateCategory: updateEntryCategory, replace: replaceCustom,
  } = useCustomEntries()
  const { theme, toggle: toggleTheme } = useTheme()
  const { locale, toggle: toggleLocale } = useLocale()
  const { history, push: pushHistory, clear: clearHistory } = useSearchHistory()
  const { customCategories, addCategory, removeCategory, replace: replaceCustomCategories } = useCustomCategories()
  const { entryNotes, setNote, replace: replaceNotes } = useEntryNotes()
  const { copyCounts, recordCopy, remove: removeCopyCount } = useCopyCounts()

  const t = dict[locale]

  const pushToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 3200)
  }, [])
  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((item) => item.id !== id)), [])

  // 优先使用 public/data/*.json；失败（离线、本地直开等）静默回退内置数据
  useEffect(() => {
    let cancelled = false
    loadAppsFromJson()
      .then((data) => { if (!cancelled) setApps(data) })
      .catch(() => { /* 回退到内置 apps */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const allEntries = useMemo(
    () => apps.flatMap((app) => app.entries.map((entry) => ({ ...entry, app: app.key, appLabel: app.label }))),
    [apps],
  )

  // 每个应用各自的条目数（内置 + 该应用的自定义条目），供顶部 tab 分别显示
  const appCounts = useMemo(() => {
    const map: Partial<Record<AppKey, number>> = {}
    for (const a of apps) {
      map[a.key] = a.entries.length + custom.filter((c) => c.app === a.key).length
    }
    return map
  }, [apps, custom])

  const baseCategories = apps.find((a) => a.key === appKey)!.categories

  // 应用当前条目 = 内置 + 该应用的自定义条目
  const appEntries = useMemo(() => {
    const builtIn = apps.find((a) => a.key === appKey)?.entries ?? []
    const mine = custom.filter((c) => c.app === appKey)
    return [...builtIn, ...mine]
  }, [appKey, custom, apps])

  const app = useMemo(() => {
    const base = apps.find((a) => a.key === appKey)!
    const mine = custom.filter((c) => c.app === appKey)
    const declared = customCategories[appKey] ?? []
    const fromEntries = mine.map((m) => m.category)
    const extraCats = [...new Set([...declared, ...fromEntries])].filter((c) => !base.categories.includes(c))
    return { ...base, entries: appEntries, categories: [...base.categories, ...extraCats] }
  }, [appKey, appEntries, custom, customCategories, apps])

  const visibleSource = useMemo(
    () => (category === '我的收藏' ? appEntries.filter((e) => favs.includes(e.id)) : appEntries),
    [category, appEntries, favs],
  )

  // 分类 + 拼音/模糊/加权搜索（多词 AND，按分数排序），其它筛选条件保持不变
  const filtered = useMemo(() => {
    const q = query.trim()
    const matched = visibleSource
      .filter((e) => {
        if (category !== '全部' && category !== '我的收藏' && e.category !== category) return false
        if (onlyFeatured && !e.featured && !favs.includes(e.id)) return false
        return true
      })
      .map((entry) => ({ entry, score: q ? fuzzyMatch(q, entry, locale) : 1 }))
      .filter((item) => item.score > 0)
    if (q) matched.sort((a, b) => b.score - a.score)
    return matched.map((item) => item.entry)
  }, [visibleSource, category, onlyFeatured, favs, query, locale])

  // 高频优先：按复制次数降序，无记录的排在后面（其它筛选条件不变）
  const displayEntries = useMemo(() => {
    if (!priorityByFreq) return filtered
    return [...filtered].sort((a, b) => (copyCounts[b.id] ?? 0) - (copyCounts[a.id] ?? 0))
  }, [filtered, priorityByFreq, copyCounts])

  // 导出范围
  const exportEntries: ExportEntry[] = useMemo(() => {
    if (scope === 'all') {
      const customWithApp = custom.map(({ app: a, ...rest }) => ({
        ...rest, app: a, appLabel: apps.find((x) => x.key === a)?.label ?? a,
      }))
      return [...allEntries, ...customWithApp] as ExportEntry[]
    }
    return appEntries.map((e) => ({ ...e, app: appKey, appLabel: app.label }))
  }, [scope, appEntries, appKey, app.label, custom, allEntries, apps])

  // 今日速查候选：全部应用的内置条目 + 全部自建条目
  const dailyEntries = useMemo<DailyEntry[]>(() => {
    const mine = custom.map((c) => ({
      ...c,
      appLabel: apps.find((a) => a.key === c.app)?.label ?? c.app,
    }))
    return [...allEntries, ...mine]
  }, [custom, allEntries, apps])

  // 对比视图：默认取当前应用前两条不同条目
  const compareEntries = useMemo(() => {
    const a = appEntries.find((e) => e.id === compareA) ?? appEntries[0]
    const b = appEntries.find((e) => e.id === compareB) ?? appEntries.find((e) => e.id !== a?.id) ?? appEntries[1]
    return { a, b }
  }, [appEntries, compareA, compareB])

  // 键盘 j/k/Enter 的作用对象：卡片视图用列表，对比视图用两张卡片，表格视图不参与
  const focusEntries = useMemo<Entry[]>(() => {
    if (view === 'compare') return [compareEntries.a, compareEntries.b].filter((e): e is Entry => Boolean(e))
    if (view === 'card') return displayEntries
    return []
  }, [view, compareEntries, displayEntries])

  const anyModalOpen =
    showAdd || showHistory || !!noteEntry || showBatch || addingCategory || showHelp || showDaily

  const switchApp = (key: AppKey) => {
    setAppKey(key)
    setCategory('全部')
    setQuery('')
    setOnlyFeatured(false)
    setShowHistory(false)
    setNoteEntry(null)
    setShowBatch(false)
    setAddingCategory(false)
    setCompareA('')
    setCompareB('')
  }

  const commitSearch = (term: string) => {
    setQuery(term)
    pushHistory(term)
  }

  // 恢复备份：写回各持久化状态，界面随即刷新
  const handleImportBackup = (data: BackupData) => {
    replaceFavs(data.favorites)
    replaceCustom(data.custom)
    replaceCustomCategories(data.customCategories)
    replaceNotes(data.entryNotes)
    setAppKey('excel')
    setCategory('全部')
    setQuery('')
    setOnlyFeatured(false)
    setPriorityByFreq(false)
    setNoteEntry(null)
    setShowBatch(false)
    setCompareA('')
    setCompareB('')
  }

  const confirmAddCategory = () => {
    const name = newCategory.trim()
    setAddingCategory(false)
    setNewCategory('')
    if (!name) return
    if (app.categories.includes(name)) {
      pushToast(fmt(t.existsToast, { c: name }), 'error')
      return
    }
    addCategory(appKey, name)
    pushToast(fmt(t.addedCatToast, { c: name }))
  }

  // 删除自建条目时一并清理其收藏/备注/频次，避免孤儿数据
  const handleRemoveCustom = (id: string) => {
    removeCustom(id)
    replaceFavs((prev) => prev.filter((x) => x !== id))
    replaceNotes((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    removeCopyCount(id)
  }

  const handleDeleteCategory = (cat: string) => {
    const moving = custom.filter((c) => c.app === appKey && c.category === cat)
    moving.forEach((c) => updateEntryCategory(c.id, '自定义'))
    removeCategory(appKey, cat)
    if (category === cat) setCategory('全部')
    pushToast(fmt(t.deletedCatToast, { c: cat, n: moving.length }))
  }

  const handleSaveNote = (text: string) => {
    if (!noteEntry) return
    setNote(noteEntry.id, text)
    pushToast(text.trim() ? t.noteSaved : t.noteCleared)
  }

  // 复制写法（键盘 Enter / 今日速查共用）
  const copySyntax = useCallback(async (entry: Entry) => {
    try {
      await navigator.clipboard.writeText(entry.syntax)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = entry.syntax
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    recordCopy(entry.id)
    pushToast(fmt(t.copyToast, { name: entry.name }))
  }, [recordCopy, pushToast, t])

  // 切换视图 / 应用时清空焦点，避免越界
  useEffect(() => {
    setFocusIndex(-1)
  }, [view, appKey])

  // 焦点变化时滚动到对应卡片
  useEffect(() => {
    if (focusIndex < 0) return
    document.getElementById(`entry-card-${focusIndex}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusIndex, view])

  // 键盘快捷键：Esc（优先级：沉浸 → 弹层 → 搜索）、/、?、j/k、Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing =
        el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.tagName === 'SELECT' ||
        Boolean(el?.isContentEditable)

      if (e.key === 'Escape') {
        if (immersive) {
          setImmersive(false)
          return
        }
        const searchFocused = document.activeElement === searchRef.current
        setShowAdd(false)
        setShowHistory(false)
        setNoteEntry(null)
        setShowBatch(false)
        setAddingCategory(false)
        setShowHelp(false)
        setShowDaily(false)
        if (searchFocused) {
          setQuery('')
          ;(document.activeElement as HTMLElement).blur()
        }
        setFocusIndex(-1)
        return
      }

      if (typing) return

      if (anyModalOpen) return

      // 保留原有行为：非输入状态下 / 聚焦搜索
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        setShowHelp(true)
        return
      }

      if (e.key === 'j' || e.key === 'k') {
        if (focusEntries.length === 0) return
        e.preventDefault()
        setFocusIndex((prev) =>
          e.key === 'j' ? Math.min(prev + 1, focusEntries.length - 1) : Math.max(prev - 1, 0),
        )
        return
      }

      if (e.key === 'Enter') {
        const target = focusEntries[focusIndex]
        if (!target) return
        e.preventDefault()
        void copySyntax(target)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [immersive, anyModalOpen, focusEntries, focusIndex, copySyntax])

  const renderCompareCard = (entry: Entry | undefined, index: number) => {
    if (!entry) return null
    return (
      <EntryCard
        key={entry.id}
        cardId={`entry-card-${index}`}
        focused={focusIndex === index}
        entry={entry}
        isFav={isFav(entry.id)}
        onToggleFav={() => toggle(entry.id)}
        onRemove={entry.custom ? () => handleRemoveCustom(entry.id) : undefined}
        personalNote={entryNotes[entry.id]}
        copyCount={copyCounts[entry.id] ?? 0}
        onEditNote={() => setNoteEntry(entry)}
        onCopy={() => recordCopy(entry.id)}
        t={t}
      />
    )
  }

  const totalCustom = custom.length
  // 侧栏「我的收藏」徽章须与点击后实际显示一致：只统计当前应用内的收藏
  const favCount = appEntries.filter((e) => favs.includes(e.id)).length

  // 轻量加载态：JSON 读取很快，数据就绪后整体渲染
  if (loading) {
    return (
      <div className="app-shell app-loading" data-theme={theme}>
        <div className="loading-spinner" />
        <p>{t.loading}</p>
      </div>
    )
  }

  return (
    <div className={`app-shell ${immersive ? 'immersive' : ''}`} data-theme={theme}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">⚡</div>
          <div>
            <h1>{t.brandTitle}</h1>
            <p>{t.brandSubtitle}</p>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="scope-picker">
            <span>{t.exportScope}</span>
            <select value={scope} onChange={(e) => setScope(e.target.value as ExportScope)}>
              <option value="filtered">{t.scopeCurrent}</option>
              <option value="all">{t.scopeAll}</option>
            </select>
          </div>
          <button className="btn daily-trigger" onClick={() => setShowDaily(true)} title={t.dailyTitle}>
            <CalendarDays size={15} /> {t.daily}
          </button>
          <button className="icon-btn lang-btn" onClick={toggleLocale} title={t.languageTitle}>
            {locale === 'zh' ? 'EN' : '中'}
          </button>
          <button className="icon-btn theme-btn" onClick={toggleTheme} title={theme === 'dark' ? t.themeToLight : t.themeToDark}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="icon-btn theme-btn" onClick={() => setImmersive(true)} title={t.immersiveTitle}>
            <Maximize2 size={17} />
          </button>
          <ExportMenu entries={exportEntries} t={t} />
        </div>
      </header>

      <div className="app-tabs">
        {apps.map((a) => (
          <button
            key={a.key}
            className={`app-tab ${appKey === a.key ? 'active' : ''}`}
            onClick={() => switchApp(a.key)}
            style={{ '--accent': a.accent } as React.CSSProperties}
          >
            <span className="app-tab-icon">{a.icon}</span>
            <span className="app-tab-text">
              <strong>{trAppLabel(a.key, locale)}</strong>
              <small>{trAppSubtitle(a.key, locale)} · {fmt(t.countUnit, { n: appCounts[a.key] ?? 0 })}</small>
            </span>
          </button>
        ))}
        <button className="app-tab add-tab" onClick={() => setShowAdd(true)} title={t.addCustomTitle}>
          <span className="app-tab-icon"><Plus size={20} /></span>
          <span className="app-tab-text">
            <strong>{t.addEntry}</strong>
            <small>{fmt(t.customTabHint, { n: totalCustom })}</small>
          </span>
        </button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <div className="search-box">
            <Search size={17} />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 150)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitSearch(query) }}
              placeholder={fmt(t.searchPlaceholder, { app: trAppLabel(appKey, locale) })}
            />
            {query && <button onClick={() => setQuery('')} title={t.clear}><X size={15} /></button>}
            {history.length > 0 && (
              <button className="history-trigger" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowHistory((v) => !v)} title={t.history}>
                <History size={15} />
              </button>
            )}
          </div>
          {showHistory && history.length > 0 && (
            <div className="history-menu">
              <div className="history-head">
                <span><History size={13} /> {t.recentSearch}</span>
                <button onClick={clearHistory}><Trash2 size={13} /> {t.clear}</button>
              </div>
              {history.map((h) => (
                <button key={h} className="history-item" onMouseDown={(e) => e.preventDefault()} onClick={() => { commitSearch(h); setShowHistory(false) }}>
                  <Search size={12} /> {h}
                </button>
              ))}
            </div>
          )}
        </div>
        <label className="toggle">
          <input type="checkbox" checked={onlyFeatured} onChange={(e) => setOnlyFeatured(e.target.checked)} />
          <span>{t.onlyFeatured}</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={priorityByFreq} onChange={(e) => setPriorityByFreq(e.target.checked)} />
          <span><Flame size={12} /> {t.highFreqFirst}</span>
        </label>
        <div className="view-switch">
          <button className={view === 'card' ? 'active' : ''} onClick={() => setView('card')} title={t.cardView}><LayoutGrid size={16} /></button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} title={t.tableView}><List size={16} /></button>
          <button className={view === 'compare' ? 'active' : ''} onClick={() => setView('compare')} title={t.compareView}><Columns2 size={16} /></button>
        </div>
        <button className="icon-btn theme-btn help-trigger" onClick={() => setShowHelp(true)} title={t.helpTitle}>
          <CircleHelp size={17} />
        </button>
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title"><Layers size={14} /> {t.categories}</div>
          <button className={`cat-item ${category === '全部' ? 'active' : ''}`} onClick={() => setCategory('全部')}>
            {t.all} <span className="cat-count">{appEntries.length}</span>
          </button>
          <button className={`cat-item fav-cat ${category === '我的收藏' ? 'active' : ''}`} onClick={() => setCategory('我的收藏')}>
            <Star size={13} fill={category === '我的收藏' ? 'currentColor' : 'none'} /> {t.favorites} <span className="cat-count">{favCount}</span>
          </button>
          <div className="sidebar-divider" />
          {app.categories.map((c) => {
            const isCustom = !baseCategories.includes(c)
            const count = appEntries.filter((e) => e.category === c).length
            return (
              <div key={c} className="cat-item-row">
                <button className={`cat-item ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                  <span className="cat-name">{trCategory(c, locale)}</span>
                  <span className="cat-count">{count}</span>
                </button>
                {isCustom && (
                  <button className="cat-del" onClick={() => handleDeleteCategory(c)} title={fmt(t.deleteCategoryTitle, { c: trCategory(c, locale) })}>
                    <X size={12} />
                  </button>
                )}
              </div>
            )
          })}
          {addingCategory ? (
            <div className="cat-add-form">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmAddCategory()
                  if (e.key === 'Escape') { setAddingCategory(false); setNewCategory('') }
                }}
                placeholder={t.categoryName}
                autoFocus
              />
              <button onClick={confirmAddCategory} title={t.confirm}>✓</button>
              <button onClick={() => { setAddingCategory(false); setNewCategory('') }} title={t.cancel}>✕</button>
            </div>
          ) : (
            <button className="cat-item add-cat" onClick={() => setAddingCategory(true)}>
              <Plus size={13} /> {t.addCategory}
            </button>
          )}
          <div className="sidebar-divider" />
          <DataBackupPanel
            favorites={favs}
            custom={custom}
            customCategories={customCategories}
            entryNotes={entryNotes}
            onImport={handleImportBackup}
            onToast={pushToast}
            onOpenBatchImport={() => setShowBatch(true)}
            t={t}
          />
          <div className="sidebar-foot">
            <Info size={13} /> {fmt(t.sidebarFoot, { n: appEntries.length, m: filtered.length })}
          </div>
          <div className="sidebar-tip"><Sparkles size={12} /> <kbd>/</kbd> {t.tipSearch} · <kbd>j</kbd>/<kbd>k</kbd> {t.tipSwitch} · <kbd>?</kbd> {t.tipHelp}</div>
        </aside>

        <main className="content">
          <div className="content-head">
            <div>
              <h2>{category === '全部' ? t.allEntriesTitle : trCategory(category, locale)}</h2>
              <p>{category === '我的收藏' ? t.favDesc : t.defaultDesc}</p>
            </div>
            {view !== 'compare' && <div className="result-badge"><SlidersHorizontal size={13} /> {fmt(t.resultBadge, { n: filtered.length })}</div>}
          </div>

          {view === 'compare' ? (
            appEntries.length === 0 ? (
              <div className="empty-state">
                <Columns2 size={32} />
                <h3>{t.emptyCompareTitle}</h3>
                <p>{t.emptyCompareDesc}</p>
              </div>
            ) : (
              <div className="compare-view">
                <div className="compare-pickers">
                  <label>
                    <span>{t.itemA}</span>
                    <select value={compareEntries.a?.id ?? ''} onChange={(e) => setCompareA(e.target.value)}>
                      {appEntries.map((en) => <option key={en.id} value={en.id}>{en.name}</option>)}
                    </select>
                  </label>
                  <span className="compare-vs">VS</span>
                  <label>
                    <span>{t.itemB}</span>
                    <select value={compareEntries.b?.id ?? ''} onChange={(e) => setCompareB(e.target.value)}>
                      {appEntries.map((en) => <option key={en.id} value={en.id}>{en.name}</option>)}
                    </select>
                  </label>
                </div>
                <div className="compare-grid">
                  {renderCompareCard(compareEntries.a, 0)}
                  {renderCompareCard(compareEntries.b, 1)}
                </div>
              </div>
            )
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Search size={32} />
              <h3>{category === '我的收藏' && favCount === 0 ? t.emptyFavTitle : t.emptySearchTitle}</h3>
              <p>{category === '我的收藏' && favCount === 0 ? t.emptyFavDesc : t.emptySearchDesc}</p>
              <button className="btn" onClick={() => { setQuery(''); setOnlyFeatured(false); setCategory('全部') }}>{t.viewAll}</button>
            </div>
          ) : view === 'card' ? (
            <div className="card-grid">
              {displayEntries.map((e, i) => (
                <EntryCard
                  key={e.id}
                  cardId={`entry-card-${i}`}
                  focused={focusIndex === i}
                  entry={e}
                  isFav={isFav(e.id)}
                  onToggleFav={() => toggle(e.id)}
                  onRemove={e.custom ? () => handleRemoveCustom(e.id) : undefined}
                  personalNote={entryNotes[e.id]}
                  copyCount={copyCounts[e.id] ?? 0}
                  onEditNote={() => setNoteEntry(e)}
                  onCopy={() => recordCopy(e.id)}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>{t.thName}</th><th>{t.thCategory}</th><th>{t.thPurpose}</th><th>{t.thSyntax}</th><th>{t.thExample}</th><th>{t.thNote}</th></tr>
                </thead>
                <tbody>
                  {displayEntries.map((e) => (
                    <tr key={e.id}>
                      <td><strong>{e.name}</strong>{e.badge && <span className="entry-badge sm">{e.badge}</span>}{(copyCounts[e.id] ?? 0) > 0 && <span className="copy-badge sm"><Flame size={11} /> {copyCounts[e.id]}</span>}</td>
                      <td><span className="table-cat">{trCategory(e.category, locale)}</span></td>
                      <td>{e.purpose}</td>
                      <td><code dangerouslySetInnerHTML={{ __html: highlight(e.syntax) }} /></td>
                      <td><code dangerouslySetInnerHTML={{ __html: highlight(e.example) }} /></td>
                      <td>{e.note ?? ''}{entryNotes[e.id] && <div className="table-personal-note">{t.personalNoteLabel}{entryNotes[e.id]}</div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {immersive && (
        <button className="immersive-exit" onClick={() => setImmersive(false)} title={t.exitImmersiveTitle}>
          <Minimize2 size={17} /> <span>{t.exitImmersive}</span>
        </button>
      )}

      {showAdd && (
        <AddEntryModal
          appKey={appKey}
          categories={app.categories}
          onAdd={addCustom}
          onClose={() => setShowAdd(false)}
          t={t}
        />
      )}
      {noteEntry && (
        <NoteModal
          entry={noteEntry}
          note={entryNotes[noteEntry.id] ?? ''}
          onSave={handleSaveNote}
          onClose={() => setNoteEntry(null)}
          t={t}
        />
      )}
      {showBatch && (
        <BatchImportModal
          appKey={appKey}
          categories={app.categories}
          onImport={(entries) => {
            entries.forEach(addCustom)
            pushToast(fmt(t.importedToast, { n: entries.length, app: trAppLabel(appKey, locale) }))
          }}
          onClose={() => setShowBatch(false)}
          t={t}
        />
      )}
      {showDaily && (
        <DailyPickModal
          entries={dailyEntries}
          isFav={isFav}
          onToggleFav={toggle}
          onCopy={(entry) => {
            recordCopy(entry.id)
            pushToast(fmt(t.copyToast, { name: entry.name }))
          }}
          onClose={() => setShowDaily(false)}
          t={t}
        />
      )}
      {showHelp && <ShortcutsHelpModal onClose={() => setShowHelp(false)} t={t} />}
      <Toast toasts={toasts} onDismiss={dismissToast} t={t} />
    </div>
  )
}
