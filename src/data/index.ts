import type {AppData} from '../types'
import {excelCategories, excelEntries} from './excel'
import {excelExtraCategories, excelExtraEntries} from './excel-extra'
import {wordCategories, wordEntries} from './word'
import {pptCategories, pptEntries} from './ppt'
import {windowsCategories, windowsEntries} from './windows'
import {wpsCategories, wpsEntries} from './wps'

// Excel 基础分类 + 进阶细化分类合并（去重，顺序为基础在前）
const mergedExcelCategories = [...new Set([...excelCategories, ...excelExtraCategories])]
// 自动生成的基础条目 + 手写补充的进阶条目
const mergedExcelEntries = [...excelEntries, ...excelExtraEntries]

export const apps: AppData[] = [
  {
    key: 'excel',
    label: 'Excel 公式',
    subtitle: '函数速查 · 可套用示例',
    icon: '📊',
    accent: '#16a34a',
    categories: mergedExcelCategories,
    entries: mergedExcelEntries,
  },
  {
    key: 'word',
    label: 'Word 技巧',
    subtitle: '快捷键 · 排版 · 高效操作',
    icon: '📝',
    accent: '#2563eb',
    categories: wordCategories,
    entries: wordEntries,
  },
  {
    key: 'ppt',
    label: 'PPT 技巧',
    subtitle: '演示 · 动画 · 放映捷径',
    icon: '📽️',
    accent: '#ea580c',
    categories: pptCategories,
    entries: pptEntries,
  },
  {
    key: 'windows',
    label: 'Windows 快捷键',
    subtitle: '系统操作 · 窗口管理 · 高效捷径',
    icon: '🪟',
    accent: '#0891b2',
    categories: windowsCategories,
    entries: windowsEntries,
  },
  {
    key: 'wps',
    label: 'WPS 技巧',
    subtitle: '文字表格演示 · PDF · 云文档',
    icon: '🗂️',
    accent: '#7c3aed',
    categories: wpsCategories,
    entries: wpsEntries,
  },
]

export const allEntries = apps.flatMap((app) =>
  app.entries.map((entry) => ({ ...entry, app: app.key, appLabel: app.label })),
)
