import {useState} from 'react'
import {CalendarDays, Check, Copy, Shuffle, Star, X} from 'lucide-react'
import type {AppKey, Entry} from '../types'
import type {Dict} from '../i18n'
import {highlight} from '../utils/highlight'

export type DailyEntry = Entry & { app: AppKey; appLabel: string }

interface Props {
  entries: DailyEntry[]
  isFav: (id: string) => boolean
  onToggleFav: (id: string) => void
  /** 复制写法时的回调（记录频次 + 提示） */
  onCopy: (entry: DailyEntry) => void
  onClose: () => void
  t: Dict
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** djb2 变体：同一日期字符串总是得到同一个下标 */
function seedIndex(seed: string, length: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return h % length
}

async function copyText(text: string): Promise<void> {
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
}

export default function DailyPickModal({ entries, isFav, onToggleFav, onCopy, onClose, t }: Props) {
  const [dateKey] = useState(todayKey)
  const [index, setIndex] = useState(() => (entries.length ? seedIndex(dateKey, entries.length) : 0))
  const [copied, setCopied] = useState(false)

  const entry = entries[index]

  const shuffle = () => {
    if (entries.length <= 1) return
    setIndex((prev) => {
      let next = prev
      while (next === prev) next = Math.floor(Math.random() * entries.length)
      return next
    })
    setCopied(false)
  }

  const copySyntax = async () => {
    if (!entry) return
    await copyText(entry.syntax)
    onCopy(entry)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const fav = entry ? isFav(entry.id) : false

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal daily-modal">
        <div className="modal-head">
          <h3><CalendarDays size={16} strokeWidth={1.5} /> {t.daily} <small className="daily-date">{dateKey}</small></h3>
          <button className="icon-btn" onClick={onClose} title={t.close}><X size={16} strokeWidth={1.5} /></button>
        </div>

        {!entry ? (
          <p className="daily-empty">{t.dailyEmpty}</p>
        ) : (
          <>
            <div className="daily-meta">
              <span className="daily-app">{entry.appLabel}</span>
              <span className="daily-cat">{entry.category}</span>
              {entry.badge && <span className="entry-badge sm">{entry.badge}</span>}
              {entry.custom && <span className="entry-badge custom sm">{t.custom}</span>}
              <span className="daily-seed">{t.dailyOne}</span>
            </div>

            <h4 className="daily-name">{entry.name}</h4>
            <p className="daily-purpose">{entry.purpose}</p>

            <div className="daily-field">
              <span className="field-label">{t.thSyntax}</span>
              <code className="daily-code" dangerouslySetInnerHTML={{ __html: highlight(entry.syntax) }} />
            </div>
            {entry.example && (
              <div className="daily-field">
                <span className="field-label">{t.exampleLabel}</span>
                <code className="daily-code" dangerouslySetInnerHTML={{ __html: highlight(entry.example) }} />
              </div>
            )}
            {entry.note && <p className="daily-note">{entry.note}</p>}

            <div className="daily-actions">
              <button className="btn btn-primary" onClick={copySyntax}>
                {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                {copied ? t.copied : t.copySyntax}
              </button>
              <button className={`btn ${fav ? 'daily-fav-on' : ''}`} onClick={() => onToggleFav(entry.id)}>
                <Star size={14} strokeWidth={1.5} fill={fav ? 'currentColor' : 'none'} />
                {fav ? t.unfav : t.fav}
              </button>
              <button className="btn" onClick={shuffle} title={t.shuffleTitle}>
                <Shuffle size={14} strokeWidth={1.5} /> {t.shuffle}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
