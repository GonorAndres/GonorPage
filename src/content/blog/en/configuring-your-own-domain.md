---
title: "Configuring Your Own Domain: How gonor.me Became My Place on the Internet"
description: "You buy a domain, open the DNS panel, and find an empty table with no hint of what goes where. This is a plain, honest walkthrough of pointing a custom domain at GitHub Pages through Cloudflare, written by someone doing it for only the second time, with every wrong turn left in. By the end, the handful of moving pieces make enough sense to reuse on your own domain."
date: "2026-07-12"
category: "herramientas"
lang: "en"
shape: "narrative"
tags: ["DNS", "Cloudflare", "GitHub Pages", "TLS", "Let's Encrypt", "Domains"]
ficha:
  rol: "Solo author"
  año: "2026"
  stack: "Cloudflare · GitHub Pages · DNS · Let's Encrypt"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/GonorAndres.github.io"
  live: "https://gonor.me"
---

For a couple of years, my personal site lived at `gonorandres.github.io`. It worked, and it was free. It was also, unmistakably, a room in someone else's house: the URL announced its landlord before it announced me.

So I bought `gonor.me` on Cloudflare, opened the DNS panel, and found myself staring at an empty table and a dropdown full of acronyms I only half-recognized. If you've ever sat in front of that same screen with no idea what to type, this post is for you. I'm not a networking specialist; this is only the second time in my life I've configured a domain. What follows is a how-I-did-it guide, wrong turns included, because the wrong turns are where I actually learned how any of this works.

The goal was modest. My site is built with Astro, the source lives in a public repo, and I wanted `https://gonor.me` to serve it over HTTPS with a real certificate. I also wanted to leave room for more services later, which turned out to matter more than I expected.

## First decision: do I need `www`?

Before I touched a single record, I hit a question I'd somehow never asked myself: should the site live at `gonor.me` or `www.gonor.me`?

It turns out `www` is mostly a fossil. Back in the 1990s and 2000s, organizations ran several services on one domain and used subdomains to tell them apart: `www.` for the web server, `ftp.` for file transfer, `mail.` for email. The `www` prefix was a routing convention, never a requirement of the web. Look at where modern sites actually live and you'll find Stripe, OpenAI, and GitHub itself serving straight from the bare domain, the apex.

So I went apex-only: `gonor.me` is the site. (`www` would still sneak back into the story later, but I didn't know that yet.)

## The `gonor.gonor.me` incident

My first record was supposed to point the root domain at GitHub Pages. In Cloudflare's DNS tab I started a CNAME and, figuring the "Name" field wanted the name of my domain, typed `gonor`.

Cloudflare accepted it without complaint. What I'd actually created was a record for `gonor.gonor.me`.

Here's the piece I was missing: inside a DNS zone, every name you type is *relative to the zone*. Cloudflare quietly appends the zone name, `gonor.me`, to whatever you enter. Type `www` and you get `www.gonor.me`. Type `gonor` and you get `gonor.gonor.me`. When you want the root domain itself, the apex, the convention is the `@` symbol, which stands for "this zone's own name."

I deleted the mutant record and filed the lesson away: **`@` is the apex.**

## Four A records and a grey cloud

There was a second problem with that first attempt, and it would have bitten me even if I'd typed the name correctly: you generally can't put a plain CNAME at the apex. A records point a name at an IP address; CNAME records make one name an alias for another. The apex, for reasons buried in the DNS standards, has to resolve to addresses directly.

GitHub Pages publishes four static IPs for exactly this. They're shared anycast load-balancer addresses used by *every* custom apex domain on Pages, not anything tied to my account:

```
Type  Name  Content            Proxy status
A     @     185.199.108.153    DNS only
A     @     185.199.109.153    DNS only
A     @     185.199.110.153    DNS only
A     @     185.199.111.153    DNS only
```

That last column matters. Cloudflare gives you two modes per record. **Proxied** (the orange cloud) routes visitor traffic through Cloudflare's edge network. **DNS only** (the grey cloud) just answers the DNS question honestly with the origin's real IP and steps out of the way: Cloudflare as a phonebook, nothing more.

I started with the grey cloud on purpose. During setup, GitHub needs to confirm the domain really points at Pages, and Let's Encrypt needs to reach the actual origin to issue a certificate. If Cloudflare's proxy is sitting in front during that handshake, GitHub sees Cloudflare's addresses instead of its own and the whole thing gets confused. Grey cloud now; the orange cloud could wait.

Then, in the repo's **Settings → Pages**, I set the custom domain to `gonor.me`. GitHub checked DNS, turned green, and quietly requested a certificate on my behalf. A few minutes later:

```
$ curl -vI https://gonor.me
< HTTP/2 200
* subject: CN=gonor.me
* issuer: Let's Encrypt
*  start date: Jul 12 2026; expire date: Oct 10 2026
```

A valid Let's Encrypt certificate, issued for my domain, served by GitHub, at no cost. I'll admit it felt a little magical.

## "InvalidDNSError" for a domain I never typed

Then the Pages settings threw up a warning: **InvalidDNSError for `www.gonor.me`**.

I read it twice. I had typed `gonor.me` into exactly one box. Where was `www` coming from?

This one isn't a mistake, it's documented behavior. When you set a custom domain, Pages always checks *both* the apex and its `www` counterpart, no matter which one you entered, because if both exist it can redirect one to the other automatically. The "error" wasn't something I'd done wrong; it was GitHub telling me the `www` variant didn't resolve yet. Purely informational.

Still, it made me reconsider. People do type `www` out of habit, and supporting it costs exactly one record:

```
Type   Name  Target                   Proxy status
CNAME  www   gonorandres.github.io    DNS only
```

Note that this one is a CNAME. `www` is a subdomain, not the apex, so aliasing it to a name is allowed and actually preferred. GitHub picks up the record, wires the redirect back to the apex, and anyone who types `www` lands in the right place.

## The mismatched certificate mystery

This is where it got genuinely confusing. Seconds after adding the `www` CNAME, I checked propagation against Cloudflare's own resolver:

```
$ dig www.gonor.me @1.1.1.1 +short
gonorandres.github.io.
185.199.108.153
...
```

DNS was done, basically instantly. So I curled the address, and got a TLS error. The verbose output told the story:

```
$ curl -v https://www.gonor.me
* subject: CN=*.github.io
* SSL: no alternative certificate subject name matches
  target host name 'www.gonor.me'
```

The connection was reaching GitHub fine, but GitHub was handing back its generic wildcard certificate, `*.github.io`, which obviously doesn't cover `www.gonor.me`. Its certificate pipeline for that specific hostname simply hadn't run yet.

This is the lesson I'd underline twice: **DNS propagation and the host's certificate issuance are two separate, asynchronous processes.** When `dig` says "done," it means the phonebook is updated. It says nothing about whether the host has noticed the new name, asked Let's Encrypt for a certificate, passed validation, and deployed it. That pipeline runs on its own clock, anywhere from a few minutes to about an hour. Nothing was broken. Two systems were just catching up to each other at different speeds, and sure enough, a while later the same command came back clean.

## Turning on the orange cloud, and the setting I'm glad I checked first

With everything working in DNS-only mode, I wanted the actual benefits of Cloudflare's proxy. Flipping a record to **Proxied** changes the shape of every request: visitors hit Cloudflare's edge network first, and Cloudflare forwards to GitHub behind the scenes. That's what turns it into a CDN, with cached responses served from an edge node near each visitor, plus DDoS protection, a hidden origin IP, and analytics for free.

But proxying splits every connection into two legs, browser to Cloudflare and Cloudflare to origin, and a setting under **SSL/TLS → Overview** decides how the second leg is encrypted:

- **Off**: no HTTPS anywhere. No.
- **Flexible**: HTTPS from the browser to Cloudflare, but plain HTTP from Cloudflare to the origin.
- **Full**: HTTPS on both legs, but the origin's certificate isn't strictly validated.
- **Full (strict)**: HTTPS on both legs, and the origin has to present a valid, trusted certificate.

Flexible is the one to watch, and it's worth understanding why before you ever flip the orange cloud. GitHub Pages *enforces* HTTPS: any plain-HTTP request gets answered with a redirect to HTTPS. Trace that through Flexible mode and you get a loop. The browser asks for `https://gonor.me` and reaches Cloudflare over HTTPS. Cloudflare, following the Flexible rule, forwards to GitHub over plain HTTP. GitHub replies "redirect to HTTPS." Cloudflare passes that back, the browser requests HTTPS again, Cloudflare downgrades again, and around it goes until the browser gives up with `ERR_TOO_MANY_REDIRECTS`. Every piece is working exactly as configured, and the site is completely inaccessible, with nothing in the error pointing at a dropdown three tabs away.

I didn't fall into this one, but only because I stopped to read what the modes actually meant first. Since GitHub already serves a real, valid certificate, there's no reason to use anything but **Full (strict)**: end-to-end encryption, fully validated. My checklist before touching the orange cloud was short:

1. GitHub Pages shows "DNS valid"
2. HTTPS demonstrably works on the domain
3. SSL/TLS mode is on Full (strict) *before* proxying

## "Am I locking myself in?"

One thing still nagged at me. Full (strict) demands a valid certificate from every origin. What happens if, someday, I point a subdomain at some scrappy little VM that only speaks plain HTTP?

The worry dissolved from three directions. First, it's a dropdown, not a vow; the mode is reversible whenever I want. Second, the right fix for an HTTP-only origin is to give it a certificate, not to weaken the whole zone. Let's Encrypt through certbot is free, and Cloudflare will even issue its own **Origin CA certificates**, good for up to fifteen years and built specifically for the Cloudflare-to-origin leg. Third, the setting doesn't have to apply zone-wide at all: Cloudflare's free-tier **Configuration Rules** let me override the SSL/TLS mode per hostname, so one oddball origin never dictates the security of everything else.

No lock-in. Full (strict) stays.

## The next chapter: one domain, many services

This is the part I'm most excited about, and the reason I cared about leaving room earlier. `gonor.me` was never meant to be a single static site. I want to run things on it, a web app on Vercel, an API on Google Cloud Run, and I needed a mental model for how one domain spreads across hosting platforms that have nothing to do with each other.

The model turns out to be pleasantly simple: **one hostname points at one destination**, and subdomains are free. The standard pattern is a subdomain per service:

```
gonor.me       →  GitHub Pages   (A records → 185.199.108-111.153)
app.gonor.me   →  Vercel         (CNAME → cname.vercel-dns.com)
api.gonor.me   →  Cloud Run      (CNAME → ghs.googlehosted.com)
```

Each subdomain gets its own DNS record aimed at its provider. Each provider verifies its own hostname and manages its own TLS certificate: GitHub's for the apex, Vercel's for `app`, Google's for `api`. They never collide, because certificates are scoped per hostname. Cloudflare stays exactly what it's been the whole time, a neutral DNS and CDN layer sitting over all of it.

There's a fancier alternative, path-based routing, where `gonor.me/app` and `gonor.me/api` live under one hostname. But that needs a reverse proxy or a Cloudflare Worker choosing an origin on every request. For a personal domain, it's cost without payoff. Subdomains win.

## What the empty panel taught me

A day earlier, DNS was a table of acronyms I copied and pasted into without really understanding. Now I can read the whole path end to end: the browser asks Cloudflare's resolver, the zone answers with A records or follows a CNAME, the request lands on an edge node or the origin itself, and TLS gets negotiated per hostname with a certificate that some pipeline issued on its own schedule. Every layer is a separate system running on its own clock, and most of my confusion had come from expecting them to move in step.

`https://gonor.me` loads with a green lock now, and it finally feels like *my* address. The apex is settled. `app.` and `api.` are waiting.

Next chapter soon.
