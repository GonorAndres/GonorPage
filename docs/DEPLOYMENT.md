# Deployment and branching model

Both environments are Cloudflare Pages projects built from this repository.
They are separate projects with separate deployments, so a broken dev build
cannot take gonor.me down.

## Environments

| Environment | Branch | Host | URL | Indexed by search engines |
|---|---|---|---|---|
| Production | `main` | Cloudflare Pages project `gonorpage`, deployed by GitHub Actions | https://gonor.me | Yes |
| Development | `dev` | Cloudflare Pages project `gonorpage-dev`, built by Cloudflare's GitHub App | https://gonorpage-dev.pages.dev | No |
| Local | working tree | `astro dev` | http://localhost:4321 | n/a |

Until 2026-10-11 production ran on GitHub Pages. See [Why production left GitHub Pages](#why-production-left-github-pages).

The `gonorpage-dev` project builds **only** `dev`. Every other branch,
including `main` and any `feature/*` branch, is invisible to it: no build, no
URL, no dashboard row (`preview_deployment_setting: none`). This keeps the
dashboard to one deployment at a time and removes the recurring cleanup of
orphaned preview deployments left behind by deleted branches. The tradeoff: a
feature branch has no isolated preview of its own; test it by merging into
`dev` first.

## The only path to production

```
push  ──►  dev  ──PR──►  main  ──► gonor.me
            │             │
            │             └── deploy.yml: build + SEO guard + Playwright gate
            │                 + wrangler pages deploy (project gonorpage) + smoke test
            └── Cloudflare (GitHub App) rebuilds gonorpage-dev.pages.dev on every push
```

There is exactly one pull request in this model, and it is `dev` → `main`.
Everything before that is ordinary pushing.

Rules, in order of importance:

1. **Never push directly to `main`.** Production changes arrive only through a
   pull request. Enforced by the `main is production` repository ruleset.
2. **A PR into `main` may only come from `dev`.** Enforced by
   `.github/workflows/guard-main.yml`, which fails the check on any other head
   branch. Merging `feature/x` straight into `main` would skip the dev
   environment, which is the whole point of having one.
3. **Pushing straight to `dev` is fine and expected.** No PR, no review, no
   ceremony. Cloudflare rebuilds the dev environment on every push, so the way
   you check your work is to push and reload the dev URL. `dev` is deliberately
   unprotected.
4. Feature branches are still fine to use for an isolated diff, but Cloudflare
   will not build them; there is no preview URL for a branch other than `dev`.
   Merge it into `dev` however you like, including a plain fast-forward, then
   check it on the dev URL.
5. `dev` may be ahead of production, but it is not a scratch branch: it should
   always build. If `dev` is red, fix it before opening `dev` → `main`. Nothing
   enforces this, which is exactly why it is written down.

### Everyday work

```bash
git checkout dev && git pull
# ... work ...
git commit && git push
```

Then reload https://gonorpage-dev.pages.dev after a minute or two.

### Promoting dev to production

```bash
git checkout dev && git pull
gh pr create --base main --head dev --title "Release: <summary>"
```

Then check that `PR into main must come from dev` passes, and merge. Merging is
the deploy. `deploy.yml` runs on push to `main` and stops at the first failure:

1. builds the site with `PUBLIC_POSTHOG_KEY` from repository secrets;
2. runs the SEO guard, `scripts/check-seo-output.mjs` (see below);
3. runs the Playwright deploy gate against `astro preview`;
4. uploads `dist/` to the `gonorpage` project (`wrangler pages deploy --branch=main`);
5. smoke-tests the new deployment: `/` is 200, an unknown path is 404, the
   pages.dev URL carries `X-Robots-Tag: noindex`, and `https://gonor.me/` is 200
   **without** `X-Robots-Tag`.

## How Cloudflare is wired

### Production: `gonorpage` (direct upload)

- Created as a **direct-upload** project: Cloudflare never pulls the code, the
  workflow pushes the built `dist/`. It has no build settings in the dashboard.
  A direct-upload project can never be converted to Git integration, and vice
  versa.
- Production branch `main`. Custom domain `gonor.me`.
- GitHub Actions secrets on `GonorAndres/GonorPage`:
  - `CLOUDFLARE_API_TOKEN`: a dedicated token with only **Account → Cloudflare
    Pages → Edit**. If it leaks it can deploy Pages and nothing else. Do not
    replace it with a broader token.
  - `CLOUDFLARE_ACCOUNT_ID`
  - `PUBLIC_POSTHOG_KEY`
- Rolling back production: in the dashboard, `gonorpage` → Deployments → pick
  the previous deployment → **Rollback to this deployment**. Instant, no
  rebuild. Or revert on `dev` and promote again.

### Development: `gonorpage-dev` (Git integration)

- Connected to `GonorAndres/GonorPage` through Cloudflare's **GitHub App**.
  Cloudflare pulls the code and builds it on its own runners, so there are no
  secrets in this repository for dev.
- Build settings live in the Cloudflare dashboard, not in this repo. Current
  values: build command `npm run build`, output directory `dist`, root
  directory empty, production branch `dev`, **preview deployments disabled**
  (`preview_deployment_setting: "none"`), PR comments enabled (moot while
  preview deployments are off).
- Because the settings are outside version control, this list is the record of
  them. If you change them in the dashboard, update this file in the same PR.
- Every push to `dev` redeploys `gonorpage-dev.pages.dev`, normally in one to
  two minutes.

### DNS and edge rules (zone `gonor.me`)

| Record / rule | Value | Why |
|---|---|---|
| `CNAME gonor.me` | `gonorpage.pages.dev`, proxied | Apex served by the Pages custom domain (CNAME flattening) |
| `CNAME www` | `gonor.me`, proxied | Only exists so the redirect rule below can answer |
| Redirect rule `www → apex` | `http.host eq "www.gonor.me"` → `concat("https://gonor.me", http.request.uri.path)`, 301, preserve query | One hop from any `www` URL |
| Redirect rule `http → https` | `http.host eq "gonor.me" and not ssl` → same target, 301, preserve query | One hop from `http://`. Zone-wide "Always Use HTTPS" is **off** on purpose: it runs before redirect rules and would make `http://www` two hops |
| Bulk Redirect `gonorpage.pages.dev` | → `https://gonor.me`, 301, preserve query, subpath matching, preserve path suffix, **include subdomains off** | Consolidates the provider URL; `<hash>.gonorpage.pages.dev` previews stay reachable |
| Worker route `gonor.me/ingest/*` | `gonor-analytics-proxy` | Same-origin PostHog proxy. Only runs on proxied traffic, so the apex must stay proxied |
| SSL/TLS mode | Full (strict) | The origin is Cloudflare itself, so strict always validates |

Redirect rules and Bulk Redirects are managed in the dashboard (Rules →
Redirect Rules; account → Bulk Redirects). The VM's API token has no Rulesets
permission, so they are not scripted.

**Certificates need no maintenance.** The edge certificate for `gonor.me` and
`*.gonor.me` is Cloudflare Universal SSL, renewed automatically. There is no
origin certificate to renew because the origin is Cloudflare Pages.

### The dev URL is public

A Pages deployment is reachable by anyone who knows its URL, and
`gonorpage-dev.pages.dev` is a fixed, guessable address. `X-Robots-Tag: noindex`
keeps it out of search results; it is not access control. Treat anything pushed
to `dev` as published. To actually restrict it, put a Cloudflare Access policy
in front of the hostname from the Zero Trust dashboard; the free tier covers a
single-user policy. That is not configured today.

To inspect either project from the CLI (the API token already lives in this
machine's environment):

```bash
npx wrangler pages project list
npx wrangler pages deployment list --project-name gonorpage
npx wrangler pages deployment list --project-name gonorpage-dev
```

### Old deployments accumulate

Each deploy leaves the previous one behind as history; only the newest is
served. The dashboard's "Production" tag on a `gonorpage-dev` row means it was
built from `dev`, not that it is serving gonor.me.

To clean up old ones, delete by ID:

```bash
npx wrangler pages deployment delete <deployment-id> --project-name <project> --force
```

Keep the current live deployment. On `gonorpage`, keep a few recent ones too:
they are the instant-rollback targets.

## SEO safeguards

Production and dev serve the **same build**, so anything in `public/` applies
to both. Indexing is controlled by hostname, never by path:

- **`public/_headers`** sets `X-Robots-Tag: noindex, nofollow` only on
  `https://:project.pages.dev/*` and `https://:version.:project.pages.dev/*`
  (Cloudflare's documented host placeholders). Those match
  `gonorpage-dev.pages.dev`, `gonorpage.pages.dev` and every
  `<hash>.<project>.pages.dev` preview, and never `gonor.me`.
- **Never** put `X-Robots-Tag` under a path-only rule like `/*`. It would also
  apply to gonor.me and deindex the site. `scripts/check-seo-output.mjs` fails
  the deploy if that happens, or if `404.html`, `robots.txt`,
  `sitemap-index.xml`, `_headers` or `_redirects` is missing from `dist/`, or if
  `robots.txt` disallows `/`. Run it locally with
  `node scripts/check-seo-output.mjs`.
- **`dist/404.html` must exist.** Without it Cloudflare Pages assumes a
  single-page app and answers every unknown URL with the home page and status
  200 (soft 404s across the whole site). `src/pages/404.astro` produces it.
- **`public/_redirects`** sends legacy `/notes/*` URLs to `/artifacts/*` with a
  real 301. The meta-refresh pages Astro generates from `redirects` in
  `astro.config.mjs` remain as a fallback for local preview.
- **No `_worker.js` and no `functions/` directory.** Either one puts the
  project in Functions/advanced mode, and Cloudflare does not apply `_headers`
  or `_redirects` to responses produced by Functions, which would silently
  remove the noindex and the redirects above. The canonical-domain skill's
  `_worker.js` recipe is for apps that already run a worker, not for this site.
- `site` in `astro.config.mjs` is the constant `https://gonor.me`, so canonical
  URLs, hreflang and the sitemap point at production even on dev. That is
  intentional. Do not submit the dev URL to any search console.
- Cloudflare serves `/foo/index.html` at `/foo/` and answers `/foo` with a 308
  to `/foo/`. Internal links and the sitemap already use the trailing slash.

Expected behaviour, which is what to check after any change to DNS, rules or
`public/_headers`:

| Request | Expected |
|---|---|
| `https://gonor.me/` and every sitemap URL | 200, no `x-robots-tag` |
| `http://gonor.me/x/`, `http://www.gonor.me/x/`, `https://www.gonor.me/x/` | one 301 to `https://gonor.me/x/` |
| `https://gonor.me/notes/sima/` | 301 to `/artifacts/sima/` |
| `https://gonor.me/does-not-exist/` | 404 |
| `https://gonorpage.pages.dev/x/` | 301 to `https://gonor.me/x/` |
| `https://gonorpage-dev.pages.dev/` | 200 with `x-robots-tag: noindex, nofollow` |
| `https://gonorandres.github.io/GonorPage/x/` | lands on `https://gonor.me/x/` (served by the `GonorAndres.github.io` redirect repo) |
| `https://gonor.me/ingest/...` | answered by the PostHog proxy Worker, not a Pages 404 |

## Analytics in dev

GA4 and PostHog are disabled on localhost by the code itself. On
`gonorpage-dev`, the `PUBLIC_POSTHOG_KEY` environment variable is deliberately
left unset, so PostHog does not initialise and dev traffic never pollutes
production metrics. The variable is set only in GitHub Actions, from repository
secrets, for the production build.

## Runbook

### Site shows a Cloudflare error (5xx) or a certificate warning

1. `curl -sI https://gonor.me/`: note the status and `server:` header.
2. Check the latest run of **Deploy to Cloudflare Pages** in GitHub Actions and
   the `gonorpage` project's custom domain status (dashboard → Custom domains
   must say *Active*).
3. Check DNS: `dig +short gonor.me` must return Cloudflare IPs (the record is
   proxied). If someone set it to DNS-only, the Worker route and the redirect
   rules stop working.
4. If the last deployment is bad, roll back to the previous deployment from the
   dashboard. That needs no build.

### Search Console after any hosting change

Resubmit `https://gonor.me/sitemap-index.xml`, request indexing for `/` and
`/en/`, and watch *Pages → Why pages aren't indexed* for a week. Any new
"Excluded by noindex" on gonor.me means the `_headers` rule leaked.

## Why production left GitHub Pages

On 2026-10-10 the Let's Encrypt certificate GitHub Pages held for gonor.me
expired, and gonor.me answered **526** on every page for about a day. The apex
was proxied through Cloudflare with SSL mode *Full (strict)*: Cloudflare
validated GitHub's origin certificate, found it expired, and refused to serve.

GitHub could not renew it because its automatic renewal first checks that the
domain resolves to GitHub's own IPs, and a proxied record resolves to
Cloudflare's. The renewal ended in `bad_authz` ("The ACME authorization is in a
bad state") and stayed there. On 2026-10-11 the records were set to DNS-only so
GitHub could reissue, and removing and re-adding the custom domain three times
did not clear the state within 90 minutes. Meanwhile HTTPS visitors saw a
certificate warning, and the `/ingest` PostHog proxy (a Worker route that only
runs on proxied traffic) returned 404. Service was restored by re-proxying under
SSL mode *Full*, which accepts an expired origin certificate.

GitHub Pages behind the Cloudflare proxy means a manual renewal every 90 days
with an outage window each time. GitHub Pages without the proxy loses the
`/ingest` route. Moving production to Cloudflare Pages removes the origin
certificate entirely. GitHub Actions still builds and gates every release, so
only the upload target changed.
