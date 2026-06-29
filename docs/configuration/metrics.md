---
sidebar_position: 6
title: Prometheus Metrics
description: The Prometheus exposition endpoint and the counters, gauges, and runtime metrics it exposes.
---

# Prometheus Metrics

Coraza WAF Mod exposes a Prometheus exposition endpoint at **`/admin/metrics`** (behind the same
admin auth as the rest of the dashboard — point your Prometheus scrape config at it with the admin
credentials).

It exposes:

- **Per-cause block counters** — `IPBlockedTotal`, `GeoBlockedTotal`, `WAFBlockedTotal`,
  `RateLimitedTotal`, `BotChallengedTotal`.
- **Request volume and latency.**
- **Live gauges** for log-queue depth and service count.
- **Standard Go runtime metrics.**

For the live in-dashboard view of the same data, see the [dashboard home](/docs/configuration/dashboard)
(traffic and threat charts).
