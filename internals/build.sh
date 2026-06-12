#!/bin/bash
set -euo pipefail
OUT=${1:-dist}

rm -rf "$OUT" && mkdir -p "$OUT"
rsync -a \
  --exclude '.git' \
  --exclude '.github' \
  --exclude '.editorconfig' \
  --exclude '.gitignore' \
  --exclude '.prettierrc' \
  --exclude 'internals' \
  --exclude 'README.md' \
  --exclude 'node_modules' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  --exclude "$OUT" \
  ./ "$OUT/"

lightningcss --minify --bundle style.css -o "$OUT/style.css"

html-minifier-terser index.html \
  --collapse-whitespace --decode-entities \
  --remove-comments --minify-js true \
  -o "$OUT/index.html"

HASH=$(md5sum "$OUT/style.css" | cut -c1-8)
sed -i "s|style\.css?t=[0-9a-z]*|style.css?t=${HASH}|g" "$OUT/index.html"
