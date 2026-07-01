---
sidebar_position: 3
title: Bot Protection & Fingerprinting
description: Header-based bot scoring with a JavaScript proof-of-work challenge, plus JA3 TLS and ASN fingerprinting.
---

# Bot Protection & Fingerprinting

## Bot protection & JS challenge

- Each request is scored **O(1) from headers only**: scanner user agents, HTTP-library user agents,
  and missing/suspicious headers each add to an anomaly score.
- **Trusted SEO/social crawlers** (Googlebot, Bingbot, Applebot, etc.) are detected first and
  **bypass scoring and the challenge entirely**.
- When bot protection is active, requests without a valid bypass cookie are redirected to a
  **JavaScript proof-of-work challenge** (`/_cz/challenge`) — a SHA-256 nonce that a real browser
  solves in under a second, then receives an HMAC-signed bypass cookie.
- **Per-service bot mode** overrides the global setting:
  - `inherit` — use the global setting.
  - `always` — challenge every non-trusted client regardless of score.
  - `off` — never challenge.

Tune the global challenger (enabled, threshold, TTL) under **Settings → Bot protection**, and set
per-service overrides from each service's Manage panel. See the
[dashboard walkthrough](/docs/configuration/dashboard).

<div style={{margin: '1.5rem 0'}}>
  <img
    src="/img/docs/docs_bot_protection.png"
    alt="Bot Protection settings panel showing the enable toggle, anomaly threshold field set to 8, and bypass cookie TTL field set to 3600 seconds"
    width={900}
    height={500}
    style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid #e2e5ea'}}
  />
</div>

## JA3 TLS fingerprinting

JA3 fingerprints are computed at the **TLS handshake** and made available to the request handler,
giving you a TLS-layer signal (independent of headers) about the client.

## ASN / organization lookup

A bundled **DB-IP ASN Lite** database (`//go:embed`-ed) provides in-process ASN / organization
lookup for client IPs — **no MaxMind account, no external service**. Attribution is in
`THIRD_PARTY_NOTICES.md`. The resolved ASN/organization appears in each request's
[log detail view](/docs/configuration/dashboard).
