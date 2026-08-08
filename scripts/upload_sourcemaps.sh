#!/usr/bin/env bash
#
# Best-effort PostHog source-map upload for Error Tracking symbolication.
#
# Runs as part of `mix assets.deploy` (see the aliases in mix.exs), AFTER esbuild
# has emitted priv/static/assets/app.js + app.js.map and BEFORE `mix phx.digest`.
#
# DESIGN RULES (read before editing):
#   1. This script must NEVER fail a deploy. Source-map upload is a best-effort
#      observability nicety -- on any error we log and exit 0.
#   2. It ALWAYS deletes the *.map files before returning, so source maps are
#      never published to the public static digest.
#   3. It is a no-op (cleanup only) until POSTHOG_CLI_API_KEY is set, so adding
#      it to the deploy pipeline changes nothing until you wire up the secret.
#
# Required env (set with `gigalixir config:set` -- see scripts/README_sourcemaps.md):
#   POSTHOG_CLI_API_KEY     personal API key (scopes: error tracking write, organization read)
#   POSTHOG_CLI_PROJECT_ID  PostHog project id (this project: 55178)
#   POSTHOG_CLI_HOST        https://us.posthog.com
#
# Optional:
#   SOURCE_VERSION          git sha (Gigalixir sets this during build) -> release version

set +e  # never abort the deploy on our account

ASSETS_DIR="priv/static/assets"
RELEASE_NAME="mono-phoenix"
RELEASE_VERSION="${SOURCE_VERSION:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"

cleanup_maps() {
  # Strip ONLY esbuild's freshly-emitted top-level JS maps (e.g. app.js.map) so
  # they are never published to the public static digest.
  #
  # IMPORTANT: -maxdepth 1 + '*.js.map' deliberately scopes this to esbuild's
  # output in the root of $ASSETS_DIR. It must NOT touch committed source maps
  # that live in subdirectories (e.g. priv/static/assets/css/bootstrap.css.map),
  # which are tracked assets, not build artifacts.
  find "$ASSETS_DIR" -maxdepth 1 -name '*.js.map' -type f -delete 2>/dev/null
}

if [ -z "$POSTHOG_CLI_API_KEY" ]; then
  echo "[sourcemaps] POSTHOG_CLI_API_KEY not set; skipping upload (maps will be removed)."
  cleanup_maps
  exit 0
fi

if [ ! -d "$ASSETS_DIR" ]; then
  echo "[sourcemaps] $ASSETS_DIR not found; nothing to do."
  exit 0
fi

# Resolve a posthog-cli invocation. Prefer an installed binary, else a pinned
# npx version. Best-effort -- if neither works we just clean up.
#
# The version is PINNED deliberately. Gigalixir runs `mix assets.deploy` (and
# therefore this script) inside the build container, where every prod config
# var is present in the environment: DATABASE_URL, ACCOUNTS_DATABASE_URL, the
# live Stripe keys, SECRET_KEY_BASE, ANTHROPIC_API_KEY. Resolving `@latest`
# there means every deploy executes whatever was published to npm minutes
# earlier, with all of that in reach -- which is precisely how the Shai-Hulud
# worm exfiltrated credentials in Nov 2025, via this same package family.
# Bump this pin deliberately, after the release has been out long enough to
# be vetted. Same reason the `curl | sh` installer fallback was removed: an
# unpinned remote script piped into a shell in a secret-bearing container.
POSTHOG_CLI_VERSION="0.10.0"

CLI=""
if command -v posthog-cli >/dev/null 2>&1; then
  CLI="posthog-cli"
elif command -v npx >/dev/null 2>&1; then
  CLI="npx -y @posthog/cli@${POSTHOG_CLI_VERSION}"
fi

if [ -z "$CLI" ]; then
  echo "[sourcemaps] could not obtain posthog-cli; skipping upload (maps will be removed)."
  cleanup_maps
  exit 0
fi

echo "[sourcemaps] using: $CLI  (release $RELEASE_NAME@$RELEASE_VERSION)"

# Newer CLIs (>=0.5) have `sourcemap process` (inject + upload in one shot).
# Fall back to discrete inject + upload for older versions. inject is idempotent.
$CLI sourcemap process \
  --directory "$ASSETS_DIR" \
  --release-name "$RELEASE_NAME" \
  --release-version "$RELEASE_VERSION"
status=$?

if [ $status -ne 0 ]; then
  echo "[sourcemaps] 'sourcemap process' unavailable/failed (exit $status); trying inject + upload ..."
  $CLI sourcemap inject --directory "$ASSETS_DIR"
  $CLI sourcemap upload \
    --directory "$ASSETS_DIR" \
    --release-name "$RELEASE_NAME" \
    --release-version "$RELEASE_VERSION"
  status=$?
fi

if [ $status -eq 0 ]; then
  echo "[sourcemaps] upload complete."
else
  echo "[sourcemaps] upload failed (exit $status); continuing deploy anyway."
fi

cleanup_maps
exit 0
