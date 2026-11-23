import type {Entry} from '../types'
import type {Locale} from '../i18n'

/**
 * 小型「常用汉字 → 拼音」映射，覆盖速查条目标题中的常见汉字。
 * 不追求 100% 覆盖：未收录的字按原字符参与匹配（中文精确搜索仍可用）。
 */
const PINYIN_RAW = `
身shen 份fen 证zheng 提ti 取qu 出chu 生sheng 日ri 期qi 判pan 断duan 性xing 别bie 手shou 机ji 中zhong
间jian 四si 位wei 打da 码ma 找zhao 不bu 到dao 显xian 示shi 空kong 白bai 标biao 记ji 重chong 复fu
核he 对dui 两liang 列lie 差cha 计ji 算suan 迟chi 分fen 钟zhong 数shu 文wen 星xing 隔ge 行hang 奇qi
偶ou 求qiu 和he 从cong 混hun 本ben 字zi 进jin 阶jie 组zu 新xin 建jian 档dang 开kai 件jian 保bao
存cun 另ling 为wei 关guan 闭bi 程cheng 序xu 撤che 销xiao 恢hui 制zhi 剪jian 贴tie 选xuan 择ze
全quan 上shang 一yi 步bu 操cao 作zuo 插cha 入ru 页ye 符fu 节jie 换huan 段duan 删shan 除chu 首shou
尾wei 落luo 移yi 下xia 加jia 粗cu 倾qing 斜xie 增zeng 大da 缩suo 小xiao 快kuai 速su 放fang 居ju
齐qi 端duan 左zuo 右you 倍bei 距ju 单dan 双shuang 项xiang 目mu 清qing 格ge 式shi 刷shua 连lian
续xu 使shi 用yong 突tu 应ying 题ti 样yang 正zheng 更geng 导dao 航hang 窗chuang 自zi 动dong 完wan
成cheng 录lu 隐yin 藏cang 编bian 辑ji 眉mei 脚jiao 替ti 定ding 通tong 配pei 批pi 量liang 超chao
链lian 表biao 内nei 平ping 均jun 布bu 跨kua 拆chai 元yuan 图tu 片pian 环huan 绕rao 注zhu 与yu
交jiao 叉cha 引yin 拼pin 写xie 检jian 屏ping 阅yue 读du 视shi 统tong 尺chi 草cao 稿gao 面mian
邮you 并bing 护hu 比bi 集ji 域yu 代dai 强qiang 印yin 预yu 览lan 消xiao 公gong 器qi 幻huan 灯deng
部bu 版ban 象xiang 置zhi 于yu 顶ding 层ceng 底di 等deng 例li 设she 背bei 景jing 母mu 主zhu 色se
体ti 嵌qian 添tian 画hua 触chu 发fa 头tou 映ying 当dang 前qian 结jie 束shu 黑hei 跳tiao 转zhuan
指zhi 演yan 讲jiang 者zhe 备bei 激ji 光guang 针zhen 幕mu 包bao 鼠shu 滚gun 轮lun 翻fan 资zi 源yuan
管guan 理li 夹jia 命ming 回hui 收shou 永yong 久jiu 地di 址zhi 栏lan 返fan 级ji 口kou 任ren 务wu
桌zhuo 半ban 靠kao 最zui 化hua 还hai 原yuan 所suo 有you 虚xu 锁suo 运yun 话hua 框kuang 系xi 搜sou
心xin 截jie 区qu 镜jing 语yu 音yin 输shu 情qing 看kan 信xin 息xi 做zuo 词ci 软ruan 车che 高gao
户hu 菜cai 投tou 影ying 蓝lan 牙ya 轻qing 松song 法fa 言yan 键jian 盘pan 游you 戏xi 以yi 员yuan
令ling 在zai 此ci 处chu 终zhong 浏liu 历li 史shi 补bu 纸zhi 模mo 朗lang 智zhi 能neng 排pai 密mi
填tian 充chong 据ju 透tou 条tiao 函han 参can 美mei 频pin 实shi 遥yao 控kong 压ya 云yun 多duo 人ren
协xie 稻dao 壳ke 板ban 素su 材cai 漫man 需xu 果guo 说shuo 明ming 风feng 荐jian 减jian 积ji 识shi
海hai 享xiang 执zhi 界jie 登deng 方fang 宽kuan 特te 殊shu 颜yan 形xing 状zhuang 过guo 渡du 击ji
始shi 临lin 笔bi 绘hui 流liu 构gou 媒mei 站zhan 边bian 索suo 知zhi 具ju 启qi 属shu 辅fu 助zhu
功gong 同tong 摸mo
`

const PINYIN = new Map<string, string>()
for (const token of PINYIN_RAW.trim().split(/\s+/)) {
  // 每项形如「新xin」：首字符是汉字，其余为拼音
  const ch = token[0]
  const py = token.slice(1)
  if (ch && /^[a-z]+$/.test(py)) PINYIN.set(ch, py)
}

interface PinyinForm {
  full: string
  initials: string
}

function pinyinForm(text: string): PinyinForm {
  let full = ''
  let initials = ''
  for (const ch of text.toLowerCase()) {
    const py = PINYIN.get(ch)
    if (py) {
      full += py
      initials += py[0]
    } else {
      full += ch
      if (/[a-z0-9]/.test(ch)) initials += ch
    }
  }
  return { full, initials }
}

/** 字符顺序一致的模糊匹配（如 vlkp → VLOOKUP），返回 0~1 的紧密度 */
function subsequenceScore(needle: string, hay: string): number {
  if (needle.length < 2 || needle.length > hay.length) return 0
  let ni = 0
  for (let hi = 0; hi < hay.length && ni < needle.length; hi += 1) {
    if (hay[hi] === needle[ni]) ni += 1
  }
  return ni === needle.length ? needle.length / hay.length : 0
}

/** 单个词在单个字段上的最佳得分 */
function fieldScore(token: string, text: string, weight: number): number {
  const lower = text.toLowerCase()
  if (!lower) return 0
  let score = 0

  const idx = lower.indexOf(token)
  if (idx >= 0) {
    score = weight * (0.7 + (0.3 * token.length) / Math.max(lower.length, 1))
    if (idx === 0) score *= 1.15
  } else {
    score = weight * 0.55 * subsequenceScore(token, lower)
  }

  // 拼音全拼 / 首字母（仅对字母数字查询词有意义）
  if (/^[a-z0-9]+$/.test(token)) {
    const py = pinyinForm(lower)
    if (py.full.includes(token)) score = Math.max(score, weight * 0.8)
    if (py.initials.includes(token)) score = Math.max(score, weight * 0.65)
  }
  return score
}

/**
 * 多词 AND 匹配 + 字段加权。返回 0 表示不匹配，>0 为排序分数。
 * 权重：名称 > 标签 > 用途/写法 > 分类 > 示例 > 备注。
 */
export function fuzzyMatch(query: string, entry: Entry, locale: Locale = 'zh'): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  const tokens = q.split(/\s+/).filter(Boolean)
  const nameWeight = locale === 'en' ? 12 : 10
  const fields: Array<{ text: string; weight: number }> = [
    { text: entry.name, weight: nameWeight },
    { text: (entry.tags ?? []).join(' '), weight: 6 },
    { text: entry.purpose, weight: 4 },
    { text: entry.syntax, weight: 4 },
    { text: entry.category, weight: 3 },
    { text: entry.example, weight: 2 },
    { text: entry.note ?? '', weight: 1 },
  ]

  let total = 0
  for (const token of tokens) {
    let best = 0
    for (const field of fields) {
      best = Math.max(best, fieldScore(token, field.text, field.weight))
    }
    if (best <= 0) return 0
    total += best
  }
  return total
}
