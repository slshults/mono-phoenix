# PostHog source maps (Error Tracking symbolication)

This wires JS source maps into the Gigalixir deploy so PostHog `$exception`
events show real `app.js:LINE` frames instead of minified `k.getAttribute`.

## What's already implemented (in this repo)

- **`config`/build**: `mix assets.deploy` (see `mix.exs` aliases) now runs:
  1. `esbuild default --minify --sourcemap=external` — emits `priv/static/assets/app.js.map`
     (external = map file generated, **no** public `sourceMappingURL` comment).
  2. `bash scripts/upload_sourcemaps.sh` — injects PostHog `chunkId`s into the
     bundle, uploads the maps, then deletes the JS map before it can be served.
  3. `phx.digest` — digests the now-chunk-id-stamped `app.js`.
- **`scripts/upload_sourcemaps.sh`** is **fail-safe by design**:
  - It **never** fails a deploy (always exits 0).
  - It is a **no-op until `POSTHOG_CLI_API_KEY` is set** — so everything above is
    inert on your deploys until you complete the action items below.
  - It only deletes esbuild's top-level `*.js.map`; committed maps under
    `priv/static/assets/css/` are left untouched.

## Action items for you (these require your credentials / dashboard access)

### 1. Create a PostHog personal API key
- PostHog → Settings → [Personal API keys](https://us.posthog.com/settings/user-api-keys)
- Scopes required: **Error tracking: Write** and **Organization: Read**
- Copy the key (starts with `phx_`).

### 2. Set the secrets on Gigalixir
```bash
gigalixir config:set POSTHOG_CLI_API_KEY=phx_xxxxxxxxxxxxxxxxxxxx
gigalixir config:set POSTHOG_CLI_PROJECT_ID=55178
gigalixir config:set POSTHOG_CLI_HOST=https://us.posthog.com
```
(Project id `55178` and host `us.posthog.com` are this project's values.)

### 3. Deploy and watch the build log
```bash
git push gigalixir main
```
Watch the build output for the `[sourcemaps]` lines. Expected on success:
```
[sourcemaps] using: <cli>  (release mono-phoenix@<sha>)
[sourcemaps] upload complete.
```
⚠️ **First deploy is the real test.** I could not verify the build remotely, and
the one unknown is whether `posthog-cli` can be obtained inside the Gigalixir
buildpack (PATH for `npx`, or the `curl` installer). The script tries, in order:
an existing `posthog-cli` → `npx -y @posthog/cli@latest` → the standalone
installer. If you see `could not obtain posthog-cli`, that's the step to fix
(see "If CLI install fails" below) — the deploy itself still succeeds regardless.

### 4. Verify symbolication
- In PostHog → Error tracking → an issue's stack trace should now show source
  frames. Or check the served bundle carries a chunk id:
  ```bash
  curl -s https://<your-app>/assets/app.js | grep -o 'chunkId=[0-9a-f-]*' | head
  ```
- Trigger/await a JS exception and confirm the new `$exception` resolves to
  `app.js` source lines.

## If CLI install fails in the buildpack

Most robust fallback: vendor the binary install into the build. Options:
- Add `posthog-cli` install to `hook_pre_compile`/`hook_post_compile` in
  `elixir_buildpack.config` so it's on PATH before `assets.deploy` runs, or
- Add `@posthog/cli` to `assets/package.json` devDependencies **and** confirm the
  phoenix_static buildpack runs `npm install` before the Elixir post-compile hook
  (build-order dependent — verify in logs).

Ping me with the build log and I'll wire whichever path your buildpack supports.

## Rollback

The feature is inert without the secret. To fully revert, restore the
`assets.deploy` alias in `mix.exs` to `["esbuild default --minify", "phx.digest"]`
and delete `scripts/upload_sourcemaps.sh`.
