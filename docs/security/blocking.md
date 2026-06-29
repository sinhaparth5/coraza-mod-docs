---
sidebar_position: 2
title: IP & Geo Blocking
description: Manual IP allow/block rules and bundled GeoLite2 country blocking, both enforced early and hot-reloaded.
---

# IP & Geo Blocking

Two independent block lists are enforced **early** in the pipeline (before the WAF) and both
hot-reload on change. Manage them from the dashboard — see
[Blocks](/docs/configuration/dashboard).

## IP blocklisting

- Manual **allow/block** rules for individual IPs (or CIDR ranges), managed from the dashboard.
- Exact-match enforcement evaluated very early in the pipeline (before geo and WAF) so blocked IPs
  are rejected cheaply.
- Augmented automatically by the [threat-intel sync](/docs/security/threat-intel-webhooks) feature —
  synced IPs flow into the same blocklist and take effect immediately via hot reload.

## Geo / country blocking

- Country-level blocking using **MaxMind GeoLite2-Country**, with the database **bundled into the
  binary** — fresh installs block by country with **no MaxMind account or download step**.
- You can override the bundled database with a newer external `.mmdb` via the `--geo-db` flag.
- The client country is resolved from the [real client IP](/docs/security/trusted-proxy), so it works
  correctly behind Cloudflare or a trusted load balancer.

Enter a **2-letter ISO country code** (`RU`, `CN`, `US` — case-insensitive) and a rule type
(`block`/`allow`) on the **Geo Rules** page; the geo blocker reloads instantly.
