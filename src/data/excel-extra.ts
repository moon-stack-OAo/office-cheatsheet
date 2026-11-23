import type {Entry} from '../types'

// 进阶函数的细化分类：这些分类名会由 index.ts 合并进 Excel 应用的 categories，
// 从而自动出现在侧栏。基础分类名沿用 excel.ts 中的 8 类。
export const excelExtraCategories = [
  '数学与统计',
  '文本处理',
  '查找与引用',
  '逻辑判断',
  '动态数组',
  '文本进阶',
  '数组与重塑',
  '查找进阶',
  '统计进阶',
  '逻辑进阶',
]

// 分类, 名称, 用途, 写法, 示例, 备注, 常用
// id 使用 excel-extra-xxx，避免与自动生成的 excel-xxx 冲突
const raw: Array<[string, string, string, string, string, string?, boolean?]> = [
  // ── 文本进阶 ──
  ['文本进阶', 'TEXTBEFORE', '取分隔符之前的文本', '=TEXTBEFORE(文本,分隔符,[实例],[匹配方式])', '=TEXTBEFORE("a-b-c","-") 返回 "a"', '365 / 2021+，比 LEFT+FIND 更简洁', true],
  ['文本进阶', 'TEXTAFTER', '取分隔符之后的文本', '=TEXTAFTER(文本,分隔符,[实例],[匹配方式])', '=TEXTAFTER("a-b-c","-") 返回 "b-c"', '365 / 2021+', true],
  ['文本进阶', 'TEXTSPLIT', '按分隔符拆分文本到行列', '=TEXTSPLIT(文本,[列分隔符],[行分隔符])', '=TEXTSPLIT("a,b;c",",",";")', '365 / 2021+，替代分列操作', true],
  ['文本进阶', 'TEXTJOIN 进阶', '用分隔符合并多段文本', '=TEXTJOIN(分隔符,忽略空值,区域)', '=TEXTJOIN("、",TRUE,A1:A5)', '可配合 FILTER 拼接筛选结果', false],

  // ── 文本处理 ──
  ['文本处理', 'CONCAT', '合并区域文本（无分隔符）', '=CONCAT(区域1,区域2,…)', '=CONCAT(A1:A3,B1:B3)', '比 CONCATENATE 更简洁，支持区域', false],
  ['文本处理', 'NUMBERVALUE', '文本转数字并指定小数点/千分位', '=NUMBERVALUE(文本,[小数点],[千分位])', '=NUMBERVALUE("1.234,56",",",".") 返回 1234.56', '处理欧式数字格式', false],

  // ── 数组与重塑 ──
  ['数组与重塑', 'VSTACK', '垂直堆叠多个数组', '=VSTACK(数组1,数组2,…)', '=VSTACK(A1:B3,D1:E3)', '365 / 2021+，纵向合并', true],
  ['数组与重塑', 'HSTACK', '水平拼接多个数组', '=HSTACK(数组1,数组2,…)', '=HSTACK(A1:A3,B1:B3)', '365 / 2021+，横向合并', true],
  ['数组与重塑', 'TOROW', '把区域转为一行', '=TOROW(数组,[忽略空白])', '=TOROW(A1:C3) 转为 1×9', '365 / 2021+', false],
  ['数组与重塑', 'TOCOL', '把区域转为一列', '=TOCOL(数组,[忽略空白])', '=TOCOL(A1:C3) 转为 9×1', '365 / 2021+', false],
  ['数组与重塑', 'DROP', '去掉数组首/尾若干行列', '=DROP(数组,行数,[列数])', '=DROP(A1:C5,1) 去掉首行', '负数表示从末尾去掉', false],
  ['数组与重塑', 'TAKE', '取数组首/尾若干行列', '=TAKE(数组,行数,[列数])', '=TAKE(A1:C5,3) 取前三行', '负数表示从末尾取', false],
  ['数组与重塑', 'EXPAND', '把数组扩展到指定尺寸', '=EXPAND(数组,行,[列],[填充值])', '=EXPAND(A1:A3,,2,"空")', '365 / 2021+', false],
  ['数组与重塑', 'WRAPROWS', '把一维数组按行换行', '=WRAPROWS(数组,每行元素数)', '=WRAPROWS(A1:A6,3) 转成 2×3', '365 / 2021+', false],

  // ── 查找进阶 ──
  ['查找进阶', 'XLOOKUP 进阶', '双向/近似/多条件灵活查找', '=XLOOKUP(查找值,查找数组,返回数组,[未找到],[匹配模式])', '=XLOOKUP(E1,A:A,C:C,"无",0)', '可替代 VLOOKUP+HLOOKUP', true],
  ['查找进阶', 'XMATCH', '返回项目在数组中的相对位置', '=XMATCH(查找值,查找数组,[匹配模式])', '=XMATCH("B",A1:A5)', '365 / 2021+，INDEX 好搭档', false],
  ['查找进阶', 'FILTER 组合', '按条件筛选并配合其他函数', '=FILTER(返回区域,条件,[无结果])', '=SORT(FILTER(A2:C20,B2:B20="华东"))', '与 SORT/UNIQUE 组合强大', true],

  // ── 查找与引用 ──
  ['查找与引用', 'INDEX+MATCH 进阶', '实现双向与多条件查找', '=INDEX(返回区域,MATCH(行条件,行区域,0))', '=INDEX(C:C,MATCH(E1&A:A, A:A&B:B,0))', '不受插入列影响，比 VLOOKUP 灵活', false],

  // ── 逻辑进阶 ──
  ['逻辑进阶', 'IFS', '多条件依次判断', '=IFS(条件1,值1,条件2,值2,…)', '=IFS(A1>=90,"优",A1>=60,"及格",TRUE,"不及格")', '省去多层 IF 嵌套', true],
  ['逻辑进阶', 'SWITCH', '按值匹配多个结果', '=SWITCH(表达式,值1,结果1,[默认])', '=SWITCH(A1,"A","优秀","B","良好","一般")', '2019 / 365', false],
  ['逻辑进阶', 'LET', '为中间计算命名以复用', '=LET(名称1,值1,名称2,值2,计算式)', '=LET(x,SUM(A:A),IF(x>0,x,0))', '提升性能与可读性，365', true],
  ['逻辑进阶', 'LAMBDA', '自定义可复用函数', '=LAMBDA(参数,计算式)', '=LAMBDA(x,x*2)(5) 返回 10', '365，可在名称管理器中保存', false],

  // ── 逻辑判断 ──
  ['逻辑判断', 'IFNA', '仅屏蔽 #N/A 错误', '=IFNA(值,出错时的值)', '=IFNA(VLOOKUP(E1,A:B,2,0),"未找到")', '比 IFERROR 更精准，不掩盖其他错误', false],

  // ── 统计进阶 ──
  ['统计进阶', 'AGGREGATE', '忽略错误/隐藏行的聚合计算', '=AGGREGATE(功能码,选项,区域)', '=AGGREGATE(9,6,A1:A10) 忽略错误求和', '功能码 9=SUM，选项 6=忽略错误', false],
  ['统计进阶', 'SUMPRODUCT 进阶', '多条件加权求和与计数', '=SUMPRODUCT((条件1)*(条件2)*数值区域)', '=SUMPRODUCT((A:A="华东")*(B:B>90)*C:C)', '不依赖数组公式输入', true],
  ['统计进阶', 'FREQUENCY', '统计数值在各区间的频数', '=FREQUENCY(数据区域,分段点区域)', '=FREQUENCY(B2:B50,D2:D5)', '需按 Ctrl+Shift+Enter（老版本）', false],
  ['统计进阶', 'MODE.MULT', '返回出现次数最多的多个值', '=MODE.MULT(数据区域)', '=MODE.MULT(A1:A20)', '多众数时返回数组，365 自动溢出', false],
  ['统计进阶', 'LINEST', '返回线性回归拟合参数', '=LINEST(已知Y,已知X,[截距],[统计])', '=LINEST(B2:B10,A2:A10)', '可用于趋势线与预测', false],
  ['统计进阶', 'FORECAST.LINEAR', '按线性趋势预测未来值', '=FORECAST.LINEAR(X,已知Y,已知X)', '=FORECAST.LINEAR(12,B2:B10,A2:A10)', '替代旧版 FORECAST，2016+', false],

  // ── 数学与统计 ──
  ['数学与统计', 'DELTA', '检验两数是否相等', '=DELTA(数值1,[数值2])', '=DELTA(5,5) 返回 1', '相等返回 1，否则 0；属工程函数', false],

  // ── 动态数组 ──
  ['动态数组', 'SORTBY', '按另一区域的值排序', '=SORTBY(数组,排序依据,[顺序])', '=SORTBY(A2:C10,C2:C10,-1)', '365 / 2021+，多条件排序更灵活', false],
  ['动态数组', 'SEQUENCE', '生成连续数字序列', '=SEQUENCE(行,[列],[起始],[步长])', '=SEQUENCE(5,1,1,1) 生成 1~5', '365 / 2021+', true],
]

// 较新的函数（365 / 2021+）标注「新版」badge
const newFns = new Set([
  'TEXTBEFORE', 'TEXTAFTER', 'TEXTSPLIT', 'VSTACK', 'HSTACK', 'TOROW', 'TOCOL',
  'DROP', 'TAKE', 'EXPAND', 'WRAPROWS', 'XLOOKUP 进阶', 'XMATCH', 'FILTER 组合',
  'IFS', 'SWITCH', 'LET', 'LAMBDA', 'FORECAST.LINEAR', 'SORTBY', 'SEQUENCE',
])

export const excelExtraEntries: Entry[] = raw.map((item, i) => {
  const [category, name, purpose, syntax, example, note = '', featured = false] = item
  return {
    id: `excel-extra-${String(i + 1).padStart(3, '0')}`,
    name,
    category,
    purpose,
    syntax,
    example,
    note,
    badge: newFns.has(name) ? '新版' : '',
    tags: [category, name],
    featured,
  }
})
