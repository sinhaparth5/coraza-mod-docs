---
sidebar_position: 1
title: WAF Inspection
description: Coraza v3 with the OWASP Core Rule Set compiled in — what it blocks, custom rules, and disabling noisy rules.
---

# WAF Inspection (Coraza + OWASP CRS)

- Embeds **Coraza v3** with the **OWASP Core Rule Set (CRS)** compiled directly into the binary —
  there is nothing to download or mount.
- Out of the box it detects and blocks common attack classes: **SQL injection, XSS, remote code
  execution, path traversal, restricted-file access**, and **known scanner user agents**.
- Custom `.conf` rule files can be layered **on top of** the CRS by pointing the `--waf-rules` flag
  at a directory.
- WAF rules can be **individually disabled** from the dashboard (the engine reads the disabled-rule
  list from the database and rebuilds itself live), so you can silence a noisy rule without editing
  files or restarting.

:::warning Important engine behavior
The recommended Coraza config ships in `DetectionOnly` mode by default, and the project deliberately
enables blocking (`SecRuleEngine On`) **after** the CRS includes so that rules actually block rather
than merely score. This is handled internally.
:::

## Disabling a noisy rule

<div style={{margin: '1.5rem 0'}}>
  <img
    src="/img/docs/docs_waf_rules.png"
    alt="WAF Rules page showing the Disable Rule form with CRS Rule ID and reason fields, Top Firing Rules analytics table with hit counts, and the Disabled Rules list"
    style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid #e2e5ea'}}
  />
</div>

The **WAF Rules** page (`/admin/waf-rules`) lists CRS rules. Disable a rule by ID with a reason
(`POST /admin/waf-rules/disable` with `rule_id`, `reason`) and re-enable it
(`DELETE /admin/waf-rules/:id`). The WAF engine rebuilds itself from the current disabled-rule list,
so the change is live — no restart. See the [dashboard walkthrough](/docs/configuration/dashboard).

## WAF detects but doesn't block?

Make sure you're on a normal build (blocking is enabled after the CRS includes by design), and check
whether the specific rule was disabled from the dashboard.
