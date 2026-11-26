import {useEffect, useRef, useState} from 'react'
import {Check, ChevronDown, FileDown, FileSpreadsheet, FileText, Loader2, Printer} from 'lucide-react'
import type {Dict} from '../i18n'
import type {ExportEntry} from '../utils/export'
import {exportExcel, exportMarkdown, exportPrint, exportWord} from '../utils/export'

interface Props {
  entries: ExportEntry[]
  t: Dict
}

type Format = 'excel' | 'word' | 'md' | 'print'

export default function ExportMenu({ entries, t }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<Format | null>(null)
  const [done, setDone] = useState<Format | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const run = async (fmt: Format) => {
    setOpen(false)
    setBusy(fmt)
    try {
      if (fmt === 'excel') await exportExcel(entries)
      if (fmt === 'word') await exportWord(entries)
      if (fmt === 'md') exportMarkdown(entries)
      if (fmt === 'print') exportPrint(entries)
      setDone(fmt)
      setTimeout(() => setDone(null), 1600)
    } catch (err) {
      console.error(err)
      alert(t.exportFail)
    } finally {
      setBusy(null)
    }
  }

  const items: Array<{ key: Format; icon: React.ReactNode; label: string; desc: string }> = [
    { key: 'excel', icon: <FileSpreadsheet size={16} strokeWidth={1.5} />, label: t.exportExcel, desc: t.excelDesc },
    { key: 'word', icon: <FileText size={16} strokeWidth={1.5} />, label: t.exportWord, desc: t.wordDesc },
    { key: 'md', icon: <FileDown size={16} strokeWidth={1.5} />, label: t.exportMarkdown, desc: t.mdDesc },
    { key: 'print', icon: <Printer size={16} strokeWidth={1.5} />, label: t.exportPrint, desc: t.printDesc },
  ]

  return (
    <div className="export-wrap" ref={ref}>
      <button className="btn btn-primary" onClick={() => setOpen((v) => !v)} disabled={!!busy}>
        {busy ? <Loader2 size={16} strokeWidth={1.5} className="spin" /> : done ? <Check size={16} strokeWidth={1.5} /> : <FileDown size={16} strokeWidth={1.5} />}
        {busy ? t.exporting : `${t.exportCount.replace('{n}', String(entries.length))}`}
        <ChevronDown size={14} strokeWidth={1.5} className={open ? 'chevron open' : 'chevron'} />
      </button>
      {open && (
        <div className="export-menu">
          <div className="export-menu-title">{t.chooseFormat}</div>
          {items.map((it) => (
            <button key={it.key} className="export-item" onClick={() => run(it.key)}>
              <span className="export-icon">{it.icon}</span>
              <span>
                <strong>{it.label}</strong>
                <small>{it.desc}</small>
              </span>
            </button>
          ))}
          <div className="export-hint">{t.exportHint}</div>
        </div>
      )}
    </div>
  )
}
