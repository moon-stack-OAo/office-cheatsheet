import type {Entry} from '../types'

export interface ExportEntry extends Entry {
  app?: string
  appLabel?: string
}

function stamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** 导出为 Excel .xlsx */
export async function exportExcel(entries: ExportEntry[], filename = `办公速查手册-${stamp()}.xlsx`) {
  const XLSX = await import('xlsx')
  const rows = entries.map((e) => ({
    '应用': e.appLabel ?? '',
    '分类': e.category,
    '名称': e.name,
    '用途': e.purpose,
    '写法 / 按键': e.syntax,
    '示例': e.example,
    '说明 / 结果': e.note ?? '',
    '版本 / 类型': e.badge ?? '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 10 }, { wch: 14 }, { wch: 22 }, { wch: 28 },
    { wch: 40 }, { wch: 42 }, { wch: 34 }, { wch: 12 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '速查表')
  XLSX.writeFile(wb, filename)
}

/** 导出为 Word .docx */
export async function exportWord(entries: ExportEntry[], filename = `办公速查手册-${stamp()}.docx`) {
  const {
    Document, Packer, Paragraph, Table, TableRow, TableCell,
    WidthType, AlignmentType, HeadingLevel, TextRun, BorderStyle,
  } = await import('docx')

  const border = { style: BorderStyle.SINGLE, size: 1, color: 'D9D9D9' }
  const borders = { top: border, bottom: border, left: border, right: border }
  const cell = (text: string, opts: { bold?: boolean; shade?: string; size?: number } = {}) =>
    new TableCell({
      borders,
      shading: opts.shade ? { fill: opts.shade } : undefined,
      margins: { top: 60, bottom: 60, left: 90, right: 90 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: opts.bold ?? false,
              size: opts.size ?? 18,
              color: opts.bold ? 'FFFFFF' : '1F2937',
            }),
          ],
        }),
      ],
    })

  const headerRow = new TableRow({
    tableHeader: true,
    children: ['分类', '名称', '用途', '写法 / 按键', '示例', '说明'].map((h) =>
      cell(h, { bold: true, shade: '2563EB' }),
    ),
  })

  const grouped = new Map<string, ExportEntry[]>()
  entries.forEach((e) => {
    const key = e.appLabel ? `${e.appLabel} · ${e.category}` : e.category
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(e)
  })

  const children: any[] = [
    new Paragraph({
      text: '办公速查手册',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      text: `Excel 公式 & Word 技巧 · 共 ${entries.length} 条 · 生成于 ${new Date().toLocaleString('zh-CN')}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
  ]

  grouped.forEach((items, groupName) => {
    children.push(new Paragraph({ text: groupName, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }))
    const rows = [
      headerRow,
      ...items.map((e) =>
        new TableRow({
          children: [
            cell(e.category),
            cell(e.name),
            cell(e.purpose),
            cell(e.syntax),
            cell(e.example),
            cell(e.note ?? ''),
          ],
        }),
      ),
    ]
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows,
      }),
    )
  })

  const doc = new Document({
    sections: [{ children }],
  })
  const blob = await Packer.toBlob(doc)
  download(blob, filename)
}

/** 导出为 Markdown */
export function exportMarkdown(entries: ExportEntry[], filename = `办公速查手册-${stamp()}.md`) {
  const grouped = new Map<string, ExportEntry[]>()
  entries.forEach((e) => {
    const key = e.appLabel ? `${e.appLabel} · ${e.category}` : e.category
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(e)
  })

  const lines: string[] = [
    '# 办公速查手册',
    '',
    `> Excel 公式 & Word 技巧 · 共 ${entries.length} 条 · 生成于 ${new Date().toLocaleString('zh-CN')}`,
    '',
  ]
  grouped.forEach((items, groupName) => {
    lines.push(`## ${groupName}`, '')
    lines.push('| 名称 | 用途 | 写法 / 按键 | 示例 | 说明 |')
    lines.push('| :--- | :--- | :--- | :--- | :--- |')
    items.forEach((e) => {
      const cells = [e.name, e.purpose, e.syntax, e.example, e.note ?? ''].map((v) =>
        String(v).replace(/\|/g, '\\|').replace(/\n/g, ' '),
      )
      lines.push(`| ${cells.join(' | ')} |`)
    })
    lines.push('')
  })
  download(new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' }), filename)
}

/** 打印 / 另存为 PDF */
export function exportPrint(_entries: ExportEntry[]) {
  window.print()
}
