---
sidebar_position: 4
title: Rate Limiting
description: Per-IP token-bucket limiting with an in-process or Redis backend, plus per-service limits.
---

# Rate Limiting In Depth

Coraza WAF Mod applies **per-client-IP token-bucket** limiting globally ahead of geo/WAF inspection,
plus optional **per-service** limits. There are two interchangeable backends, chosen from the
dashboard (**Settings → Rate limiting**); switching is a hot reload with no restart.

## In-process limiter (default)

A per-IP token bucket lives in memory; its state is snapshotted to SQLite **every 10 seconds** and
restored on startup, so limits survive restarts. Idle buckets are reclaimed by a background janitor.
This is the right choice for a single node.

## Redis backend (multi-node)

Select Redis in the dashboard and provide the address + password. The limiter becomes an atomic
Redis Lua-script token bucket shared across all WAF instances, so a cluster enforces one combined
limit. If Redis becomes unreachable, the backend **fails open** (it allows traffic rather than
blocking everything).

Use **Test connection** in Settings to verify Redis reachability **before** saving.

## Per-service limits

Each service can carry its own limiter (always in-process — per-service distribution isn't needed).
Set it from the service's Manage panel (`rps` + `burst`), or in the add wizard. These run after the
global limit.

## Ordering

Global rate limiting runs **early** in the pipeline (after the IP blocklist, before geo and WAF), so
throttled clients are rejected cheaply. See [Architecture](/docs/overview/architecture) for the full
pipeline order.
