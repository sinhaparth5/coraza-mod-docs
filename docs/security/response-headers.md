---
sidebar_position: 6
title: Security Response Headers
description: Browser-hardening headers applied to every response, plus the forced Server header.
---

# Security Response Headers

A global middleware sets browser-hardening headers on **every** response (blocked, admin, and
proxied alike):

- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- **HSTS** on TLS connections
- `X-Protected-By` / `X-WAF-Engine` identification headers

The `Server` header on every response is forced to `Coraza WAF Mod`, overwriting whatever the
backend sent.
