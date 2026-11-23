"""从工作区的 Excel公式速查表.md 解析出结构化数据，生成 TS 模块。"""
import json
import re

SRC = "D:/Moon/workBuddy/2026-11-19-11-53-11/Excel公式速查表.md"
OUT = "D:/Moon/tools/office-cheatsheet/src/data/excel.ts"

CATEGORY_MAP = {
    "一、数学与统计": "数学与统计",
    "二、逻辑判断": "逻辑判断",
    "三、文本处理": "文本处理",
    "四、查找与引用": "查找与引用",
    "五、日期与时间": "日期与时间",
    "六、财务计算": "财务计算",
    "七、动态数组（Microsoft 365 / 2021+）": "动态数组",
    "八、实用组合技（直接抄）": "实用组合技",
}

def strip_md(s: str) -> str:
    return s.replace('\\`', '\u2603').replace('`', '').replace('\u2603', '`').strip()

entries = []
section = ""
with open(SRC, encoding="utf-8") as f:
    for line in f:
        line = line.rstrip("\n")
        if line.startswith("## "):
            section = strip_md(line[3:])
            continue
        if not line.startswith("|"):
            continue
        cells = [strip_md(c) for c in line.strip().strip("|").split("|")]
        if not cells or all(re.fullmatch(r":?-{3,}:?", c or "") for c in cells):
            continue
        if cells[0] in ("函数", "场景", ""):
            continue
        cat = CATEGORY_MAP.get(section)
        if not cat:
            continue
        cells += [""] * (6 - len(cells))
        if cat == "实用组合技":
            name, syntax, note = cells[0], cells[1], cells[2]
            purpose = note if note else "高频实用组合写法"
            example = syntax
            if note:
                note = note
        else:
            name, purpose, syntax, example = cells[0], cells[1], cells[2], cells[3]
            note = ""
        # 提取示例中的结果部分用于 note
        if "→" in example:
            parts = example.split("→", 1)
            example, tail = parts[0].strip(), parts[1].strip()
            note = (note + "；" + tail).strip("；") if note else tail
        # 版本标注
        badge = ""
        if "365" in purpose or "2021" in purpose or "2019" in purpose:
            badge = "新版"
        tags = [cat, name]
        entries.append({
            "id": f"excel-{len(entries)+1:03d}",
            "name": name,
            "category": cat,
            "purpose": purpose,
            "syntax": syntax,
            "example": example,
            "note": note,
            "badge": badge,
            "tags": tags,
            "featured": name in {"SUM", "SUMIF", "COUNTIF", "IF", "VLOOKUP", "XLOOKUP", "INDEX+MATCH", "TEXT", "DATEDIF", "PMT", "IFERROR", "ROUND"},
        })

categories = [v for v in CATEGORY_MAP.values()]
with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 本文件由 .gen-excel.py 从 Markdown 速查表自动生成，请勿手工编辑。\n")
    f.write("import type { Entry } from '../types'\n\n")
    f.write("export const excelCategories = " + json.dumps(categories, ensure_ascii=False) + "\n\n")
    f.write("export const excelEntries: Entry[] = " + json.dumps(entries, ensure_ascii=False, indent=2) + "\n")

print(f"generated {len(entries)} entries -> {OUT}")
