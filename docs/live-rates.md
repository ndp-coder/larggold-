# One-second rate refresh

The active page requests rates immediately and then once every 1,000 ms. It skips
a tick while a request is pending, cancels requests on unmount, and times out a
stalled request after 10 seconds so polling can recover. Existing rates remain
visible during errors. Browser background-tab throttling and network latency can
slow the refresh; prices change only when the upstream feed changes.

The `metal-rates` Edge Function shares quotes through `rates_cache` for one second
instead of 15 seconds. Responses disable HTTP caching and include `cachedAt`, the
time the server fetched the rates. The page uses that timestamp for `Updated`,
including when the server or service worker returns an older cached quote.
This timestamp describes a successful fetch, not an exchange trade timestamp.

## Deployment

First set `UPSTOX_TOKEN` in Supabase Project Settings > Edge Functions > Secrets.
The function now requires this secret; the previously embedded token fallback
has been removed. Rotate the exposed token through Upstox before saving its
replacement. Never commit the token or paste it into a deployment command.

Deploy **both** the frontend and the Edge Function. Updating only the frontend
leaves the old server cache in place:

```sh
supabase functions deploy metal-rates --project-ref YOUR_PROJECT_REF
npm run build
```

Publish the resulting `dist` directory through the existing hosting workflow.
Keep the existing frontend `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
configuration and server `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and
`UPSTOX_TOKEN` secrets. No database migration is required.

One-second polling means up to 60 Edge Function requests per minute per open page.
The shared cache reduces upstream traffic; simultaneous cache misses across
function instances can still make multiple upstream calls. For high traffic,
use a single server-side streaming feed and broadcast updates to clients.
Respect the provider's [rate limits](https://upstox.com/developer/api-documentation/rate-limiting/).

## Verification

```sh
npm test
npm run typecheck
npm run build
npm run lint
```

The regression tests cover the one-second schedule, slow-request overlap,
unmount cancellation, timeout recovery, retained quotes after errors, and server
cache expiry. Network responses and timers are faked; they do not contact Upstox
or use live credentials.
