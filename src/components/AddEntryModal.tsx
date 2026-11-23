import {useState} from 'react'
import {Plus, X} from 'lucide-react'
import type {AppKey, Entry} from '../types'
import type {Dict} from '../i18n'

interface Props {
  appKey: AppKey
  categories: string[]
  onAdd: (entry: Entry & { app: AppKey }) => void
  onClose: () => void
  t: Dict
}

export default function AddEntryModal({ appKey, categories, onAdd, onClose, t }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0] ?? '自定义')
  const [purpose, setPurpose] = useState('')
  const [syntax, setSyntax] = useState('')
  const [example, setExample] = useState('')
  const [note, setNote] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !syntax.trim()) return
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      purpose: purpose.trim() || t.customDefault,
      syntax: syntax.trim(),
      example: example.trim(),
      note: note.trim(),
      tags: [category, name.trim()],
      custom: true,
      app: appKey,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h3><Plus size={17} /> {t.addCustomTitle}</h3>
          <button className="icon-btn" onClick={onClose} title={t.close}><X size={17} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-row two">
            <label>
              <span>{t.name} <em>*</em></span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} autoFocus />
            </label>
            <label>
              <span>{t.category}</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                {!categories.includes('自定义') && <option value="自定义">{t.custom}</option>}
              </select>
            </label>
          </div>
          <label>
            <span>{t.purpose}</span>
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder={t.purposePlaceholder} />
          </label>
          <label>
            <span>{t.thSyntax} <em>*</em></span>
            <input value={syntax} onChange={(e) => setSyntax(e.target.value)} placeholder={t.syntaxPlaceholder} />
          </label>
          <label>
            <span>{t.exampleLabel}</span>
            <input value={example} onChange={(e) => setExample(e.target.value)} placeholder={t.examplePlaceholder} />
          </label>
          <label>
            <span>{t.note}</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={t.notePlaceholder} />
          </label>
          <div className="modal-foot">
            <span className="modal-hint">{t.localOnly}</span>
            <button type="button" className="btn" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim() || !syntax.trim()}>{t.saveEntry}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
