export type AppKey = 'excel' | 'word' | 'ppt' | 'windows' | 'wps'

/** 一条速查条目：Excel 公式 / Word 技巧 / 快捷键等 */
export interface Entry {
  id: string
  /** 名称：函数名 / 技巧名 / 快捷键 */
  name: string
  /** 分类，如「数学与统计」「编辑快捷键」 */
  category: string
  /** 用途说明 */
  purpose: string
  /** 标准写法 / 操作方式 */
  syntax: string
  /** 示例 */
  example: string
  /** 补充说明 / 结果 / 注意事项 */
  note?: string
  /** 版本或适用性标注，如 365 / 2021+ */
  badge?: string
  /** 搜索关键词 */
  tags?: string[]
  /** 是否标记为常用（首页优先展示） */
  featured?: boolean
  /** 用户自定义条目 */
  custom?: boolean
}

export interface AppData {
  key: AppKey
  label: string
  subtitle: string
  icon: string
  accent: string
  categories: string[]
  entries: Entry[]
}

export type ExportScope = 'all' | 'filtered' | 'visible'

/** 数据备份文件结构（收藏 / 自建 / 自定义分类 / 个人备注） */
export interface BackupData {
  /** 备份格式版本 */
  version: number
  /** 导出时间（ISO 字符串） */
  exportedAt: string
  /** 收藏的条目 id 列表 */
  favorites: string[]
  /** 用户自定义条目（含所属应用） */
  custom: Array<Entry & { app: AppKey }>
  /** 按应用分组的自定义分类 */
  customCategories: Record<AppKey, string[]>
  /** 条目 id -> 个人备注 */
  entryNotes: Record<string, string>
}
