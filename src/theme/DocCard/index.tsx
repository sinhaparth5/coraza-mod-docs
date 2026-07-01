import React, {type ReactNode} from 'react';
import {Icon} from '@iconify/react';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Layout from '@theme/DocCard/Layout';
import type {Props} from '@theme/DocCard';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

// ── Icon map ────────────────────────────────────────────────────────────────
// Keyed by the last path segment(s) of the doc href.

const DOC_ICONS: Record<string, string> = {
  // Overview
  'intro':                    'mdi:information-outline',
  'architecture':             'mdi:sitemap',

  // Installation
  'requirements':             'mdi:clipboard-list-outline',
  'install':                  'mdi:package-down',
  'first-run':                'mdi:play-circle-outline',
  'building':                 'mdi:hammer',
  'systemd':                  'mdi:cog-outline',
  'upgrading':                'mdi:arrow-up-circle-outline',

  // Configuration
  'dashboard':                'mdi:view-dashboard-outline',
  'cli':                      'mdi:console',
  'rate-limiting':            'mdi:speedometer',
  'tls':                      'mdi:lock-outline',
  'log-retention':            'mdi:database-clock-outline',
  'metrics':                  'mdi:chart-line',

  // Security
  'waf':                      'mdi:shield-outline',
  'blocking':                 'mdi:ip-network-outline',
  'bot-and-fingerprinting':   'mdi:robot-outline',
  'trusted-proxy':            'mdi:server-network-outline',
  'threat-intel-webhooks':    'mdi:webhook',
  'response-headers':         'mdi:web',

  // Top-level
  'faq':                      'mdi:help-circle-outline',
  'troubleshooting':          'mdi:wrench-outline',
};

const CATEGORY_ICONS: Record<string, string> = {
  'overview':       'mdi:home-outline',
  'installation':   'mdi:download-outline',
  'configuration':  'mdi:tune',
  'security':       'mdi:shield-lock-outline',
};

function iconForHref(href: string | undefined): ReactNode | null {
  if (!href) return null;
  // Strip trailing slash, grab the last segment
  const segment = href.replace(/\/$/, '').split('/').pop() ?? '';
  const iconId = DOC_ICONS[segment];
  if (iconId) {
    return <Icon icon={iconId} width={20} height={20} />;
  }
  return null;
}

function iconForCategory(label: string): ReactNode | null {
  const key = label.toLowerCase().replace(/\s+/g, '-');
  const iconId = CATEGORY_ICONS[key];
  if (iconId) {
    return <Icon icon={iconId} width={20} height={20} />;
  }
  return null;
}

function getFallbackEmojiIcon(
  item: PropSidebarItemLink | PropSidebarItemCategory,
): string {
  if (item.type === 'category') return '🗃';
  return isInternalUrl(item.href) ? '📄️' : '🔗';
}

function getIconTitleProps(
  item: PropSidebarItemLink | PropSidebarItemCategory,
): {icon: ReactNode; title: string} {
  const extracted = extractLeadingEmoji(item.label);

  // If the label starts with an explicit emoji, honour it
  if (extracted.emoji) {
    return {icon: extracted.emoji, title: extracted.rest.trim()};
  }

  // Try Iconify icons
  if (item.type === 'link') {
    const iconNode = iconForHref(item.href);
    if (iconNode) return {icon: iconNode, title: item.label};
  } else {
    const href = findFirstSidebarItemLink(item);
    const iconNode = iconForCategory(item.label) ?? iconForHref(href ?? undefined);
    if (iconNode) return {icon: iconNode, title: item.label};
  }

  // Fallback emoji
  return {icon: getFallbackEmojiIcon(item), title: item.label};
}

function CardCategory({item}: {item: PropSidebarItemCategory}): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();

  if (!href) return null;

  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      description={item.description ?? categoryItemsPlural(item.items.length)}
      {...getIconTitleProps(item)}
    />
  );
}

function CardLink({item}: {item: PropSidebarItemLink}): ReactNode {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}

export default function DocCard({item}: Props): ReactNode {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
