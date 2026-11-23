// 本文件由 .gen-excel.py 从 Markdown 速查表自动生成，请勿手工编辑。
import type {Entry} from '../types'

export const excelCategories = ["数学与统计", "逻辑判断", "文本处理", "查找与引用", "日期与时间", "财务计算", "动态数组", "实用组合技"]

export const excelEntries: Entry[] = [
  {
    "id": "excel-001",
    "name": "SUM",
    "category": "数学与统计",
    "purpose": "求和",
    "syntax": "=SUM(区域)",
    "example": "=SUM(A1:A10)",
    "note": "A1:A10 数值之和",
    "badge": "",
    "tags": [
      "数学与统计",
      "SUM"
    ],
    "featured": true
  },
  {
    "id": "excel-002",
    "name": "SUMIF",
    "category": "数学与统计",
    "purpose": "单条件求和",
    "syntax": "=SUMIF(条件区域,条件,求和区域)",
    "example": "=SUMIF(A2:A20,\"华东\",C2:C20)",
    "note": "华东地区销售额合计",
    "badge": "",
    "tags": [
      "数学与统计",
      "SUMIF"
    ],
    "featured": true
  },
  {
    "id": "excel-003",
    "name": "SUMIFS",
    "category": "数学与统计",
    "purpose": "多条件求和",
    "syntax": "=SUMIFS(求和区域,条件区域1,条件1,…)",
    "example": "=SUMIFS(C2:C100,A2:A100,\"华东\",B2:B100,\">=90\")",
    "note": "华东且分数≥90 的销售额",
    "badge": "",
    "tags": [
      "数学与统计",
      "SUMIFS"
    ],
    "featured": false
  },
  {
    "id": "excel-004",
    "name": "AVERAGE",
    "category": "数学与统计",
    "purpose": "平均值",
    "syntax": "=AVERAGE(区域)",
    "example": "=AVERAGE(B2:B50)",
    "note": "自动忽略空白和文本",
    "badge": "",
    "tags": [
      "数学与统计",
      "AVERAGE"
    ],
    "featured": false
  },
  {
    "id": "excel-005",
    "name": "AVERAGEIF",
    "category": "数学与统计",
    "purpose": "条件平均",
    "syntax": "=AVERAGEIF(条件区域,条件,[平均区域])",
    "example": "=AVERAGEIF(B2:B50,\">=60\")",
    "note": "及格分数的平均分",
    "badge": "",
    "tags": [
      "数学与统计",
      "AVERAGEIF"
    ],
    "featured": false
  },
  {
    "id": "excel-006",
    "name": "COUNT",
    "category": "数学与统计",
    "purpose": "统计数值个数",
    "syntax": "=COUNT(区域)",
    "example": "=COUNT(A1:A50)",
    "note": "文本不计入",
    "badge": "",
    "tags": [
      "数学与统计",
      "COUNT"
    ],
    "featured": false
  },
  {
    "id": "excel-007",
    "name": "COUNTA",
    "category": "数学与统计",
    "purpose": "统计非空单元格",
    "syntax": "=COUNTA(区域)",
    "example": "=COUNTA(A1:A50)",
    "note": "文本、数字都计入",
    "badge": "",
    "tags": [
      "数学与统计",
      "COUNTA"
    ],
    "featured": false
  },
  {
    "id": "excel-008",
    "name": "COUNTBLANK",
    "category": "数学与统计",
    "purpose": "统计空白单元格",
    "syntax": "=COUNTBLANK(区域)",
    "example": "=COUNTBLANK(A1:A50)",
    "note": "",
    "badge": "",
    "tags": [
      "数学与统计",
      "COUNTBLANK"
    ],
    "featured": false
  },
  {
    "id": "excel-009",
    "name": "COUNTIF",
    "category": "数学与统计",
    "purpose": "单条件计数",
    "syntax": "=COUNTIF(区域,条件)",
    "example": "=COUNTIF(B2:B50,\">=60\")",
    "note": "及格人数",
    "badge": "",
    "tags": [
      "数学与统计",
      "COUNTIF"
    ],
    "featured": true
  },
  {
    "id": "excel-010",
    "name": "COUNTIFS",
    "category": "数学与统计",
    "purpose": "多条件计数",
    "syntax": "=COUNTIFS(区域1,条件1,…)",
    "example": "=COUNTIFS(A2:A50,\"男\",B2:B50,\">=60\")",
    "note": "及格男生人数",
    "badge": "",
    "tags": [
      "数学与统计",
      "COUNTIFS"
    ],
    "featured": false
  },
  {
    "id": "excel-011",
    "name": "MAX / MIN",
    "category": "数学与统计",
    "purpose": "最大值 / 最小值",
    "syntax": "=MAX(区域)",
    "example": "=MAX(C2:C100)",
    "note": "最高分",
    "badge": "",
    "tags": [
      "数学与统计",
      "MAX / MIN"
    ],
    "featured": false
  },
  {
    "id": "excel-012",
    "name": "ROUND",
    "category": "数学与统计",
    "purpose": "四舍五入",
    "syntax": "=ROUND(数值,位数)",
    "example": "=ROUND(3.14159,2)",
    "note": "3.14",
    "badge": "",
    "tags": [
      "数学与统计",
      "ROUND"
    ],
    "featured": true
  },
  {
    "id": "excel-013",
    "name": "ROUNDUP / ROUNDDOWN",
    "category": "数学与统计",
    "purpose": "向上 / 向下舍入",
    "syntax": "=ROUNDUP(数值,位数)",
    "example": "=ROUNDUP(3.141,2)",
    "note": "3.15",
    "badge": "",
    "tags": [
      "数学与统计",
      "ROUNDUP / ROUNDDOWN"
    ],
    "featured": false
  },
  {
    "id": "excel-014",
    "name": "INT",
    "category": "数学与统计",
    "purpose": "向下取整",
    "syntax": "=INT(数值)",
    "example": "=INT(8.9)",
    "note": "8；=INT(-8.9) → -9",
    "badge": "",
    "tags": [
      "数学与统计",
      "INT"
    ],
    "featured": false
  },
  {
    "id": "excel-015",
    "name": "MOD",
    "category": "数学与统计",
    "purpose": "取余数",
    "syntax": "=MOD(被除数,除数)",
    "example": "=MOD(17,5)",
    "note": "2",
    "badge": "",
    "tags": [
      "数学与统计",
      "MOD"
    ],
    "featured": false
  },
  {
    "id": "excel-016",
    "name": "ABS",
    "category": "数学与统计",
    "purpose": "绝对值",
    "syntax": "=ABS(数值)",
    "example": "=ABS(-15)",
    "note": "15",
    "badge": "",
    "tags": [
      "数学与统计",
      "ABS"
    ],
    "featured": false
  },
  {
    "id": "excel-017",
    "name": "SUMPRODUCT",
    "category": "数学与统计",
    "purpose": "先乘后加",
    "syntax": "=SUMPRODUCT(数组1,数组2)",
    "example": "=SUMPRODUCT(B2:B10,C2:C10)",
    "note": "单价×数量的总金额",
    "badge": "",
    "tags": [
      "数学与统计",
      "SUMPRODUCT"
    ],
    "featured": false
  },
  {
    "id": "excel-018",
    "name": "RANDBETWEEN",
    "category": "数学与统计",
    "purpose": "随机整数",
    "syntax": "=RANDBETWEEN(下限,上限)",
    "example": "=RANDBETWEEN(1,100)",
    "note": "1~100 随机整数（按 F9 刷新）",
    "badge": "",
    "tags": [
      "数学与统计",
      "RANDBETWEEN"
    ],
    "featured": false
  },
  {
    "id": "excel-019",
    "name": "IF",
    "category": "逻辑判断",
    "purpose": "条件判断",
    "syntax": "=IF(条件,真值,假值)",
    "example": "=IF(B2>=60,\"及格\",\"不及格\")",
    "note": "",
    "badge": "",
    "tags": [
      "逻辑判断",
      "IF"
    ],
    "featured": true
  },
  {
    "id": "excel-020",
    "name": "IFS",
    "category": "逻辑判断",
    "purpose": "多条件依次判断（365/2021+）",
    "syntax": "=IFS(条件1,值1,条件2,值2,…)",
    "example": "=IFS(B2>=90,\"优\",B2>=60,\"及格\",TRUE,\"不及格\")",
    "note": "",
    "badge": "新版",
    "tags": [
      "逻辑判断",
      "IFS"
    ],
    "featured": false
  },
  {
    "id": "excel-021",
    "name": "IFERROR",
    "category": "逻辑判断",
    "purpose": "屏蔽所有错误",
    "syntax": "=IFERROR(公式,\"出错时显示\")",
    "example": "=IFERROR(A2/B2,\"—\")",
    "note": "除数为 0 时显示 —",
    "badge": "",
    "tags": [
      "逻辑判断",
      "IFERROR"
    ],
    "featured": true
  },
  {
    "id": "excel-022",
    "name": "IFNA",
    "category": "逻辑判断",
    "purpose": "只屏蔽 #N/A",
    "syntax": "=IFNA(公式,\"未找到\")",
    "example": "=IFNA(VLOOKUP(E2,A:B,2,0),\"未找到\")",
    "note": "",
    "badge": "",
    "tags": [
      "逻辑判断",
      "IFNA"
    ],
    "featured": false
  },
  {
    "id": "excel-023",
    "name": "AND",
    "category": "逻辑判断",
    "purpose": "全部条件为真",
    "syntax": "=AND(条件1,条件2,…)",
    "example": "=AND(B2>=60,C2>=60)",
    "note": "两科都及格返回 TRUE",
    "badge": "",
    "tags": [
      "逻辑判断",
      "AND"
    ],
    "featured": false
  },
  {
    "id": "excel-024",
    "name": "OR",
    "category": "逻辑判断",
    "purpose": "任一条件为真",
    "syntax": "=OR(条件1,条件2,…)",
    "example": "=OR(B2=\"A\",B2=\"B\")",
    "note": "",
    "badge": "",
    "tags": [
      "逻辑判断",
      "OR"
    ],
    "featured": false
  },
  {
    "id": "excel-025",
    "name": "NOT",
    "category": "逻辑判断",
    "purpose": "逻辑取反",
    "syntax": "=NOT(条件)",
    "example": "=NOT(AND(B2>=60,C2>=60))",
    "note": "",
    "badge": "",
    "tags": [
      "逻辑判断",
      "NOT"
    ],
    "featured": false
  },
  {
    "id": "excel-026",
    "name": "LEFT",
    "category": "文本处理",
    "purpose": "从左截取",
    "syntax": "=LEFT(文本,字符数)",
    "example": "=LEFT(\"ABCDEFG\",3)",
    "note": "ABC",
    "badge": "",
    "tags": [
      "文本处理",
      "LEFT"
    ],
    "featured": false
  },
  {
    "id": "excel-027",
    "name": "RIGHT",
    "category": "文本处理",
    "purpose": "从右截取",
    "syntax": "=RIGHT(文本,字符数)",
    "example": "=RIGHT(\"13812345678\",4)",
    "note": "5678",
    "badge": "",
    "tags": [
      "文本处理",
      "RIGHT"
    ],
    "featured": false
  },
  {
    "id": "excel-028",
    "name": "MID",
    "category": "文本处理",
    "purpose": "从中间截取",
    "syntax": "=MID(文本,起始位置,字符数)",
    "example": "=MID(\"ABCDEFG\",3,2)",
    "note": "CD",
    "badge": "",
    "tags": [
      "文本处理",
      "MID"
    ],
    "featured": false
  },
  {
    "id": "excel-029",
    "name": "LEN",
    "category": "文本处理",
    "purpose": "字符长度",
    "syntax": "=LEN(文本)",
    "example": "=LEN(\"Hello\")",
    "note": "5",
    "badge": "",
    "tags": [
      "文本处理",
      "LEN"
    ],
    "featured": false
  },
  {
    "id": "excel-030",
    "name": "FIND",
    "category": "文本处理",
    "purpose": "查找位置（区分大小写）",
    "syntax": "=FIND(要找的,文本,[起始位置])",
    "example": "=FIND(\"@\",\"a@b.com\")",
    "note": "2",
    "badge": "",
    "tags": [
      "文本处理",
      "FIND"
    ],
    "featured": false
  },
  {
    "id": "excel-031",
    "name": "SEARCH",
    "category": "文本处理",
    "purpose": "查找位置（不区分大小写，支持通配符）",
    "syntax": "=SEARCH(要找的,文本)",
    "example": "=SEARCH(\"ab\",\"xxAByy\")",
    "note": "3",
    "badge": "",
    "tags": [
      "文本处理",
      "SEARCH"
    ],
    "featured": false
  },
  {
    "id": "excel-032",
    "name": "SUBSTITUTE",
    "category": "文本处理",
    "purpose": "按内容替换",
    "syntax": "=SUBSTITUTE(文本,旧,新,[第几个])",
    "example": "=SUBSTITUTE(\"2024-01-01\",\"-\",\"/\")",
    "note": "2024/01/01",
    "badge": "",
    "tags": [
      "文本处理",
      "SUBSTITUTE"
    ],
    "featured": false
  },
  {
    "id": "excel-033",
    "name": "REPLACE",
    "category": "文本处理",
    "purpose": "按位置替换",
    "syntax": "=REPLACE(文本,起始,字符数,新文本)",
    "example": "=REPLACE(\"13812345678\",4,4,\"****\")",
    "note": "138****5678",
    "badge": "",
    "tags": [
      "文本处理",
      "REPLACE"
    ],
    "featured": false
  },
  {
    "id": "excel-034",
    "name": "TRIM",
    "category": "文本处理",
    "purpose": "删除多余空格",
    "syntax": "=TRIM(文本)",
    "example": "=TRIM(\"  A  B \")",
    "note": "A B",
    "badge": "",
    "tags": [
      "文本处理",
      "TRIM"
    ],
    "featured": false
  },
  {
    "id": "excel-035",
    "name": "CLEAN",
    "category": "文本处理",
    "purpose": "删除不可打印字符",
    "syntax": "=CLEAN(文本)",
    "example": "清理从系统导出的数据",
    "note": "",
    "badge": "",
    "tags": [
      "文本处理",
      "CLEAN"
    ],
    "featured": false
  },
  {
    "id": "excel-036",
    "name": "CONCAT",
    "category": "文本处理",
    "purpose": "拼接文本",
    "syntax": "=CONCAT(文本1,文本2,…)",
    "example": "=CONCAT(A2,\"-\",B2)",
    "note": "A2值-B2值",
    "badge": "",
    "tags": [
      "文本处理",
      "CONCAT"
    ],
    "featured": false
  },
  {
    "id": "excel-037",
    "name": "TEXTJOIN",
    "category": "文本处理",
    "purpose": "带分隔符拼接（2019+）",
    "syntax": "=TEXTJOIN(分隔符,忽略空值,区域)",
    "example": "=TEXTJOIN(\"、\",TRUE,A2:A10)",
    "note": "用顿号连接非空项",
    "badge": "新版",
    "tags": [
      "文本处理",
      "TEXTJOIN"
    ],
    "featured": false
  },
  {
    "id": "excel-038",
    "name": "TEXT",
    "category": "文本处理",
    "purpose": "按指定格式转文本",
    "syntax": "=TEXT(数值,\"格式代码\")",
    "example": "=TEXT(1234.5,\"#,##0.00\")",
    "note": "1,234.50；=TEXT(TODAY(),\"yyyy-mm-dd\")",
    "badge": "",
    "tags": [
      "文本处理",
      "TEXT"
    ],
    "featured": true
  },
  {
    "id": "excel-039",
    "name": "UPPER/LOWER/PROPER",
    "category": "文本处理",
    "purpose": "大写 / 小写 / 首字母大写",
    "syntax": "=PROPER(文本)",
    "example": "=PROPER(\"john smith\")",
    "note": "John Smith",
    "badge": "",
    "tags": [
      "文本处理",
      "UPPER/LOWER/PROPER"
    ],
    "featured": false
  },
  {
    "id": "excel-040",
    "name": "VALUE",
    "category": "文本处理",
    "purpose": "文本转数字",
    "syntax": "=VALUE(文本)",
    "example": "=VALUE(\"123\")",
    "note": "123",
    "badge": "",
    "tags": [
      "文本处理",
      "VALUE"
    ],
    "featured": false
  },
  {
    "id": "excel-041",
    "name": "REPT",
    "category": "文本处理",
    "purpose": "重复文本",
    "syntax": "=REPT(文本,次数)",
    "example": "=REPT(\"★\",B2)",
    "note": "按分数显示星级",
    "badge": "",
    "tags": [
      "文本处理",
      "REPT"
    ],
    "featured": false
  },
  {
    "id": "excel-042",
    "name": "VLOOKUP",
    "category": "查找与引用",
    "purpose": "纵向查找（经典）",
    "syntax": "=VLOOKUP(查找值,表格区域,列序号,0)",
    "example": "=VLOOKUP(E2,A2:C100,3,0)",
    "note": "按工号在 A 列查找，返回第 3 列；末位 0 = 精确匹配",
    "badge": "",
    "tags": [
      "查找与引用",
      "VLOOKUP"
    ],
    "featured": true
  },
  {
    "id": "excel-043",
    "name": "HLOOKUP",
    "category": "查找与引用",
    "purpose": "横向查找",
    "syntax": "=HLOOKUP(查找值,表格区域,行序号,0)",
    "example": "=HLOOKUP(B10,A1:Z3,2,0)",
    "note": "",
    "badge": "",
    "tags": [
      "查找与引用",
      "HLOOKUP"
    ],
    "featured": false
  },
  {
    "id": "excel-044",
    "name": "INDEX+MATCH",
    "category": "查找与引用",
    "purpose": "灵活双向查找（可向左查）",
    "syntax": "=INDEX(返回区域,MATCH(查找值,查找区域,0))",
    "example": "=INDEX(C2:C100,MATCH(E2,A2:A100,0))",
    "note": "插入列也不易错",
    "badge": "",
    "tags": [
      "查找与引用",
      "INDEX+MATCH"
    ],
    "featured": true
  },
  {
    "id": "excel-045",
    "name": "XLOOKUP",
    "category": "查找与引用",
    "purpose": "新一代查找（365/2021+）",
    "syntax": "=XLOOKUP(查找值,查找区域,返回区域,[未找到])",
    "example": "=XLOOKUP(E2,A2:A100,C2:C100,\"未找到\")",
    "note": "",
    "badge": "新版",
    "tags": [
      "查找与引用",
      "XLOOKUP"
    ],
    "featured": true
  },
  {
    "id": "excel-046",
    "name": "XMATCH",
    "category": "查找与引用",
    "purpose": "新一代位置查找（365/2021+）",
    "syntax": "=XMATCH(查找值,区域,[匹配模式])",
    "example": "=XMATCH(E2,A2:A100)",
    "note": "",
    "badge": "新版",
    "tags": [
      "查找与引用",
      "XMATCH"
    ],
    "featured": false
  },
  {
    "id": "excel-047",
    "name": "OFFSET",
    "category": "查找与引用",
    "purpose": "偏移引用",
    "syntax": "=OFFSET(起点,行偏移,列偏移,[高],[宽])",
    "example": "=OFFSET(A1,2,3)",
    "note": "下移 2 行、右移 3 列，即 D3",
    "badge": "",
    "tags": [
      "查找与引用",
      "OFFSET"
    ],
    "featured": false
  },
  {
    "id": "excel-048",
    "name": "INDIRECT",
    "category": "查找与引用",
    "purpose": "文本转引用",
    "syntax": "=INDIRECT(\"地址文本\")",
    "example": "=INDIRECT(\"A1\")",
    "note": "A1 的值；=INDIRECT(A1&\"!B2\") → 跨工作表引用",
    "badge": "",
    "tags": [
      "查找与引用",
      "INDIRECT"
    ],
    "featured": false
  },
  {
    "id": "excel-049",
    "name": "ROW / COLUMN",
    "category": "查找与引用",
    "purpose": "当前行号 / 列号",
    "syntax": "=ROW([单元格])",
    "example": "=ROW()",
    "note": "当前行号；=COLUMN() → 当前列号",
    "badge": "",
    "tags": [
      "查找与引用",
      "ROW / COLUMN"
    ],
    "featured": false
  },
  {
    "id": "excel-050",
    "name": "ROWS / COLUMNS",
    "category": "查找与引用",
    "purpose": "区域行数 / 列数",
    "syntax": "=ROWS(区域)",
    "example": "=ROWS(A1:A10)",
    "note": "10",
    "badge": "",
    "tags": [
      "查找与引用",
      "ROWS / COLUMNS"
    ],
    "featured": false
  },
  {
    "id": "excel-051",
    "name": "CHOOSE",
    "category": "查找与引用",
    "purpose": "按序号取值",
    "syntax": "=CHOOSE(序号,值1,值2,…)",
    "example": "=CHOOSE(WEEKDAY(TODAY(),2),\"一\",\"二\",\"三\",\"四\",\"五\",\"六\",\"日\")",
    "note": "",
    "badge": "",
    "tags": [
      "查找与引用",
      "CHOOSE"
    ],
    "featured": false
  },
  {
    "id": "excel-052",
    "name": "TODAY",
    "category": "日期与时间",
    "purpose": "今天日期（自动更新）",
    "syntax": "=TODAY()",
    "example": "打开表格即为当天日期",
    "note": "",
    "badge": "",
    "tags": [
      "日期与时间",
      "TODAY"
    ],
    "featured": false
  },
  {
    "id": "excel-053",
    "name": "NOW",
    "category": "日期与时间",
    "purpose": "当前日期 + 时间",
    "syntax": "=NOW()",
    "example": "",
    "note": "",
    "badge": "",
    "tags": [
      "日期与时间",
      "NOW"
    ],
    "featured": false
  },
  {
    "id": "excel-054",
    "name": "DATE",
    "category": "日期与时间",
    "purpose": "拼装日期",
    "syntax": "=DATE(年,月,日)",
    "example": "=DATE(2024,1,1)",
    "note": "2024/1/1",
    "badge": "",
    "tags": [
      "日期与时间",
      "DATE"
    ],
    "featured": false
  },
  {
    "id": "excel-055",
    "name": "DATEDIF",
    "category": "日期与时间",
    "purpose": "两个日期的差（隐藏函数）",
    "syntax": "=DATEDIF(开始,结束,\"Y\"/\"M\"/\"D\")",
    "example": "=DATEDIF(A2,TODAY(),\"Y\")",
    "note": "周岁 / 工龄；\"YM\" → 零头月数",
    "badge": "",
    "tags": [
      "日期与时间",
      "DATEDIF"
    ],
    "featured": true
  },
  {
    "id": "excel-056",
    "name": "YEAR/MONTH/DAY",
    "category": "日期与时间",
    "purpose": "提取年 / 月 / 日",
    "syntax": "=MONTH(日期)",
    "example": "=MONTH(TODAY())",
    "note": "当前月份",
    "badge": "",
    "tags": [
      "日期与时间",
      "YEAR/MONTH/DAY"
    ],
    "featured": false
  },
  {
    "id": "excel-057",
    "name": "WEEKDAY",
    "category": "日期与时间",
    "purpose": "星期几",
    "syntax": "=WEEKDAY(日期,2)",
    "example": "=WEEKDAY(TODAY(),2)",
    "note": "1=周一 … 7=周日",
    "badge": "",
    "tags": [
      "日期与时间",
      "WEEKDAY"
    ],
    "featured": false
  },
  {
    "id": "excel-058",
    "name": "EDATE",
    "category": "日期与时间",
    "purpose": "月份推移",
    "syntax": "=EDATE(日期,月数)",
    "example": "=EDATE(A2,3)",
    "note": "3 个月后的日期（合同到期日）",
    "badge": "",
    "tags": [
      "日期与时间",
      "EDATE"
    ],
    "featured": false
  },
  {
    "id": "excel-059",
    "name": "EOMONTH",
    "category": "日期与时间",
    "purpose": "某月最后一天",
    "syntax": "=EOMONTH(日期,偏移月数)",
    "example": "=EOMONTH(TODAY(),0)",
    "note": "本月最后一天",
    "badge": "",
    "tags": [
      "日期与时间",
      "EOMONTH"
    ],
    "featured": false
  },
  {
    "id": "excel-060",
    "name": "WORKDAY",
    "category": "日期与时间",
    "purpose": "N 个工作日后的日期",
    "syntax": "=WORKDAY(开始,天数,[节假日])",
    "example": "=WORKDAY(A2,10)",
    "note": "10 个工作日后的日期",
    "badge": "",
    "tags": [
      "日期与时间",
      "WORKDAY"
    ],
    "featured": false
  },
  {
    "id": "excel-061",
    "name": "NETWORKDAYS",
    "category": "日期与时间",
    "purpose": "两日期间工作日天数",
    "syntax": "=NETWORKDAYS(开始,结束,[节假日])",
    "example": "=NETWORKDAYS(A2,B2)",
    "note": "",
    "badge": "",
    "tags": [
      "日期与时间",
      "NETWORKDAYS"
    ],
    "featured": false
  },
  {
    "id": "excel-062",
    "name": "HOUR/MINUTE/SECOND",
    "category": "日期与时间",
    "purpose": "提取时 / 分 / 秒",
    "syntax": "=HOUR(时间)",
    "example": "=HOUR(NOW())",
    "note": "",
    "badge": "",
    "tags": [
      "日期与时间",
      "HOUR/MINUTE/SECOND"
    ],
    "featured": false
  },
  {
    "id": "excel-063",
    "name": "PMT",
    "category": "财务计算",
    "purpose": "等额本息每期还款额",
    "syntax": "=PMT(利率,期数,现值,[终值],[类型])",
    "example": "=PMT(4.9%/12,30*12,1000000)",
    "note": "100 万 30 年月供约 -5307（负号表示支出，前面加 - 转正）",
    "badge": "",
    "tags": [
      "财务计算",
      "PMT"
    ],
    "featured": true
  },
  {
    "id": "excel-064",
    "name": "FV",
    "category": "财务计算",
    "purpose": "未来值",
    "syntax": "=FV(利率,期数,每期投入,[现值])",
    "example": "=FV(5%,10,-1000)",
    "note": "每年存 1000，10 年后的本息和",
    "badge": "",
    "tags": [
      "财务计算",
      "FV"
    ],
    "featured": false
  },
  {
    "id": "excel-065",
    "name": "PV",
    "category": "财务计算",
    "purpose": "现值",
    "syntax": "=PV(利率,期数,每期支付,[终值])",
    "example": "=PV(5%,10,-1000)",
    "note": "",
    "badge": "",
    "tags": [
      "财务计算",
      "PV"
    ],
    "featured": false
  },
  {
    "id": "excel-066",
    "name": "NPV",
    "category": "财务计算",
    "purpose": "净现值",
    "syntax": "=NPV(折现率,现金流区域)",
    "example": "=NPV(10%,B2:B6)+B1",
    "note": "B1 为期初投资（单独列出）",
    "badge": "",
    "tags": [
      "财务计算",
      "NPV"
    ],
    "featured": false
  },
  {
    "id": "excel-067",
    "name": "IRR",
    "category": "财务计算",
    "purpose": "内部收益率",
    "syntax": "=IRR(现金流区域,[猜测值])",
    "example": "=IRR(A1:A5)",
    "note": "",
    "badge": "",
    "tags": [
      "财务计算",
      "IRR"
    ],
    "featured": false
  },
  {
    "id": "excel-068",
    "name": "RATE",
    "category": "财务计算",
    "purpose": "每期利率",
    "syntax": "=RATE(期数,每期支付,现值,[终值])",
    "example": "=RATE(30*12,-5307,1000000)",
    "note": "约 0.408%（即年化 4.9%÷12）",
    "badge": "",
    "tags": [
      "财务计算",
      "RATE"
    ],
    "featured": false
  },
  {
    "id": "excel-069",
    "name": "UNIQUE",
    "category": "动态数组",
    "purpose": "去重",
    "syntax": "=UNIQUE(区域,[按列],[只出现一次])",
    "example": "=UNIQUE(A2:A100)",
    "note": "不重复名单",
    "badge": "",
    "tags": [
      "动态数组",
      "UNIQUE"
    ],
    "featured": false
  },
  {
    "id": "excel-070",
    "name": "FILTER",
    "category": "动态数组",
    "purpose": "按条件筛选",
    "syntax": "=FILTER(区域,条件,[无结果])",
    "example": "=FILTER(A2:C100,C2:C100>1000,\"无结果\")",
    "note": "",
    "badge": "",
    "tags": [
      "动态数组",
      "FILTER"
    ],
    "featured": false
  },
  {
    "id": "excel-071",
    "name": "SORT",
    "category": "动态数组",
    "purpose": "排序",
    "syntax": "=SORT(区域,[排序列],[1升/-1降])",
    "example": "=SORT(A2:B50,2,-1)",
    "note": "按第 2 列降序",
    "badge": "",
    "tags": [
      "动态数组",
      "SORT"
    ],
    "featured": false
  },
  {
    "id": "excel-072",
    "name": "SORTBY",
    "category": "动态数组",
    "purpose": "按另一区域排序",
    "syntax": "=SORTBY(区域,排序依据,顺序)",
    "example": "=SORTBY(A2:B50,D2:D50,-1)",
    "note": "",
    "badge": "",
    "tags": [
      "动态数组",
      "SORTBY"
    ],
    "featured": false
  },
  {
    "id": "excel-073",
    "name": "SEQUENCE",
    "category": "动态数组",
    "purpose": "生成数字序列",
    "syntax": "=SEQUENCE(行,[列],[起始],[步长])",
    "example": "=SEQUENCE(10)",
    "note": "1~10 纵向填充",
    "badge": "",
    "tags": [
      "动态数组",
      "SEQUENCE"
    ],
    "featured": false
  },
  {
    "id": "excel-074",
    "name": "RANDARRAY",
    "category": "动态数组",
    "purpose": "生成随机数组",
    "syntax": "=RANDARRAY(行,[列],[最小],[最大],[整数])",
    "example": "=RANDARRAY(5,3,1,100,TRUE)",
    "note": "5×3 随机整数",
    "badge": "",
    "tags": [
      "动态数组",
      "RANDARRAY"
    ],
    "featured": false
  },
  {
    "id": "excel-075",
    "name": "身份证提取出生日期",
    "category": "实用组合技",
    "purpose": "18 位身份证第 7~14 位",
    "syntax": "=TEXT(MID(A2,7,8),\"0-00-00\")",
    "example": "=TEXT(MID(A2,7,8),\"0-00-00\")",
    "note": "18 位身份证第 7~14 位",
    "badge": "",
    "tags": [
      "实用组合技",
      "身份证提取出生日期"
    ],
    "featured": false
  },
  {
    "id": "excel-076",
    "name": "身份证判断性别",
    "category": "实用组合技",
    "purpose": "第 17 位奇数为男",
    "syntax": "=IF(MOD(MID(A2,17,1),2)=1,\"男\",\"女\")",
    "example": "=IF(MOD(MID(A2,17,1),2)=1,\"男\",\"女\")",
    "note": "第 17 位奇数为男",
    "badge": "",
    "tags": [
      "实用组合技",
      "身份证判断性别"
    ],
    "featured": false
  },
  {
    "id": "excel-077",
    "name": "手机号中间四位打码",
    "category": "实用组合技",
    "purpose": "高频实用组合写法",
    "syntax": "=REPLACE(A2,4,4,\"****\")",
    "example": "=REPLACE(A2,4,4,\"****\")",
    "note": "",
    "badge": "",
    "tags": [
      "实用组合技",
      "手机号中间四位打码"
    ],
    "featured": false
  },
  {
    "id": "excel-078",
    "name": "查找不到显示空白",
    "category": "实用组合技",
    "purpose": "避免表格出现 #N/A",
    "syntax": "=IFERROR(VLOOKUP(E2,A:B,2,0),\"\")",
    "example": "=IFERROR(VLOOKUP(E2,A:B,2,0),\"\")",
    "note": "避免表格出现 #N/A",
    "badge": "",
    "tags": [
      "实用组合技",
      "查找不到显示空白"
    ],
    "featured": false
  },
  {
    "id": "excel-079",
    "name": "标记重复值",
    "category": "实用组合技",
    "purpose": "配合「条件格式」高亮",
    "syntax": "=COUNTIF($A$2:$A$100,A2)>1",
    "example": "=COUNTIF($A$2:$A$100,A2)>1",
    "note": "配合「条件格式」高亮",
    "badge": "",
    "tags": [
      "实用组合技",
      "标记重复值"
    ],
    "featured": false
  },
  {
    "id": "excel-080",
    "name": "核对两列差异",
    "category": "实用组合技",
    "purpose": "反向再查一次可找「仅B有」",
    "syntax": "=IF(COUNTIF(B:B,A2)=0,\"仅A有\",\"\")",
    "example": "=IF(COUNTIF(B:B,A2)=0,\"仅A有\",\"\")",
    "note": "反向再查一次可找「仅B有」",
    "badge": "",
    "tags": [
      "实用组合技",
      "核对两列差异"
    ],
    "featured": false
  },
  {
    "id": "excel-081",
    "name": "计算迟到分钟数",
    "category": "实用组合技",
    "purpose": "A2=应到时间，B2=实到时间",
    "syntax": "=MAX(0,(B2-A2)*1440)",
    "example": "=MAX(0,(B2-A2)*1440)",
    "note": "A2=应到时间，B2=实到时间",
    "badge": "",
    "tags": [
      "实用组合技",
      "计算迟到分钟数"
    ],
    "featured": false
  },
  {
    "id": "excel-082",
    "name": "中文日期 + 星期",
    "category": "实用组合技",
    "purpose": "aaaa 输出星期几",
    "syntax": "=TEXT(TODAY(),\"yyyy年m月d日 aaaa\")",
    "example": "=TEXT(TODAY(),\"yyyy年m月d日 aaaa\")",
    "note": "aaaa 输出星期几",
    "badge": "",
    "tags": [
      "实用组合技",
      "中文日期 + 星期"
    ],
    "featured": false
  },
  {
    "id": "excel-083",
    "name": "隔行（奇数行）求和",
    "category": "实用组合技",
    "purpose": "改成 =0 即偶数行",
    "syntax": "=SUMPRODUCT((MOD(ROW(A1:A100),2)=1)*A1:A100)",
    "example": "=SUMPRODUCT((MOD(ROW(A1:A100),2)=1)*A1:A100)",
    "note": "改成 =0 即偶数行",
    "badge": "",
    "tags": [
      "实用组合技",
      "隔行（奇数行）求和"
    ],
    "featured": false
  },
  {
    "id": "excel-084",
    "name": "从混合文本中提取数字",
    "category": "实用组合技",
    "purpose": "365 直接回车；老版本需 Ctrl+Shift+Enter",
    "syntax": "=TEXTJOIN(\"\",TRUE,IFERROR(MID(A2,ROW(INDIRECT(\"1:\"&LEN(A2))),1)*1,\"\"))",
    "example": "=TEXTJOIN(\"\",TRUE,IFERROR(MID(A2,ROW(INDIRECT(\"1:\"&LEN(A2))),1)*1,\"\"))",
    "note": "365 直接回车；老版本需 Ctrl+Shift+Enter",
    "badge": "新版",
    "tags": [
      "实用组合技",
      "从混合文本中提取数字"
    ],
    "featured": false
  }
]
