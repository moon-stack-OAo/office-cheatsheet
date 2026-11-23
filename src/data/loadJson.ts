import type {AppData, AppKey, Entry} from '../types'

const APP_KEYS: AppKey[] = ['excel', 'word', 'ppt', 'windows', 'wps']
const DATA_BASE = `${import.meta.env.BASE_URL}data/`

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function toEntry(value: unknown): Entry | null {
  if (!isRecord(value)) return null
  if (!str(value.id) || !str(value.name) || !str(value.category) || !str(value.purpose) || !str(value.syntax)) {
    return null
  }
  return {
    id: str(value.id),
    name: str(value.name),
    category: str(value.category),
    purpose: str(value.purpose),
    syntax: str(value.syntax),
    example: str(value.example),
    ...(typeof value.note === 'string' ? { note: value.note } : {}),
    ...(typeof value.badge === 'string' ? { badge: value.badge } : {}),
    ...(Array.isArray(value.tags) ? { tags: value.tags.filter((t): t is string => typeof t === 'string') } : {}),
    ...(typeof value.featured === 'boolean' ? { featured: value.featured } : {}),
    ...(typeof value.custom === 'boolean' ? { custom: value.custom } : {}),
  }
}

function toApp(value: unknown): AppData | null {
  if (!isRecord(value) || !APP_KEYS.includes(str(value.key) as AppKey)) return null
  if (!Array.isArray(value.categories) || !Array.isArray(value.entries)) return null
  const entries = value.entries.map(toEntry).filter((e): e is Entry => Boolean(e))
  if (entries.length !== value.entries.length) return null
  return {
    key: str(value.key) as AppKey,
    label: str(value.label),
    subtitle: str(value.subtitle),
    icon: str(value.icon),
    accent: str(value.accent),
    categories: value.categories.filter((c): c is string => typeof c === 'string'),
    entries,
  }
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`加载失败: ${url} (${res.status})`)
  return res.json()
}

/**
 * 从 public/data 下的 JSON 读取应用数据。
 * 任一环节失败都向上抛错，由调用方回退到内置数据（保证离线 / 本地直开可用）。
 */
export async function loadAppsFromJson(): Promise<AppData[]> {
  const index = await getJson(`${DATA_BASE}index.json`)
  if (!isRecord(index) || !Array.isArray(index.apps)) throw new Error('数据索引格式不正确')

  const loaded = await Promise.all(
    index.apps.map(async (file) => {
      if (typeof file !== 'string' || !/^[\w-]+\.json$/.test(file)) throw new Error(`非法数据文件名: ${String(file)}`)
      const app = toApp(await getJson(`${DATA_BASE}${file}`))
      if (!app) throw new Error(`数据文件内容不正确: ${file}`)
      return app
    }),
  )

  const byKey = new Map<AppKey, AppData>(loaded.map((app) => [app.key, app]))
  if (!APP_KEYS.every((key) => byKey.has(key))) throw new Error('数据文件缺少应用')
  return APP_KEYS.map((key) => byKey.get(key)!)
}
