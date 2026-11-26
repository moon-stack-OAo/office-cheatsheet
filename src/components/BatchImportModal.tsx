import {useState} from 'react'
import {AlertTriangle, CheckCircle2, FileInput, X} from 'lucide-react'
import type {AppKey, Entry} from '../types'
import type {Dict} from '../i18n'
import {fmt} from '../i18n'

interface Props {
  appKey: AppKey
  categories: string[]
  onImport: (entries: Array<Entry & { app: AppKey }>) => void
  onClose: () => void
  t: Dict
}

interface Failure {
  line: number
  reason: string
}

interface ParseResult {
  entries: Array<Entry & { app: AppKey }>
  failures: Failure[]
}

const SAMPLE = 'VLOOKUP|查找函数|按首列查找返回值|=VLOOKUP(A2,B:C,2,0)|=VLOOKUP("苹果",价格表,2,0)|注意第 3 参数是列序号'

function parse(text: string, appKey: AppKey, t: Dict): ParseResult {
  const entries: Array<Entry & { app: AppKey }> = []
  const failures: Failure[] = []
  text.split(/\r?\n/).forEach((raw, idx) => {
    const line = raw.trim()
    if (!line) return
    const parts = (line.includes('\t') ? line.split('\t') : line.split('|')).map((p) => p.trim())
    const [name, category, purpose, syntax, example, note] = parts
    if (!name) {
      failures.push({ line: idx + 1, reason: t.missName })
      return
    }
    if (!syntax) {
      failures.push({ line: idx + 1, reason: t.missSyntax })
      return
    }
    const cat = category || '自定义'
    entries.push({
      id: `custom-${Date.now()}-${idx}`,
      name,
      category: cat,
      purpose: purpose || t.customDefault,
      syntax,
      example: example ?? '',
      note: note || undefined,
      tags: [cat, name],
      custom: true,
      app: appKey,
    })
  })
  return { entries, failures }
}

export default function BatchImportModal({ appKey, categories, onImport, onClose, t }: Props) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ParseResult | null>(null)

  const run = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parse(text, appKey, t)
    if (parsed.entries.length > 0) onImport(parsed.entries)
    setResult(parsed)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h3><FileInput size={16} strokeWidth={1.5} /> {t.batchTitle}</h3>
          <button className="icon-btn" onClick={onClose} title={t.close}><X size={16} strokeWidth={1.5} /></button>
        </div>
        <form onSubmit={run}>
          <div className="import-format">
            {t.batchFormat} <code>Tab</code> / <code>|</code>
            <strong>{t.batchFields}</strong>
            <button type="button" className="link-btn" onClick={() => setText(SAMPLE)}>{t.fillSample}</button>
          </div>
          <label>
            <span>{t.pasteLabel}</span>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setResult(null) }}
              rows={8}
              placeholder={t.batchPlaceholder}
              autoFocus
            />
          </label>
          {categories.length > 0 && (
            <div className="import-hint">{t.existingCats}{categories.slice(0, 8).join('、')}{categories.length > 8 ? '…' : ''}</div>
          )}
          {result && (
            <div className="import-result">
              <div className="import-summary">
                <span className="ok"><CheckCircle2 size={14} strokeWidth={1.5} /> {fmt(t.successCount, { n: result.entries.length })}</span>
                {result.failures.length > 0 && (
                  <span className="bad"><AlertTriangle size={14} strokeWidth={1.5} /> {fmt(t.failCount, { n: result.failures.length })}</span>
                )}
                {result.entries.length === 0 && result.failures.length === 0 && <span className="bad">{t.nothingToImport}</span>}
              </div>
              {result.failures.length > 0 && (
                <ul className="import-errors">
                  {result.failures.map((f) => <li key={f.line}>{fmt(t.lineNo, { n: f.line })}{f.reason}</li>)}
                </ul>
              )}
            </div>
          )}
          <div className="modal-foot">
            <span className="modal-hint">{t.importLocal}</span>
            {result ? (
              <button type="button" className="btn btn-primary" onClick={onClose}>{t.done}</button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={!text.trim()}>{t.parseImport}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
