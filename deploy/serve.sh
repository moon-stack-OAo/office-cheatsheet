#!/usr/bin/env bash
# 无 Nginx 时的临时方案：在 Linux 服务器上直接起一个静态服务
# 用法：PORT=9000 bash serve.sh   （PORT 不传则默认 8080）
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-8080}"

# 定位到 dist 目录：脚本放在 dist/ 同级的 deploy/ 下，故往上一级找
ROOT="$(dirname "$DIR")/dist"
if [ ! -f "$ROOT/index.html" ]; then
  echo "找不到 $ROOT/index.html，请确认 dist/ 与 deploy/ 同级" >&2
  exit 1
fi

echo "==> 静态服务器启动：http://0.0.0.0:$PORT/  （目录：$ROOT）"
echo "    按 Ctrl+C 停止；如需后台常驻请用 systemd 或 nohup/pm2"
python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$ROOT"
