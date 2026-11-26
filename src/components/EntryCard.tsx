import {useState} from 'react'
import {Bookmark, Check, Copy, Pencil, Star, Trash2} from 'lucide-react'
import type {Entry} from '../types'
import type {Dict} from '../i18n'
import {highlight} from '../utils/highlight'

interface Props {
  entry: Entry
  isFav: boolean
  onToggleFav: () => void
  onRemove?: () => void
  /** 我的备注（独立于官方 note） */
  personalNote?: string
  /** 复制次数 */
  copyCount?: number
  /** 编辑我的备注 */
  onEditNote?: () => void
  /** 每次复制写法/示例时回调，用于频次统计 */
  onCopy?: () => void
  /** 键盘导航用的 DOM id */
  cardId?: string
  /** 是否被键盘焦点高亮 */
  focused?: boolean
  t: Dict
}

export default function EntryCard({
  entry, isFav, onToggleFav, onRemove, personalNote, copyCount = 0, onEditNote, onCopy,
  cardId, focused = false, t,
}: Props) {
  const [copied, setCopied] = useState<'syntax' | 'example' | null>(null)

  const copy = async (text: string, which: 'syntax' | 'example') => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    onCopy?.()
    setCopied(which)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <article id={cardId} className={`entry-card ${isFav ? 'is-fav' : ''} ${focused ? 'is-focused' : ''}`}>
      <div className="entry-head">
        <div className="entry-title-line">
          <h3 className="entry-name">{entry.name}</h3>
          {entry.badge && <span className="entry-badge">{entry.badge}</span>}
          {entry.featured && <span className="entry-star" title={t.officialFeatured}><Bookmark size={12} strokeWidth={1.5} fill="currentColor" /> {t.featured}</span>}
          {entry.custom && <span className="entry-badge custom">{t.custom}</span>}
          {copyCount > 0 && <span className="copy-badge" title={t.copyCountTitle}>×{copyCount}</span>}
          <div className="entry-head-actions">
            {onEditNote && (
              <button className="icon-btn" onClick={onEditNote} title={t.editNote}>
                <Pencil size={14} strokeWidth={1.5} />
              </button>
            )}
            {onRemove && (
              <button className="icon-btn danger" onClick={onRemove} title={t.deleteCustom}>
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            )}
            <button className={`icon-btn ${isFav ? 'fav' : ''}`} onClick={onToggleFav} title={isFav ? t.unfav : t.fav}>
              <Star size={14} strokeWidth={1.5} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        <p className="entry-purpose">{entry.purpose}</p>
      </div>

      <div className="entry-body">
        <div className="entry-field">
          <span className="field-label">{t.thSyntax}</span>
          <div className="code-line">
            <code dangerouslySetInnerHTML={{ __html: highlight(entry.syntax) }} />
            <button className="copy-btn" onClick={() => copy(entry.syntax, 'syntax')} title={t.copySyntax}>
              {copied === 'syntax' ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        {entry.example && (
          <div className="entry-field">
            <span className="field-label">{t.exampleLabel}</span>
            <div className="code-line">
              <code dangerouslySetInnerHTML={{ __html: highlight(entry.example) }} />
              <button className="copy-btn" onClick={() => copy(entry.example, 'example')} title={t.copyExample}>
                {copied === 'example' ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        )}
        {entry.note && <p className="entry-note">{entry.note}</p>}
        {personalNote && (
          <div className="personal-note">
            <div className="personal-note-head">
              <span><Pencil size={12} strokeWidth={1.5} /> {t.myNote}</span>
              {onEditNote && <button onClick={onEditNote} title={t.edit}>{t.edit}</button>}
            </div>
            <p>{personalNote}</p>
          </div>
        )}
      </div>
    </article>
  )
}
