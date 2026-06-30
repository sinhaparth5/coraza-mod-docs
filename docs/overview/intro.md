---
slug: /intro
sidebar_position: 1
title: What It Does
description: A single-binary Web Application Firewall and reverse proxy for Linux, built on Coraza v3 and the OWASP Core Rule Set.
---

# Coraza WAF Mod

A single-binary **Web Application Firewall + reverse proxy** for Linux, built in Go on top of
[Coraza v3](https://github.com/corazawaf/coraza) (OWASP Core Rule Set) with a built-in
HTMX/Tailwind admin dashboard. There is **no Docker requirement, no external database, and no
Node toolchain** — one binary, one SQLite file.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    src="/img/arch_diagram_white-bg.png"
    alt="Coraza WAF Mod Architecture: User Request → Cloudflare → OS Firewall → Coraza WAF Proxy (with SQLite waf.db and HTMX/Tailwind Admin Dashboard) → Application Service"
    style={{maxWidth: '100%', borderRadius: '0.5rem'}}
  />
</div>

## What it does

Coraza WAF Mod sits in front of one or more backend web applications and inspects every incoming
HTTP request before it is allowed to reach a backend. For each request it runs an ordered
pipeline of defensive checks — bot challenge, IP blocklist, rate limiting, geo blocking, and full
WAF rule inspection — and only then reverse-proxies the request to the matching backend. Every
decision (blocked or allowed) is logged asynchronously to a local SQLite database, and the whole
thing is managed live from a built-in web dashboard with no restarts required.

It is designed to be **operationally boring**: a single statically-linked binary, a single SQLite
file for all state, a systemd unit, and an optional prune timer. Everything else — services,
rules, TLS, bot settings, rate limits — is configured at runtime through the dashboard and stored
in the database.

## What's inside

- **WAF inspection** — Coraza v3 + OWASP CRS compiled in; blocks SQLi, XSS, RCE, path traversal,
  and scanners out of the box. See [WAF Inspection](/docs/security/waf).
- **Reverse proxy & multi-app routing** — host- and prefix-based routing to many backends from one
  front door, hot-reloaded with no restart. See [Architecture](/docs/overview/architecture).
- **IP & geo blocking** — manual allow/block rules plus bundled GeoLite2 country blocking. See
  [IP & Geo Blocking](/docs/security/blocking).
- **Rate limiting** — per-IP token bucket, in-process or Redis-backed for multi-node. See
  [Rate Limiting](/docs/configuration/rate-limiting).
- **Bot protection** — header-based scoring with a JavaScript proof-of-work challenge, plus JA3 and
  ASN fingerprinting. See [Bot Protection](/docs/security/bot-and-fingerprinting).
- **Threat-intel auto-sync & webhooks** — pull external IP blocklists and forward events. See
  [Threat Intel & Webhooks](/docs/security/threat-intel-webhooks).
- **TLS / HTTPS** — plain HTTP, automatic Let's Encrypt, or your own certs, mixable per service. See
  [TLS Setup](/docs/configuration/tls).
- **Admin dashboard** — server-rendered HTMX + Tailwind, session-cookie auth, everything live. See
  [Using the Dashboard](/docs/configuration/dashboard).
- **Prometheus metrics & request logging** — per-cause counters and async SQLite logging. See
  [Metrics](/docs/configuration/metrics).

Ready to install? Head to [Requirements](/docs/installation/requirements).
