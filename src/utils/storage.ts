import {useCallback, useEffect, useState} from 'react'
import type {AppKey, Entry} from '../types'
import type {Locale} from '../i18n'

const PREFIX = 'office-cheatsheet:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* 隐私模式或空间不足时静默失败 */
    }
  }, [key, value])
  return [value, setValue] as const
}

/** 收藏的条目 id 集合 */
export function useFavorites() {
  const [favs, setFavs] = usePersisted<string[]>('favorites', [])
  const toggle = useCallback(
    (id: string) => setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavs],
  )
  return { favs, toggle, isFav: (id: string) => favs.includes(id), replace: setFavs }
}

/** 用户自定义条目 */
export function useCustomEntries() {
  const [custom, setCustom] = usePersisted<Array<Entry & { app: AppKey }>>('custom', [])
  const add = useCallback(
    (entry: Entry & { app: AppKey }) => setCustom((prev) => [...prev, entry]),
    [setCustom],
  )
  const remove = useCallback(
    (id: string) => setCustom((prev) => prev.filter((e) => e.id !== id)),
    [setCustom],
  )
  /** 修改某条自建条目的分类（删除分类时把条目归入「自定义」） */
  const updateCategory = useCallback(
    (id: string, category: string) =>
      setCustom((prev) => prev.map((e) => (e.id === id ? { ...e, category } : e))),
    [setCustom],
  )
  return { custom, add, remove, updateCategory, replace: setCustom }
}

/** 自定义分类：按应用分组 */
export function useCustomCategories() {
  const [customCategories, setCustomCategories] = usePersisted<Record<AppKey, string[]>>(
    'customCategories',
    {} as Record<AppKey, string[]>,
  )
  const addCategory = useCallback(
    (app: AppKey, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      setCustomCategories((prev) => {
        const list = prev[app] ?? []
        if (list.includes(trimmed)) return prev
        return { ...prev, [app]: [...list, trimmed] }
      })
    },
    [setCustomCategories],
  )
  const removeCategory = useCallback(
    (app: AppKey, name: string) =>
      setCustomCategories((prev) => ({ ...prev, [app]: (prev[app] ?? []).filter((c) => c !== name) })),
    [setCustomCategories],
  )
  return { customCategories, addCategory, removeCategory, replace: setCustomCategories }
}

/** 个人备注：条目 id -> 备注文本（与官方 note 区分） */
export function useEntryNotes() {
  const [entryNotes, setEntryNotes] = usePersisted<Record<string, string>>('entryNotes', {})
  const setNote = useCallback(
    (id: string, text: string) => {
      setEntryNotes((prev) => {
        const next = { ...prev }
        if (text.trim()) next[id] = text
        else delete next[id]
        return next
      })
    },
    [setEntryNotes],
  )
  return { entryNotes, setNote, replace: setEntryNotes }
}

/** 使用频次：条目 id -> 复制次数 */
export function useCopyCounts() {
  const [copyCounts, setCopyCounts] = usePersisted<Record<string, number>>('copyCounts', {})
  const recordCopy = useCallback(
    (id: string) => setCopyCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 })),
    [setCopyCounts],
  )
  const remove = useCallback(
    (id: string) => setCopyCounts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    }),
    [setCopyCounts],
  )
  return { copyCounts, recordCopy, remove }
}

/** 主题：dark / light */
export function useTheme() {
  const [theme, setTheme] = usePersisted<'dark' | 'light'>('theme', 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [setTheme])
  return { theme, toggle }
}

/** 界面语言：zh / en */
export function useLocale() {
  const [locale, setLocale] = usePersisted<Locale>('locale', 'zh')
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])
  const toggle = useCallback(() => setLocale((l) => (l === 'zh' ? 'en' : 'zh')), [setLocale])
  return { locale, setLocale, toggle }
}

/** 搜索历史（最多 8 条） */
export function useSearchHistory() {
  const [history, setHistory] = usePersisted<string[]>('history', [])
  const push = useCallback(
    (q: string) => {
      const term = q.trim()
      if (!term) return
      setHistory((prev) => [term, ...prev.filter((x) => x !== term)].slice(0, 8))
    },
    [setHistory],
  )
  const clear = useCallback(() => setHistory([]), [setHistory])
  return { history, push, clear }
}
