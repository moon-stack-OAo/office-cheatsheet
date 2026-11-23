import {useState} from 'react'
import {StickyNote, X} from 'lucide-react'
import type {Entry} from '../types'
import type {Dict} from '../i18n'
import {fmt} from '../i18n'

interface Props {
  entry: Entry
  note: string
  onSave: (text: string) => void
  onClose: () => void
  t: Dict
}

export default function NoteModal({ entry, note, onSave, onClose, t }: Props) {
  const [text, setText] = useState(note)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(text)
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h3><StickyNote size={17} /> {fmt(t.myNoteTitle, { name: entry.name })}</h3>
          <button className="icon-btn" onClick={onClose} title={t.close}><X size={17} /></button>
        </div>
        <form onSubmit={submit}>
          <label>
            <span>{t.noteFieldLabel}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={t.personalNotePlaceholder}
              autoFocus
            />
          </label>
          <div className="modal-foot">
            <span className="modal-hint">{text.trim() ? t.noteHintSaved : t.noteHintClear}</span>
            <button type="button" className="btn" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary">{t.saveNote}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
