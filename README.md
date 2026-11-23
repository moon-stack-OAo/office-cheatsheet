# 办公速查手册

基于 Vite + React + TypeScript 的本地优先速查网页，收录 Excel 公式、Word / PPT / Windows / WPS 技巧，支持搜索、分类、收藏、自建条目、一键复制和多格式导出。构建产物为纯静态文件，可离线使用。

## 功能列表

- **5 个应用**：Excel 公式、Word 技巧、PPT 技巧、Windows 快捷键、WPS 技巧。
- **智能搜索**：拼音全拼 / 首字母（如 `xjwd` → 新建文档）、模糊子序列（如 `vlkp` → VLOOKUP）、多词 AND、字段加权排序。
- **视图**：卡片 / 表格 / 对比三种视图；今日速查、语法高亮、沉浸模式。
- **个性化**：收藏、自建条目、自定义分类、个人备注、按复制次数的「高频优先」。
- **数据备份**：收藏 / 自建 / 分类 / 备注导出为 JSON，可从备份文件恢复；支持文本批量导入条目。
- **导出**：Excel（.xlsx）、Word（.docx）、Markdown（.md）、打印 / 存为 PDF，范围可选当前应用或全部应用。
- **工程化**：PWA 离线可用、外置 JSON 数据、中英双语界面（内容数据仍为中文）、键盘手势。

## 开发 / 构建 / 部署

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器：http://127.0.0.1:5173
npm run build        # 类型检查 + 构建，产物在 dist/
npm run preview      # 本地预览构建产物
```

### 部署到 GitHub Pages（推荐，已配置）

项目已内置 `.github/workflows/deploy.yml`，push 到 `main`/`master` 后由 GitHub 托管 runner 自动构建并发布到 Pages，无需自备服务器。首次启用：

1. GitHub 仓库 → **Settings → Pages → Build and deployment**，Source 选 **GitHub Actions**。
2. 把代码推到 `main`（或 `master`），到 **Actions** 页看「构建并部署到 GitHub Pages」任务变绿。
3. 部署完成后，访问地址形如 `https://<账号>.github.io/<仓库名>/`（在 Actions 任务页或 Pages 设置页可看到确切地址）。

项目使用相对路径（`base: './'`），放在 Pages 的子路径下无需额外配置，`manifest` 的 `start_url`/`scope` 也是相对的，PWA 可正常安装。

### 本地临时服务器

无 Node 构建环境或仅需临时预览时，可用 Python 直接托管 `dist/`：

```bash
PORT=8080 bash deploy/serve.sh     # 默认 8080，PORT 可改
```

若要在自有服务器用 Nginx 托管，`deploy/nginx.conf.example`（根路径）和 `deploy/nginx.proxy.conf.example`（子路径反代）是现成模板。注意：Pages 与内网服务器是两套独立部署，按需选择其一即可。

## 数据文件与编辑方法

内置数据仍在 `src/data/*.ts`（其他模块引用，请勿删除）。页面启动时优先读取外置 JSON，失败时自动回退到内置数据，保证离线或本地直接打开也能用。

外置数据位于 `public/data/`：

- `index.json`：数据清单，列出要加载的应用文件。
- `excel.json` / `word.json` / `ppt.json` / `windows.json` / `wps.json`：每个应用的 `label`、`subtitle`、`icon`、`accent`、`categories` 和 `entries`。

编辑方法：用任意文本编辑器打开对应 JSON，按原有结构增删条目即可（`id` 需唯一）；保存后刷新页面生效。若已安装 PWA 且仍看到旧数据，把 `public/sw.js` 顶部的缓存名 `office-cheatsheet-v1` 递增为 `v2`（依次类推）重新构建即可强制刷新缓存。字段含义：`name` 名称、`category` 分类、`purpose` 用途、`syntax` 写法/按键、`example` 示例、`note` 说明、`badge` 标注、`tags` 搜索关键词、`featured` 是否常用。

当前内置条目数量：Excel 116、Word 76、PPT 41、Windows 55、WPS 32。

## PWA 安装

构建后通过 http(s) 访问（不要用 `file://` 直接打开 index.html）。首次访问后 Service Worker 会缓存入口页面；浏览器地址栏会出现「安装应用」按钮（Chrome / Edge），安装后可像桌面应用一样独立窗口打开并离线使用。发布新版本时，Service Worker 会自动清理旧缓存。

## 快捷键

| 按键 | 作用 |
| --- | --- |
| `/` | 聚焦搜索框 |
| `j` / `k` | 焦点移动到下一张 / 上一张卡片 |
| `Enter` | 复制当前高亮卡片的写法 |
| `?` | 打开快捷键帮助 |
| `Esc` | 退出沉浸模式 → 关闭弹层 → 清空搜索 |

快捷键仅在非输入状态、且没有弹层打开时生效。

## 备份与恢复

左侧栏「数据备份」中：

- **导出备份**：把收藏、自建条目、自定义分类、个人备注保存为 JSON 文件。
- **导入备份**：选择此前导出的 JSON，恢复上述数据（不会覆盖内置条目）。
- **批量导入条目**：每行一条，以 `Tab` 或 `|` 分隔，字段顺序为「名称 | 分类 | 用途 | 写法 | 示例 | 备注」，其中名称与写法必填。

这些数据保存在浏览器 `localStorage`（键前缀 `office-cheatsheet:`），清理浏览器数据会一并清除，请定期导出备份。
