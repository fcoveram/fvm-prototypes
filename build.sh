#!/usr/bin/env bash
#
# Builds every prototype into dist/<name>/ so Vercel serves each one at
# https://prototypes.fvm.house/<name>/.
#
# A "prototype" is any top-level folder with its own package.json AND a vite
# config. Each is a self-contained Vite app built with base: './', so its
# relative asset paths work under the /<name>/ subpath.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist"

rm -rf "$OUT"
mkdir -p "$OUT"

built=0
for dir in "$ROOT"/*/; do
	name="$(basename "$dir")"
	if [ -f "${dir}package.json" ] && { [ -f "${dir}vite.config.js" ] || [ -f "${dir}vite.config.ts" ]; }; then
		echo "→ building ${name}"
		( cd "$dir" && npm ci && npm run build )
		mkdir -p "${OUT}/${name}"
		cp -R "${dir}dist/." "${OUT}/${name}/"
		built=$((built + 1))
	fi
done

echo "built ${built} prototype(s) → dist/<name>/"
