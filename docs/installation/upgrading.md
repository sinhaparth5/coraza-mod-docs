---
sidebar_position: 5
title: Upgrading
description: Upgrade-aware installer re-run, and the source-build upgrade path.
---

# Upgrading

Re-run the installer — it is upgrade-aware:

```bash
curl -fsSL -o install.sh \
  https://gitlab.com/sinhaparth5/coraza-waf-mod/-/raw/main/deploy/install.sh
sudo bash install.sh
```

On an existing install it downloads + verifies the new binary, replaces it, and restarts the
service. **Admin credentials and certificates are never overwritten on upgrade** (the `setup` step
is idempotent for credentials). Pin a version with `sudo CORAZA_VERSION=v1.2.3 bash install.sh`.

For source installs, `git pull && make build`, then restart the service/process.
