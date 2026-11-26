import {CircleHelp, X} from 'lucide-react'
import type {Dict} from '../i18n'

interface Props {
  onClose: () => void
  t: Dict
}

export default function ShortcutsHelpModal({ onClose, t }: Props) {
  const shortcuts: Array<{ keys: string[]; desc: string }> = [
    { keys: ['/'], desc: t.scFocus },
    { keys: ['j'], desc: t.scNext },
    { keys: ['k'], desc: t.scPrev },
    { keys: ['Enter'], desc: t.scCopy },
    { keys: ['?'], desc: t.scHelp },
    { keys: ['Esc'], desc: t.scEsc },
  ]

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal help-modal">
        <div className="modal-head">
          <h3><CircleHelp size={16} strokeWidth={1.5} /> {t.helpModalTitle}</h3>
          <button className="icon-btn" onClick={onClose} title={t.close}><X size={16} strokeWidth={1.5} /></button>
        </div>
        <p className="help-intro">{t.helpIntro}</p>
        <div className="help-list">
          {shortcuts.map((item) => (
            <div className="help-row" key={item.keys.join('-')}>
              <span className="help-keys">
                {item.keys.map((k) => <kbd key={k}>{k}</kbd>)}
              </span>
              <span className="help-desc">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <span className="modal-hint">{t.escHint}</span>
          <button className="btn btn-primary" onClick={onClose}>{t.gotIt}</button>
        </div>
      </div>
    </div>
  )
}
