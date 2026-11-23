#!/usr/bin/env bash
# 一键构建并在本地部署「办公速查手册」（Git Bash / macOS / Linux 均可运行）
set -e

SRC="D:/Moon/tools/office-cheatsheet"
DEPLOY="D:/Moon/tools/office-cheatsheet-deploy"
PORT=8080

echo "==> [1/3] 构建生产版本（npm run build）"
cd "$SRC"
npm run build

echo "==> [2/3] 同步 dist/ 到部署目录：$DEPLOY"
mkdir -p "$DEPLOY"
# 清空目录内容但保留目录本身
find "$DEPLOY" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -R "$SRC"/dist/. "$DEPLOY"/
echo "    已同步 $(find "$DEPLOY" -type f | wc -l) 个文件"

echo "==> [3/3] 启动静态服务器（前台运行，Ctrl+C 停止）"
echo "    访问地址：http://127.0.0.1:$PORT/"
python3 -m http.server "$PORT" --directory "$DEPLOY"
