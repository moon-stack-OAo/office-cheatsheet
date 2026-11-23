/**
 * 轻量语法高亮：把公式 / 快捷键文本转成带 class 的 HTML 片段。
 * 不引入任何依赖；所有文本（含 token 内部）都会经过 HTML 转义，避免 XSS。
 */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 分组顺序即优先级：
 * 1. 字符串（引号内，含转义字符）——整体匹配，避免内部内容被二次解析
 * 2. 函数名（= 后紧跟的标识符）——用变长 lookbehind，仅匹配名字本身
 * 3. 数字
 * 4. 比较 / 逻辑 / 算术符号
 * 5. 连续中文（参数占位符）
 */
const TOKEN_RE =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|((?<==\s*)[A-Za-z_][A-Za-z0-9_.]*)|(\d+(?:\.\d+)?)|(<=|>=|<>|!=|&&|\|\||[<>=+\-*/])|([\u4e00-\u9fff]+)/g

function classOf(match: RegExpExecArray): string {
  if (match[1]) return 'hl-str'
  if (match[2]) return 'hl-fn'
  if (match[3]) return 'hl-num'
  if (match[4]) return 'hl-op'
  if (match[5]) return 'hl-zh'
  return ''
}

/** 返回可直接用于 dangerouslySetInnerHTML 的安全 HTML。 */
export function highlight(text: string): string {
  if (!text) return ''
  let out = ''
  let last = 0
  TOKEN_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = TOKEN_RE.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, match.index))
    const cls = classOf(match)
    const token = escapeHtml(match[0])
    out += cls ? `<span class="${cls}">${token}</span>` : token
    last = match.index + match[0].length
  }
  out += escapeHtml(text.slice(last))
  return out
}
