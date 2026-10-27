#!/usr/bin/env bash
#
# Builds every prototype into dist/<name>/ so Vercel serves each one at
# https://prototypes.fvm.house/<name>/.
#
# A top-level folder is a prototype when it holds either:
#
#   app         package.json + a vite config — a self-contained Vite app, built
#               with base: './' so its relative asset paths work under /<name>/.
#
#   playground  blueprint.json — a WordPress plugin run in WordPress Playground.
#               plugin/ is zipped to plugin.zip, seed.php (if any) is inlined
#               into the blueprint, and the folder's index.html — or the shared
#               playground-template.html — becomes the launch page.
#
# Everything is served from one domain, so Playground can fetch the blueprint
# and the zip cross-origin (Vercel sends access-control-allow-origin: *).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist"
TEMPLATE="$ROOT/playground-template.html"
BASE_URL="${BASE_URL:-https://prototypes.fvm.house}"

rm -rf "$OUT"
mkdir -p "$OUT"

# render <file> <title> <description> <blueprint-url> — fills the {{...}} placeholders.
render() {
	TITLE="$2" DESCRIPTION="$3" BLUEPRINT_URL="$4" node -e '
		const fs = require("fs");
		const html = fs.readFileSync(process.argv[1], "utf8")
			.replaceAll("{{TITLE}}", process.env.TITLE)
			.replaceAll("{{DESCRIPTION}}", process.env.DESCRIPTION)
			.replaceAll("{{BLUEPRINT_URL}}", process.env.BLUEPRINT_URL);
		process.stdout.write(html);
	' "$1"
}

build_app() {
	local dir="$1" name="$2"
	( cd "$dir" && npm ci && npm run build )
	mkdir -p "${OUT}/${name}"
	cp -R "${dir}dist/." "${OUT}/${name}/"
}

build_playground() {
	local dir="$1" name="$2"
	local dest="${OUT}/${name}"
	mkdir -p "$dest"

	# The plugin source becomes a zip Playground installs over HTTP. Zipped from
	# a copy named after the prototype, so the archive root is <name>/.
	if [ -d "${dir}plugin" ]; then
		local stage
		stage="$(mktemp -d)"
		cp -R "${dir}plugin" "${stage}/${name}"
		( cd "$stage" && zip -qr "${dest}/plugin.zip" "$name" )
		rm -rf "$stage"
	fi

	# blueprint.json keeps placeholders so the plugin and the demo content stay
	# editable as real files instead of escaped strings in JSON.
	PLUGIN_ZIP_URL="${BASE_URL}/${name}/plugin.zip" node -e '
		const fs = require("fs");
		const [src, seed, out] = process.argv.slice(1);
		let json = fs.readFileSync(src, "utf8")
			.replace("__PLUGIN_ZIP_URL__", process.env.PLUGIN_ZIP_URL);
		const bp = JSON.parse(json);
		if (fs.existsSync(seed)) {
			for (const step of bp.steps ?? []) {
				if (step.code === "__SEED_PHP__") step.code = fs.readFileSync(seed, "utf8");
			}
		}
		fs.writeFileSync(out, JSON.stringify(bp));
	' "${dir}blueprint.json" "${dir}seed.php" "${dest}/blueprint.json"

	local title description page
	title="$(node -p "JSON.parse(require('fs').readFileSync('${dir}blueprint.json','utf8')).meta?.title ?? '${name}'")"
	description="$(node -p "JSON.parse(require('fs').readFileSync('${dir}blueprint.json','utf8')).meta?.description ?? ''")"
	page="${dir}index.html"
	[ -f "$page" ] || page="$TEMPLATE"
	render "$page" "$title" "$description" "${BASE_URL}/${name}/blueprint.json" > "${dest}/index.html"

	# Anything else the page needs (images, extra pages) rides along.
	for extra in "${dir}"*; do
		case "$(basename "$extra")" in
			plugin|seed.php|blueprint.json|index.html|README.md|WPDS-COMPONENTS.md|node_modules) continue ;;
		esac
		cp -R "$extra" "$dest/"
	done
}

built=0
for dir in "$ROOT"/*/; do
	name="$(basename "$dir")"
	[ "$name" = "dist" ] && continue
	[ "$name" = "node_modules" ] && continue

	if [ -f "${dir}package.json" ] && { [ -f "${dir}vite.config.js" ] || [ -f "${dir}vite.config.ts" ]; }; then
		echo "→ building ${name} (app)"
		build_app "$dir" "$name"
		built=$((built + 1))
	elif [ -f "${dir}blueprint.json" ]; then
		echo "→ building ${name} (playground)"
		build_playground "$dir" "$name"
		built=$((built + 1))
	fi
done

echo "built ${built} prototype(s) → dist/<name>/"
