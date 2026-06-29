# Coraza WAF Mod — Complete Documentation

A single‑binary **Web Application Firewall + reverse proxy** for Linux, built in Go on top of
[Coraza v3](https://github.com/corazawaf/coraza) (OWASP Core Rule Set) with a built‑in
HTMX/Tailwind admin dashboard. There is **no Docker requirement, no external database, and no
Node toolchain** — one binary, one SQLite file.

```
                    ┌─────────────────────────────────────────────┐
   [ Client ]  ───► │  Coraza WAF + Reverse Proxy (single binary)  │ ───►  [ Backend App(s) ]
                    │                                             │
                    │   bot gate → IP block → rate limit →        │
                    │   geo block → WAF inspect → proxy           │
                    └───────────────┬─────────────────────────────┘
                                    │  ▲
                              [ SQLite waf.db ]
                                    │  ▲
                          [ HTMX / Tailwind Admin Dashboard ]
```

---

## Table of Contents

1. [What It Does](#1-what-it-does)
2. [Feature Reference](#2-feature-reference)
   - 2.1 [WAF Inspection (Coraza + OWASP CRS)](#21-waf-inspection-coraza--owasp-crs)
   - 2.2 [Reverse Proxy & Multi‑App Routing](#22-reverse-proxy--multi-app-routing)
   - 2.3 [IP Blocklisting](#23-ip-blocklisting)
   - 2.4 [Geo / Country Blocking](#24-geo--country-blocking)
   - 2.5 [Rate Limiting (Memory or Redis)](#25-rate-limiting-memory-or-redis)
   - 2.6 [Bot Protection & JS Challenge](#26-bot-protection--js-challenge)
   - 2.7 [JA3 TLS Fingerprinting](#27-ja3-tls-fingerprinting)
   - 2.8 [ASN / Organization Lookup](#28-asn--organization-lookup)
   - 2.9 [Threat‑Intel Auto‑Sync](#29-threat-intel-auto-sync)
   - 2.10 [Webhook Event Delivery](#210-webhook-event-delivery)
   - 2.11 [TLS / HTTPS](#211-tls--https)
   - 2.12 [Admin Dashboard](#212-admin-dashboard)
   - 2.13 [Prometheus Metrics](#213-prometheus-metrics)
   - 2.14 [Request Logging & Retention](#214-request-logging--retention)
   - 2.15 [Security Response Headers](#215-security-response-headers)
   - 2.16 [Trusted‑Proxy / Real Client IP](#216-trusted-proxy--real-client-ip)
3. [Requirements](#3-requirements)
4. [Installation](#4-installation)
   - 4.1 [Option A — One‑line installer (download, then run)](#41-option-a--one-line-installer-download-then-run)
   - 4.2 [Option B — Build from source](#42-option-b--build-from-source)
   - 4.3 [Option C — Pre‑built release binaries](#43-option-c--pre-built-release-binaries)
5. [Command‑Line Interface](#5-command-line-interface)
   - 5.1 [Runtime flags](#51-runtime-flags)
   - 5.2 [Subcommands](#52-subcommands)
6. [First Run & Initial Setup](#6-first-run--initial-setup)
7. [Using the Dashboard](#7-using-the-dashboard)
   - 7.1 [Services (backend apps)](#71-services-backend-apps--what-gets-proxied)
   - 7.2 [Blocks — IP rules & geo/country rules](#72-blocks--ip-rules--geocountry-rules)
   - 7.3 [Certificates & per‑service TLS](#73-certificates--per-service-tls)
   - 7.4 [Request logs](#74-request-logs)
   - 7.5 [Settings](#75-settings)
   - 7.6 [Dashboard home, notifications & metrics](#76-dashboard-home-notifications--metrics)
8. [TLS Setup In Depth](#8-tls-setup-in-depth)
9. [Rate Limiting In Depth](#9-rate-limiting-in-depth)
10. [Log Retention & Pruning](#10-log-retention--pruning)
11. [Running as a systemd Service](#11-running-as-a-systemd-service)
12. [Upgrading](#12-upgrading)
13. [Architecture Deep Dive](#13-architecture-deep-dive)
14. [Building & Releasing](#14-building--releasing)
15. [Troubleshooting](#15-troubleshooting)
16. [FAQ](#16-faq)

---

## 1. What It Does

Coraza WAF Mod sits in front of one or more backend web applications and inspects every incoming
HTTP request before it is allowed to reach a backend. For each request it runs an ordered
pipeline of defensive checks — bot challenge, IP blocklist, rate limiting, geo blocking, and full
WAF rule inspection — and only then reverse‑proxies the request to the matching backend. Every
decision (blocked or allowed) is logged asynchronously to a local SQLite database, and the whole
thing is managed live from a built‑in web dashboard with no restarts required.

It is designed to be **operationally boring**: a single statically‑linked binary, a single SQLite
file for all state, a systemd unit, and an optional prune timer. Everything else — services,
rules, TLS, bot settings, rate limits — is configured at runtime through the dashboard and stored
in the database.

---

## 2. Feature Reference

### 2.1 WAF Inspection (Coraza + OWASP CRS)

- Embeds **Coraza v3** with the **OWASP Core Rule Set (CRS)** compiled directly into the binary —
  there is nothing to download or mount.
- Out of the box it detects and blocks common attack classes: **SQL injection, XSS, remote code
  execution, path traversal, restricted‑file access**, and **known scanner user agents**.
- Custom `.conf` rule files can be layered **on top of** the CRS by pointing the
  `--waf-rules` flag at a directory.
- WAF rules can be **individually disabled** from the dashboard (the engine reads the disabled‑rule
  list from the database and rebuilds itself live), so you can silence a noisy rule without editing
  files or restarting.
- **Important engine behavior:** the recommended Coraza config ships in `DetectionOnly` mode by
  default, and the project deliberately enables blocking (`SecRuleEngine On`) **after** the CRS
  includes so that rules actually block rather than merely score. This is handled internally.

### 2.2 Reverse Proxy & Multi‑App Routing

- Routes to as many backend apps ("services") as you need from a single front door.
- Two match modes per service:
  - **Host match** — virtual hosting by `Host` header (e.g. `api.example.com` → one backend,
    `blog.example.com` → another). The request path is passed through untouched.
  - **Prefix match** — route by URL path prefix (e.g. `/api` → a backend), with **automatic
    prefix stripping** before proxying, exactly like nginx `proxy_pass http://backend/`. The
    original client path is restored before logging so the dashboard shows what the client really
    requested.
- **Routing precedence:** all prefix matches are evaluated first (**longest prefix wins**), then
  host matches — mirroring nginx `location` blocks beating `server_name` defaults.
- Each service gets its **own pre‑built reverse proxy** with sane timeouts (5s dial, 10s response
  header) so a slow/dead backend cannot stall browser connection slots indefinitely.
- Services are **database‑backed and hot‑reloaded**: adding, editing, or removing a service rebuilds
  the routing registry instantly with **no restart**.
- **Passive health tracking:** there is no background polling loop. A service is marked unhealthy
  when a real proxied request fails and healthy again when one succeeds. The only active check is a
  single one‑shot reachability probe when a service is first added (to reject obviously‑dead
  backends before saving).

### 2.3 IP Blocklisting

- Manual **allow/block** rules for individual IPs, managed from the dashboard.
- Exact‑match enforcement evaluated very early in the pipeline (before geo and WAF) so blocked IPs
  are rejected cheaply.
- Augmented automatically by the [threat‑intel sync](#29-threat-intel-auto-sync) feature.

### 2.4 Geo / Country Blocking

- Country‑level blocking using **MaxMind GeoLite2‑Country**, with the database **bundled into the
  binary** — fresh installs block by country with **no MaxMind account or download step**.
- You can override the bundled database with a newer external `.mmdb` via the `--geo-db` flag.
- The client country is resolved from the [real client IP](#216-trusted-proxy--real-client-ip), so
  it works correctly behind Cloudflare or a trusted load balancer.

### 2.5 Rate Limiting (Memory or Redis)

- **Per‑client‑IP token‑bucket** limiting, applied globally ahead of geo/WAF inspection, plus
  optional **per‑service** limits.
- Two interchangeable backends:
  - **In‑process limiter** (default, single node) — token‑bucket state is **persisted to SQLite
    every 10 seconds**, so limits survive restarts.
  - **Redis backend** (multi‑node) — atomic token bucket implemented as a Redis Lua script, so a
    cluster of WAF instances shares one rate‑limit view. **Fails open** if Redis is unavailable.
- The active backend (memory vs. Redis) and Redis credentials are stored in the database and chosen
  from the dashboard — switching backends is a hot reload, no restart.

### 2.6 Bot Protection & JS Challenge

- Each request is scored **O(1) from headers only**: scanner user agents, HTTP‑library user agents,
  and missing/suspicious headers each add to an anomaly score.
- **Trusted SEO/social crawlers** (Googlebot, Bingbot, Applebot, etc.) are detected first and
  **bypass scoring and the challenge entirely**.
- When bot protection is active, requests without a valid bypass cookie are redirected to a
  **JavaScript proof‑of‑work challenge** (`/_cz/challenge`) — a SHA‑256 nonce that a real browser
  solves in under a second, then receives an HMAC‑signed bypass cookie.
- **Per‑service bot mode** overrides the global setting:
  - `inherit` — use the global setting.
  - `always` — challenge every non‑trusted client regardless of score.
  - `off` — never challenge.

### 2.7 JA3 TLS Fingerprinting

- JA3 fingerprints are computed at the **TLS handshake** and made available to the request handler,
  giving you a TLS‑layer signal (independent of headers) about the client.

### 2.8 ASN / Organization Lookup

- Bundled **DB‑IP ASN Lite** database (`//go:embed`‑ed) provides in‑process ASN / organization
  lookup for client IPs — **no MaxMind account, no external service**. Attribution is in
  `THIRD_PARTY_NOTICES.md`.

### 2.9 Threat‑Intel Auto‑Sync

- A background worker periodically downloads external **plain‑text IP block lists**, parses out
  IP/CIDR tokens (ignoring `#`/`;` comments, capped at a 10 MiB read), and writes them into the
  database.
- The IP blocklist reads from the same store, so synced IPs take effect **immediately via hot
  reload** — no restart.
- A **"sync now"** button in the dashboard fetches a single source on demand.

### 2.10 Webhook Event Delivery

- Forwards request events to a configured webhook endpoint, **fully asynchronously** so a slow or
  unreachable webhook never blocks the logging pipeline.
- Delivery is filtered by a configurable, comma‑separated **event list** (managed from the
  dashboard).

### 2.11 TLS / HTTPS

- Three modes, mixable:
  - **Plain HTTP** (default) — no TLS.
  - **Automatic Let's Encrypt (ACME)** — provide a domain + contact email; certificates are issued
    on first HTTPS request and cached on disk.
  - **Your own certificate** — supply a PEM cert/key as the global fallback, and/or upload a custom
    cert **per service** from the dashboard.
- **Per‑service TLS:** each backend can have its own uploaded cert or its own auto‑issued cert.
  Certificates are resolved by SNI: per‑service custom cert → per‑service/legacy autocert → global
  fallback.
- Uploaded private keys are stored **on disk** under `certs/services/<name>/` with `0600`
  permissions — never in the database.
- A `gencert` subcommand generates a self‑signed ECDSA P‑256 certificate (with hostname/IP SANs) so
  IP‑based deployments get HTTPS without openssl.

### 2.12 Admin Dashboard

- Server‑rendered HTML with **HTMX partial swaps** for live updates, styled with **Tailwind**.
- Behind **session‑cookie authentication** (bcrypt password check, 24‑hour cookie, sessions stored
  in SQLite — not HTTP Basic Auth).
- Live features: traffic & threat charts, **filterable request logs with live tail over SSE**,
  IP/geo rule management, service management (with a reachability‑checking add wizard), TLS
  management, bot/rate‑limit settings, threat‑intel sources, and webhook configuration.
- All changes apply **immediately** — adding a service, toggling a WAF rule, changing the rate‑limit
  backend, etc. never requires a restart.
- Mounted at `/admin` by default.

### 2.13 Prometheus Metrics

- Prometheus exposition endpoint at **`/admin/metrics`**.
- Exposes per‑cause block counters (`IPBlockedTotal`, `GeoBlockedTotal`, `WAFBlockedTotal`,
  `RateLimitedTotal`, `BotChallengedTotal`), request volume and latency, live gauges for log‑queue
  depth and service count, plus standard Go runtime metrics.

### 2.14 Request Logging & Retention

- Every pipeline stage logs to SQLite via a **fire‑and‑forget queue** drained by a dedicated worker
  goroutine, so logging **never blocks the request hot path**.
- Logs are retained for a configurable number of days; pruning is a **separate one‑shot command**
  (`prune`) meant to be run by cron or the bundled systemd timer, so a large delete never contends
  with live request traffic.

### 2.15 Security Response Headers

- A global middleware sets browser‑hardening headers on **every** response (blocked, admin, and
  proxied alike): `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, plus **HSTS on TLS connections** and
  `X-Protected-By` / `X-WAF-Engine` identification headers.
- The `Server` header on every response is forced to `Coraza WAF Mod`, overwriting whatever the
  backend sent.

### 2.16 Trusted‑Proxy / Real Client IP

- The client IP used for blocklist, geo, rate limiting, and logging is resolved by precedence:
  1. `CF-Connecting-IP` — **only** when the socket peer is in Cloudflare's published ranges.
  2. `X-Forwarded-For` / `X-Real-IP` — **only** when the socket peer is in a configured
     trusted‑proxy CIDR (`--trusted-proxies`).
  3. Otherwise, the **raw socket peer address**.
- **Forwarded headers are never trusted by default.** Without `--trusted-proxies`, a direct client
  cannot forge its source IP to evade IP/geo blocks or reset its rate‑limit bucket.

---

## 3. Requirements

| | |
|---|---|
| **OS (running)** | Linux (the installer and systemd units are Linux‑only). Windows binaries can be built but the installer does not target them. |
| **Architecture** | `amd64` (x86_64) or `arm64` (aarch64). |
| **Privileges** | Root (via `sudo`) only to install the systemd service and bind ports 80/443. The service itself runs as a dedicated non‑root user. |
| **Go (building only)** | Go **1.25+**. Not needed if you use a release binary. |
| **External services** | None required. Redis is optional (only for multi‑node rate limiting). |

Everything — SQLite driver (`modernc.org/sqlite`), GeoIP, ASN — is pure Go, so binaries are built
with `CGO_ENABLED=0` and run with no shared‑library dependencies.

---

## 4. Installation

### 4.1 Option A — One‑line installer (download, then run)

> **Recommended pattern: download the script first, then run it.**
> The installer is **interactive** (it prompts for admin email, password, and an optional domain).
> Piping `curl … | sudo bash` can break that interactivity and is also fragile if the connection is
> slow — a stalled pipe can time out mid‑install. Downloading the script to disk first and running
> it as a separate step avoids both problems.

```bash
# 1) Download the installer to the current directory
curl -fsSL -o install.sh \
  https://gitlab.com/sinhaparth5/coraza-waf-mod/-/raw/main/deploy/install.sh

# 2) Run it with root privileges
sudo bash install.sh
```

What the installer does:

1. Detects your OS and CPU architecture (`amd64`/`arm64`).
2. Detects the **latest release** from GitLab (or honors a pinned `CORAZA_VERSION`).
3. **Downloads the matching binary and `checksums.txt`, then verifies the SHA‑256 checksum** before
   installing to `/usr/local/bin/coraza-waf-mod`.
4. Prompts interactively for:
   - **Admin email** and **password** (entered twice).
   - An optional **domain name** — if given, Let's Encrypt is used; if blank, a self‑signed cert is
     generated for the server's public IP.
5. Creates a dedicated non‑root system user `coraza-waf-mod` (with only `CAP_NET_BIND_SERVICE`, so
   it can bind 80/443 without being root).
6. Creates `/var/lib/coraza-waf-mod/` (data + certs), seeds admin credentials into the database via
   the `setup` subcommand, and generates a self‑signed cert via `gencert` when no domain is given.
7. Installs and starts three systemd units: the main service, plus a **prune service + timer**
   (log retention, runs every 15 days).

Useful environment overrides:

```bash
# Pin a specific version
sudo CORAZA_VERSION=v1.0.0 bash install.sh

# Private GitLab project — supply a personal access token
sudo GITLAB_TOKEN=glpat-xxxxxxxx bash install.sh

# Dry run — print every action, write nothing (no root needed)
DRY_RUN=1 bash install.sh
```

After it finishes:

```bash
sudo systemctl status coraza-waf-mod      # is it running?
sudo journalctl -u coraza-waf-mod -f      # follow logs
```

The dashboard is then reachable at **`https://<your-domain-or-server-ip>/admin`**. With a
self‑signed certificate, your browser will show a security warning the first time — accept the
exception. You can later switch to a trusted certificate from **Settings → TLS**.

> **Note on the download URL:** the path above points at the project's GitLab repository
> (`gitlab.com/sinhaparth5/coraza-waf-mod`). If you host releases elsewhere, change the URL to wherever
> `deploy/install.sh` and the release binaries are actually published.

### 4.2 Option B — Build from source

Requires Go 1.25+.

```bash
git clone https://gitlab.com/sinhaparth5/coraza-waf-mod.git
cd coraza-waf-mod
make build          # runs `go generate` (minifies JS) then `go build` → ./coraza-waf-mod
```

Then seed an admin account and start it:

```bash
# Create the first admin (reads the password from stdin)
printf 'your-strong-password\n' | ./coraza-waf-mod setup \
  --db ./waf.db --admin-email you@example.com

# Start the WAF + proxy on :8080
./coraza-waf-mod --db ./waf.db --listen :8080
```

> **Build note:** never run bare `go build` after editing JavaScript in `static/js/src/*.js` — the
> minifier runs via `go generate`, which `make build` triggers but `go build` does not. Use
> `make build`, or run `go generate ./...` first.

### 4.3 Option C — Pre‑built release binaries

```bash
make dist          # cross-compiles linux/amd64, linux/arm64, windows/amd64 (CGO_ENABLED=0)
make checksums     # writes dist/checksums.txt
```

The binaries land in `dist/`. Copy the one for your platform, mark it executable, and run it the
same way as Option B.

---

## 5. Command‑Line Interface

The binary is configured entirely through **CLI flags** (bootstrap settings) plus the **admin
dashboard / database** (everything runtime). There is no longer a `config.yaml` that the running
server reads — all knobs are flags or DB‑managed.

### 5.1 Runtime flags

Start the WAF/proxy/dashboard by running the binary with any of these flags:

| Flag | Default | Description |
|---|---|---|
| `--listen` | `:8080` | HTTP listen address. |
| `--listen-tls` | *(empty)* | HTTPS listen address. Empty = HTTP only. |
| `--trusted-proxies` | *(empty)* | Comma‑separated CIDRs allowed to supply `X-Forwarded-For` / `X-Real-IP`. |
| `--db` | `waf.db` | SQLite database path. |
| `--certs` | `./certs` | TLS certificate cache directory (Let's Encrypt files). |
| `--waf-rules` | *(empty)* | Directory of extra `.conf` WAF rules, loaded on top of OWASP CRS. |
| `--geo-db` | *(empty)* | Path to an external `GeoLite2-Country.mmdb`. Empty = use bundled DB. |
| `--retention` | `30` | Request‑log retention in days. `0` = keep forever (used by `prune`). |
| `--tls-cert` | *(empty)* | PEM certificate file for the HTTPS fallback (self‑signed). |
| `--tls-key` | *(empty)* | Matching PEM private key for `--tls-cert`. |

Example (HTTP + HTTPS, behind a known load balancer):

```bash
./coraza-waf-mod \
  --listen :80 \
  --listen-tls :443 \
  --tls-cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
  --tls-key  /var/lib/coraza-waf-mod/certs/self-signed.key \
  --trusted-proxies 10.0.0.0/8,192.168.0.0/16 \
  --db /var/lib/coraza-waf-mod/waf.db \
  --certs /var/lib/coraza-waf-mod/certs \
  --retention 30
```

### 5.2 Subcommands

Each subcommand does one thing and exits (it does **not** start the server).

#### `setup` — seed admin credentials and optional ACME config

```bash
coraza-waf-mod setup --db waf.db --admin-email you@example.com \
  [--domain example.com] [--acme-email contact@example.com]
# Password is read from stdin (one line).
```

- **Idempotent for credentials:** if an admin already exists, the credential step is skipped — safe
  to re‑run on upgrade without overwriting a changed password.
- If `--domain` is given, the domain and ACME contact email are stored so Let's Encrypt can issue a
  certificate. `--acme-email` defaults to the admin email if omitted.

#### `gencert` — generate a self‑signed certificate

```bash
coraza-waf-mod gencert --cert cert.pem --key key.pem \
  --hosts 203.0.113.10,waf.internal [--days 3650]
```

- Produces a self‑signed **ECDSA P‑256** certificate with the given hostnames/IPs as SANs (so
  browsers don't complain about a hostname mismatch on IP‑based access). Pure Go — no openssl.

#### `prune` — delete old request logs

```bash
coraza-waf-mod prune --db waf.db --retention 30
```

- Opens the DB, deletes request rows older than the retention window **in batches** (with short
  pauses between batches so SQLite's single write lock isn't held for the whole delete), and exits.
- `--retention 0` or negative disables pruning. Intended to be run by cron or the bundled systemd
  timer, never inside the live server process.

#### `version`

```bash
coraza-waf-mod version        # or: coraza-waf-mod --version
```

---

## 6. First Run & Initial Setup

If you used the **installer (Option A)**, your admin account already exists (you typed it during
install) and the service is running — skip to [Using the Dashboard](#7-using-the-dashboard).

For a **manual / source install**:

1. **Create the first admin account:**
   ```bash
   printf 'your-strong-password\n' | ./coraza-waf-mod setup \
     --db ./waf.db --admin-email you@example.com
   ```
   > If you start the server **without** running `setup`, a development fallback admin
   > (`admin@localhost` / `admin123`) is seeded and printed in the logs. **Do not rely on this in
   > production** — always run `setup` to create real credentials and change the default.
2. **Start the server:**
   ```bash
   ./coraza-waf-mod --db ./waf.db --listen :8080
   ```
3. **Open the dashboard** at `http://<host>:8080/admin` and log in.
4. **Add your first backend** under **Services** (see below).

---

## 7. Using the Dashboard

The dashboard lives at `/admin` and is behind session‑cookie login. Every change below applies
**live** — no restarts. Each page is HTMX‑driven, so adding/removing a row swaps just that part of
the page. This section walks through **every feature and exactly how to use it**, including the
underlying HTTP routes (handy if you want to script against them).

> **How "implement" works here.** You don't edit files or restart anything to use a feature. Each
> dashboard form maps to a route that writes the change to `waf.db` and then **hot‑reloads** the
> relevant subsystem (registry, blocklist, geo, WAF engine, rate limiter). The steps below are the
> implementation.

### 7.1 Services (backend apps) — *what gets proxied*

**Page:** `/admin/services` · **Purpose:** define which backend each incoming request is routed to.

**Add a service:**

1. Go to **Services → Add**. The add form is a short wizard.
2. Fill in:
   - **Name** — a label for the service (e.g. `api`).
   - **Match type** — `host` (virtual hosting by `Host` header) or `prefix` (route by URL path
     prefix).
   - **Match value** — the host (`api.example.com`) or the prefix (`/api`).
   - **Backend** — the upstream URL, e.g. `http://127.0.0.1:8080`.
   - **(Optional) Rate limit** — requests/second (`rps`) and `burst` for this service alone. Leave
     `0` to inherit the global limiter only.
3. Click **Add**. Before saving, the server **validates** the backend URL and runs a **one‑shot
   reachability probe** — if the backend is unreachable, the save is rejected with an inline error
   ("fix the backend or try again before adding"). This prevents adding dead upstreams.
4. On success the routing registry is rebuilt instantly and the new row appears.

**Behavior to know:**
- **Prefix routing strips the prefix** before proxying (so `/api/users` → backend `/users`), like
  nginx `proxy_pass http://backend/`. The original path is restored for logging.
- **Longest prefix wins**, and all prefix matches are checked before host matches.
- **Per‑service TLS requires a host‑matched service.** Prefix services can't have their own
  certificate (there's no SNI host to key it on) — the TLS panel will say so.

**Edit / manage a service:** use the **Manage** controls on a row to set per‑service TLS
(below), per‑service **bot mode** (`POST /admin/services/bot/:id` with `bot_mode` =
`inherit`/`always`/`off`), and per‑service **rate limit**
(`POST /admin/services/ratelimit` with `service_id`, `rps`, `burst`).

**Delete a service:** the trash control issues `DELETE /admin/services/:id` and rebuilds the
registry.

**Routes:** `GET /services`, `POST /services` (add), `DELETE /services/:id`,
`POST /services/ratelimit`, `POST /services/bot/:id`, plus the TLS routes in 7.3.

### 7.2 Blocks — IP rules & geo/country rules

There are two independent block lists, both enforced **early** in the pipeline and both hot‑reloaded
on change.

#### 7.2.1 IP rules

**Page:** `/admin/ip-rules` · **Purpose:** manually allow or block a single IP or CIDR range.

1. Go to **IP Rules**.
2. Enter:
   - **IP / CIDR** — accepts a single IPv4/IPv6 address (`1.2.3.4`, `::1`) **or** a CIDR
     (`10.0.0.0/8`). Anything else is rejected with a format hint.
   - **Rule type** — `block` or `allow`.
   - **(Optional) App/scope** — leave empty for a global rule, or scope it to a named app.
3. Submit. The rule is written and the in‑memory IP blocklist reloads immediately, so the next
   request from that IP is affected.
4. **Remove** a rule with the row's delete control (`DELETE /admin/ip-rules/:id`).

These manual rules are evaluated alongside the IPs pulled in automatically by
[threat‑intel sync](#29-threat-intel-auto-sync).

**Routes:** `GET /ip-rules`, `POST /ip-rules` (`app_name`, `ip`, `rule_type`),
`DELETE /ip-rules/:id`.

#### 7.2.2 Geo / country rules

**Page:** `/admin/geo-rules` · **Purpose:** block or allow whole countries.

1. Go to **Geo Rules**.
2. Enter a **2‑letter ISO country code** (e.g. `RU`, `CN`, `US` — case‑insensitive) and a rule type
   (`block`/`allow`), optionally scoped to an app.
3. Submit. The geo blocker reloads instantly. Country is determined from the
   [resolved real client IP](#216-trusted-proxy--real-client-ip) using the bundled GeoLite2
   database, so it works correctly behind Cloudflare / a trusted proxy.
4. **Remove** with the row's delete control (`DELETE /admin/geo-rules/:id`).

**Routes:** `GET /geo-rules`, `POST /geo-rules` (`app_name`, `country_code`, `rule_type`),
`DELETE /geo-rules/:id`.

> **WAF rule blocks (related).** The **WAF Rules** page (`/admin/waf-rules`) lists CRS rules and lets
> you **disable** a noisy rule by ID with a reason (`POST /admin/waf-rules/disable` with `rule_id`,
> `reason`) and re‑enable it (`DELETE /admin/waf-rules/:id`). The WAF engine rebuilds itself from the
> current disabled‑rule list, so the change is live.

### 7.3 Certificates & per‑service TLS

There are two related surfaces: a reusable **certificate pool**, and **per‑service TLS** assignment.

#### 7.3.1 Certificate pool

**Page:** `/admin/certificates` · **Purpose:** store named cert/key pairs you can reuse across
services.

1. Go to **Certificates → Add**.
2. Enter:
   - **Name** — a label (e.g. `wildcard-example-com`).
   - **Certificate (PEM)** — paste the full certificate chain.
   - **Private key (PEM)** — paste the matching key.
3. Submit. The certificate is parsed/validated; the **private key is written to disk at mode
   `0600`** (never stored in the database), and the cert appears in the pool with its expiry.
4. **Delete** a cert with its delete control (`DELETE /admin/certificates/:id`).

**Routes:** `GET /certificates`, `POST /certificates` (`name`, `cert_pem`, `key_pem`),
`DELETE /certificates/:id`.

#### 7.3.2 Assigning TLS to a service

Open a **host‑matched** service's **Manage → TLS** panel. You have three options (all require a
host‑matched service — prefix services are rejected):

- **Upload a custom cert** — paste `cert_pem` + `key_pem` for this service only
  (`POST /admin/services/tls/upload`). Stored on disk under `certs/services/<name>/`.
- **Assign a pool certificate** — pick one of your saved certificates from 7.3.1
  (`POST /admin/services/tls/pool` with `cert_id`).
- **Enable auto‑issue (ACME)** — Let's Encrypt provisions a cert for the service's host on first
  request (`POST /admin/services/tls/auto`). **Requires an ACME email to be set first** (see
  Settings → 7.5); without it the action does nothing.
- **Clear TLS** — remove per‑service TLS and fall back to the global cert
  (`POST /admin/services/tls/clear`).

At handshake time certificates resolve by SNI: **per‑service custom → per‑service/pool/legacy
autocert → global fallback.** See [TLS Setup In Depth](#8-tls-setup-in-depth) for the full picture
including self‑signed and global ACME.

### 7.4 Request logs

**Page:** `/admin/logs` · **Purpose:** see, filter, export, and live‑tail every request decision.

**Live tail.** With **no filters set, on page 1**, new rows stream in over Server‑Sent Events
(`/admin/logs/stream`) — you watch traffic in real time. Applying any filter switches to paged
history queried directly from SQLite (so you can page deep without the stream interfering). You can
force history mode with `?mode=history`.

**Filtering.** Use the filter controls; they map to query parameters on `GET /admin/logs`:

| Filter | Param | Example |
|---|---|---|
| App / service | `app` | `api` |
| Status class | `status` | `2xx`, `4xx`, `5xx` |
| From (datetime) | `from` | `2026-06-01T09:00` |
| To (datetime) | `to` | `2026-06-29T17:30` |
| Page | `page` | `2` |

(`from`/`to` use the HTML `datetime-local` format `YYYY-MM-DDTHH:MM`.)

**Detail view.** Click a row to open `GET /admin/logs/:id` — full request headers, the matched WAF
rule (if any), the block reason/stage, status, and the resolved country/ASN.

**Export.** The **Export** button hits `GET /admin/logs/export` with the *same* filter query params
and downloads a CSV of the matching rows — so you can export exactly what you've filtered to.

**Retention.** Logs are pruned by the separate `prune` command / systemd timer, not from this page
(see [Log Retention & Pruning](#10-log-retention--pruning)).

**Routes:** `GET /logs`, `GET /logs/stream` (SSE), `GET /logs/:id`, `GET /logs/export`.

### 7.5 Settings

**Page:** `/admin/settings` · **Purpose:** admin account, security subsystems, and integrations.

**Change admin credentials.** Enter your **current password**, then a **new email** and/or **new
password** (typed twice). Submitting (`POST /admin/settings/credentials` with `current_password`,
`new_email`, `new_password`, `confirm_password`) re‑hashes the password with bcrypt and invalidates
old sessions. Do this immediately if you started from the dev fallback (`admin@localhost` /
`admin123`).

**Bot protection.** Toggle the global challenger and tune it
(`POST /admin/settings/bot` with `bot_enabled=1`, `bot_threshold`, `bot_ttl`):
- **Enabled** — turn the JS proof‑of‑work challenge on/off globally.
- **Threshold** — the anomaly score above which a client is challenged.
- **TTL** — how long a solved bypass cookie stays valid (seconds).
Per‑service overrides (`inherit`/`always`/`off`) are set from each service's Manage panel (7.1).

**Rate limiting backend.** Choose the backend and (for Redis) its connection
(`POST /admin/settings/ratelimit` with `rl_backend` = `memory`/`redis`, `rl_redis_addr`,
`rl_redis_password`). Use **Test connection** (`POST /admin/settings/ratelimit/test`) to verify
Redis reachability **before** saving. Switching backends is a hot reload — in‑process state persists
to SQLite; Redis is shared across nodes and fails open if unreachable.

**ACME email.** Set the Let's Encrypt contact email
(`POST /admin/settings/acme-email` with `email`). This must be set before per‑service auto‑issue
(7.3.2) or global ACME will work.

**Webhooks.** Configure event delivery
(`POST /admin/settings/webhook` with `webhook_url`, `webhook_secret`, `webhook_enabled=1`, and one
or more `webhook_events` checkboxes). If no events are selected it defaults to `blocked`. Delivery
is asynchronous and signed with the secret; a slow endpoint never blocks logging.

**Threat‑intel sources.** On **Threat Intel** (`/admin/threat-intel`): add a source with a **label**,
a **URL** to a plain‑text IP/CIDR list, and a sync **interval (hours)**
(`POST /admin/threat-intel`). Each row can be **toggled** on/off
(`POST /admin/threat-intel/:id/toggle`), **synced now** (`POST /admin/threat-intel/:id/sync`), or
**deleted** (`DELETE /admin/threat-intel/:id`). Synced IPs flow into the IP blocklist automatically.

**Database backup.** `GET /admin/settings/backup` downloads a copy of the entire `waf.db`. Treat the
download as sensitive — it contains the bcrypt admin hash and challenge secret. Store it securely.

### 7.6 Dashboard home, notifications & metrics

- **Home** (`/admin`) shows live traffic and threat charts (`/admin/api/traffic`,
  `/admin/api/threats`) and an at‑a‑glance summary.
- **Notifications** stream in over SSE (`/admin/api/notifications/stream`); mark them seen with the
  bell control.
- **Metrics** at `/admin/metrics` serve Prometheus exposition format (same admin auth) — point your
  Prometheus scrape config at it with basic‑auth credentials.

---

## 8. TLS Setup In Depth

There are three ways to serve HTTPS, and they can be combined per service.

**1. Self‑signed (IP‑based deployments).** Generate a cert and point the binary at it:

```bash
coraza-waf-mod gencert --cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
  --key /var/lib/coraza-waf-mod/certs/self-signed.key --hosts 203.0.113.10
# then run with:
--listen :80 --listen-tls :443 \
--tls-cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
--tls-key  /var/lib/coraza-waf-mod/certs/self-signed.key
```

Browsers will warn on a self‑signed cert; add an exception, or move to ACME once you have a domain.

**2. Automatic Let's Encrypt (ACME).** Store a domain + contact email (the installer does this when
you enter a domain; manually it's `setup --domain … --acme-email …`), then run with `--listen :80`
(for the ACME HTTP‑01 challenge + redirect) and `--listen-tls :443`. The certificate is provisioned
on the first HTTPS request and cached under `--certs`. **DNS for the domain must point at the server
before the first request.**

**3. Per‑service certificates.** From a service's **Manage** panel, upload a custom cert/key or
enable per‑service auto‑issue. Certificates are resolved by SNI at handshake time:
**per‑service custom → per‑service/legacy autocert → global fallback.** Uploaded private keys are
stored on disk (`certs/services/<name>/`, mode `0600`), never in the database.

---

## 9. Rate Limiting In Depth

**In‑process limiter (default).** A per‑IP token bucket lives in memory; its state is snapshotted to
SQLite **every 10 seconds** and restored on startup, so limits survive restarts. Idle buckets are
reclaimed by a background janitor. This is the right choice for a single node.

**Redis backend (multi‑node).** Select Redis in the dashboard and provide the address + password.
The limiter becomes an atomic Redis Lua‑script token bucket shared across all WAF instances, so a
cluster enforces one combined limit. If Redis becomes unreachable, the backend **fails open** (it
allows traffic rather than blocking everything).

**Per‑service limits.** Each service can carry its own limiter (always in‑process — per‑service
distribution isn't needed). These run after the global limit.

**Ordering.** Global rate limiting runs **early** in the pipeline (after the IP blocklist, before
geo and WAF), so throttled clients are rejected cheaply.

---

## 10. Log Retention & Pruning

Request logs accumulate in SQLite. Pruning is **not** automatic inside the running server; it is a
separate one‑shot command so a multi‑second delete never shares the live process's DB connection
pool with request traffic.

Run it from cron or the bundled systemd timer:

```bash
coraza-waf-mod prune --db /var/lib/coraza-waf-mod/waf.db --retention 30
```

The installer sets up `coraza-waf-mod-prune.service` + `.timer` to run every 15 days automatically.
Deletes happen in batches (2000 rows) with short pauses, so SQLite's single write lock isn't held
for the entire operation.

---

## 11. Running as a systemd Service

The installer writes `/etc/systemd/system/coraza-waf-mod.service` similar to:

```ini
[Unit]
Description=Coraza WAF Mod (WAF + reverse proxy)
After=network.target

[Service]
Type=simple
User=coraza-waf-mod
Group=coraza-waf-mod
WorkingDirectory=/var/lib/coraza-waf-mod
ExecStart=/usr/local/bin/coraza-waf-mod --listen :80 --listen-tls :443 \
  --db /var/lib/coraza-waf-mod/waf.db --certs /var/lib/coraza-waf-mod/certs --retention 30
Restart=on-failure
RestartSec=5s

# Bind :80/:443 without running as root
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
ProtectSystem=full
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Common operations:

```bash
sudo systemctl status coraza-waf-mod        # status
sudo systemctl restart coraza-waf-mod       # restart (e.g. after changing flags)
sudo journalctl -u coraza-waf-mod -f        # follow logs
sudo systemctl list-timers | grep coraza    # see the prune timer
```

To change flags (listen addresses, trusted proxies, retention), edit the `ExecStart` line, then
`sudo systemctl daemon-reload && sudo systemctl restart coraza-waf-mod`.

---

## 12. Upgrading

Re‑run the installer — it is upgrade‑aware:

```bash
curl -fsSL -o install.sh \
  https://gitlab.com/sinhaparth5/coraza-waf-mod/-/raw/main/deploy/install.sh
sudo bash install.sh
```

On an existing install it downloads + verifies the new binary, replaces it, and restarts the
service. **Admin credentials and certificates are never overwritten on upgrade** (the `setup` step
is idempotent for credentials). Pin a version with `sudo CORAZA_VERSION=v1.2.3 bash install.sh`.

For source installs, `git pull && make build`, then restart the service/process.

---

## 13. Architecture Deep Dive

**Request pipeline** (single `Handle` method), in strict order:

1. **Bot challenge gate** — non‑trusted clients without a valid bypass cookie are redirected to the
   JS proof‑of‑work challenge (subject to global + per‑service bot mode).
2. **IP blocklist check** — exact‑match block rejects.
3. **Global rate limit** — per‑IP token bucket.
4. **Per‑service rate limit** — optional, after routing.
5. **Geo blocklist check** — country block by resolved client IP.
6. **Coraza WAF inspection** — full CRS + custom rules.
7. **Reverse‑proxy** to the matched backend.

Every stage logs the outcome via a **non‑blocking queue** (buffered channel drained by one worker
goroutine), so the hot path never waits on the database. Every response — blocked or proxied — gets
its `Server` header forced to `Coraza WAF Mod` and the standard security headers applied.

**State & storage.** Everything lives in one SQLite file via the pure‑Go `modernc.org/sqlite`
driver. WAL mode plus a bounded connection pool lets readers run concurrently with the single
serialized writer. Services, rules, TLS state, sessions, rate‑limit snapshots, and settings are all
DB‑backed. Uploaded TLS private keys are the one exception — those live on disk at mode `0600`.

**Hot reload.** The WAF engine, bot challenger, rate‑limit backend, IP blocklist, and service
registry are all swapped behind read/write mutexes, so dashboard changes apply with no restart.

**Bundled data.** The GeoLite2‑Country and DB‑IP ASN Lite databases, the OWASP CRS, and the minified
dashboard JS are all `//go:embed`‑ed into the binary — there is nothing external to fetch at
runtime.

---

## 14. Building & Releasing

```bash
make build       # go generate (minify JS) + go build → ./coraza-waf-mod
make run         # build + run
make test        # go test ./...
make clean       # remove binary, minified JS, dist/
make dist        # cross-compile linux/amd64 + linux/arm64 + windows/amd64 (CGO_ENABLED=0)
make checksums   # sha256sum dist/* → dist/checksums.txt
make tag VERSION=v1.0.0   # annotated git tag + push (triggers the GitLab release pipeline)
```

Run a single package's tests: `go test ./proxy/ -run TestName -v`.

---

## 15. Troubleshooting

**Dashboard shows a certificate warning.** Expected with a self‑signed cert — add a browser
exception, or configure a domain + ACME from **Settings → TLS** to get a trusted Let's Encrypt cert.

**ACME certificate isn't issued.** Ensure DNS for your domain points at the server, that ports 80
and 443 are reachable from the internet, and that you started the binary with both `--listen :80`
(for the HTTP‑01 challenge) and `--listen-tls :443`.

**All clients share one IP / rate limiting blocks everyone.** You're likely behind a proxy or load
balancer but haven't set `--trusted-proxies`, so the real client IP isn't being read from
`X-Forwarded-For`. Add the proxy's CIDR to `--trusted-proxies`. Conversely, if you set
`--trusted-proxies` too broadly while directly internet‑facing, clients could spoof their IP — only
list CIDRs you actually trust.

**WAF detects but doesn't block.** Make sure you're on a normal build (blocking is enabled after the
CRS includes by design). Check whether the specific rule was disabled from the dashboard.

**A backend can't be added.** The add wizard probes the backend first; if it's unreachable from the
WAF host, the save is rejected. Verify the backend URL and network path.

**Service won't start under systemd.** `sudo journalctl -u coraza-waf-mod -e` for the error.
Common causes: port already in use, missing `CAP_NET_BIND_SERVICE` (binding 80/443), or a bad
`--db`/`--certs` path the service user can't write.

**Logs growing too large.** Confirm the prune timer is active (`systemctl list-timers | grep
coraza`) or add a cron job calling `coraza-waf-mod prune`.

---

## 16. FAQ

**Do I need Docker?** No. A `Dockerfile` and `docker-compose.yml` exist for container‑based local
development, but the primary distribution is a native binary + systemd.

**Do I need a database server?** No. All state is in a single SQLite file. Redis is optional and only
for multi‑node rate limiting.

**Do I need a MaxMind account for geo blocking?** No. A GeoLite2‑Country database is bundled. You can
optionally override it with a freshly downloaded `.mmdb` via `--geo-db`.

**Is there a config file?** Not for the running server — it's configured by CLI flags plus the
dashboard/database. (Older docs referencing `config.yaml` predate the move to flags.)

**Can I run multiple instances?** Yes, behind a load balancer. Use the **Redis** rate‑limit backend
so the instances share one rate‑limit view, and set `--trusted-proxies` to the load balancer's CIDR.

**Where does it store data?** The SQLite DB at `--db` (installer: `/var/lib/coraza-waf-mod/waf.db`)
and TLS files under `--certs` (installer: `/var/lib/coraza-waf-mod/certs`).

**How do I reset the admin password?** Re‑run `coraza-waf-mod setup` is idempotent and won't
overwrite an existing password; change it from **Settings** in the dashboard instead. (If locked
out, credentials live in the `waf.db` meta table.)
