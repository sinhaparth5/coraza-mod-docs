---
sidebar_position: 4
title: Threat Intel & Webhooks
description: Auto-sync external IP blocklists into the blocklist, and forward request events to a webhook asynchronously.
---

# Threat Intel & Webhooks

## Threat-intel auto-sync

- A background worker periodically downloads external **plain-text IP block lists**, parses out
  IP/CIDR tokens (ignoring `#`/`;` comments, capped at a 10 MiB read), and writes them into the
  database.
- The IP blocklist reads from the same store, so synced IPs take effect **immediately via hot
  reload** — no restart.
- A **"sync now"** button in the dashboard fetches a single source on demand.

Add a source on the **Threat Intel** page (`/admin/threat-intel`) with a **label**, a **URL** to a
plain-text IP/CIDR list, and a sync **interval (hours)**. Each row can be toggled, synced now, or
deleted. See the [dashboard walkthrough](/docs/configuration/dashboard).

## Webhook event delivery

- Forwards request events to a configured webhook endpoint, **fully asynchronously** so a slow or
  unreachable webhook never blocks the logging pipeline.
- Delivery is filtered by a configurable, comma-separated **event list** (managed from the
  dashboard). If no events are selected it defaults to `blocked`.
- Deliveries are **signed with a secret** so the receiver can verify authenticity.

Configure it under **Settings → Webhooks** (`webhook_url`, `webhook_secret`, `webhook_enabled`, and
one or more event checkboxes).
