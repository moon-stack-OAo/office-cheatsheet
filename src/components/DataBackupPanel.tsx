import {useRef} from 'react'
import {Database, Download, FileInput, Upload} from 'lucide-react'
import type {AppKey, BackupData, Entry} from '../types'
import type {Dict} from '../i18n'
import {fmt} from '../i18n'
import type {ToastType} from './Toast'

interface Props {
  favorites: string[]
  custom: Array<Entry & { app: AppKey }>
  customCategories: Record<AppKey, string[]>
  entryNotes: Record<string, string>
  onImport: (data: BackupData) => void
  onToast: (message: string, type: ToastType) => void
  onOpenBatchImport: () => void
  t: Dict
}

function stamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

/** 校验导入对象，结构不符返回 null */
function validateBackup(value: unknown): BackupData | null {
  if (!value || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>
  if (!Array.isArray(obj.favorites) || !Array.isArray(obj.custom)) return null
  if (!obj.customCategories || typeof obj.customCategories !== 'object' || Array.isArray(obj.customCategories)) return null
  if (!obj.entryNotes || typeof obj.entryNotes !== 'object' || Array.isArray(obj.entryNotes)) return null
  return {
    version: typeof obj.version === 'number' ? obj.version : 1,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : '',
    favorites: obj.favorites as string[],
    custom: obj.custom as Array<Entry & { app: AppKey }>,
    customCategories: obj.customCategories as Record<AppKey, string[]>,
    entryNotes: obj.entryNotes as Record<string, string>,
  }
}

export default function DataBackupPanel({
  favorites, custom, customCategories, entryNotes, onImport, onToast, onOpenBatchImport, t,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const exportBackup = () => {
    const data: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites,
      custom,
      customCategories,
      entryNotes,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `office-cheatsheet-backup-${stamp()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    onToast(t.backupDone, 'success')
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = validateBackup(JSON.parse(String(reader.result)))
        if (!data) {
          onToast(t.badBackup, 'error')
          return
        }
        onImport(data)
        onToast(fmt(t.restored, { c: data.custom.length, f: data.favorites.length }), 'success')
      } catch {
        onToast(t.invalidJson, 'error')
      }
    }
    reader.onerror = () => onToast(t.readFail, 'error')
    reader.readAsText(file)
  }

  return (
    <div className="backup-panel">
      <div className="backup-title"><Database size={13} /> {t.dataBackup}</div>
      <div className="backup-actions">
        <button className="backup-btn" onClick={exportBackup} title={t.exportBackupTitle}>
          <Download size={13} /> {t.exportBackup}
        </button>
        <button className="backup-btn" onClick={() => fileRef.current?.click()} title={t.importBackupTitle}>
          <Upload size={13} /> {t.importBackup}
        </button>
      </div>
      <button className="backup-btn batch" onClick={onOpenBatchImport}>
        <FileInput size={13} /> {t.batchImport}
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden />
    </div>
  )
}
