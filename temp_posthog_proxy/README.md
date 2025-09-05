# PostHog Proxy Implementation - Work in Progress

This directory contains the PostHog reverse proxy implementation that was temporarily shelved.

## Files:
- `posthog_proxy_controller.ex` - Controller handling PostHog API proxy requests
- `posthog_body_reader.ex` - Plug for reading raw request bodies to avoid UTF-8 validation issues

## Status:
Routes are commented out in `router.ex` (lines 20-39). The files were moved here to prevent Phoenix compilation errors about `:formats option`.

## To Resume Work:
1. Move files back to their original locations:
   - `posthog_proxy_controller.ex` → `lib/mono_phoenix_v01_web/controllers/`
   - `posthog_body_reader.ex` → `lib/mono_phoenix_v01_web/plugs/`
2. Uncomment the routes in `router.ex` (lines 20-39)
3. Test the proxy functionality

## Original Error:
The controller was generating format-related errors during Phoenix compilation, eating up token quota during development sessions.