import {CheckCircle2, X, XCircle} from 'lucide-react'
import type {Dict} from '../i18n'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface Props {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
  t: Dict
}

export default function Toast({ toasts, onDismiss, t }: Props) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-stack">
      {toasts.map((item) => (
        <div key={item.id} className={`toast ${item.type}`} role="status">
          {item.type === 'error' ? <XCircle size={16} strokeWidth={1.5} /> : <CheckCircle2 size={16} strokeWidth={1.5} />}
          <span>{item.message}</span>
          <button onClick={() => onDismiss(item.id)} title={t.close}><X size={14} strokeWidth={1.5} /></button>
        </div>
      ))}
    </div>
  )
}
