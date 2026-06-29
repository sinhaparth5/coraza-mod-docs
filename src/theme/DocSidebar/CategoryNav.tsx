import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import styles from './CategoryNav.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

// ── Category data ─────────────────────────────────────────────────────────────

type Category = {id: string; label: string; href: string; Icon: () => React.ReactElement};

const CATEGORIES: Category[] = [
  {id: 'overview',       label: 'Overview',       href: '/docs/intro',                               Icon: HomeIcon},
  {id: 'installation',   label: 'Installation',   href: '/docs/tutorial-basics/create-a-document',  Icon: PackageIcon},
  {id: 'configuration',  label: 'Configuration',  href: '/docs/tutorial-basics/markdown-features',  Icon: GridIcon},
  {id: 'security',       label: 'Security',       href: '/docs/tutorial-basics/deploy-your-site',   Icon: ShieldIcon},
  {id: 'roadmap',        label: 'Roadmap',        href: '/roadmap',                                  Icon: MapIcon},
  {id: 'resources',      label: 'Resources',      href: '/blog',                                     Icon: BookIcon},
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SidebarCategoryNav(): React.ReactElement {
  const {pathname} = useLocation();

  function handleSearchClick() {
    const input = document.querySelector<HTMLInputElement>(
      '.navbar__search-input, [class*="searchInput"]',
    );
    input?.focus();
  }

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.searchBar}
        onClick={handleSearchClick}
        aria-label="Search documentation"
      >
        <span className={styles.searchIcon}><SearchIcon /></span>
        <span className={styles.searchLabel}>Search...</span>
        <kbd className={styles.searchKbd}>⌘K</kbd>
      </button>

      <nav className={styles.grid} aria-label="Documentation categories">
        {CATEGORIES.map(({id, label, href, Icon}) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
          return (
            <Link
              key={id}
              to={href}
              className={`${styles.item}${active ? ` ${styles.itemActive}` : ''}`}
            >
              <div className={`${styles.iconCircle}${active ? ` ${styles.iconCircleActive}` : ''}`}>
                <Icon />
              </div>
              <span className={styles.itemLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.divider} />
    </div>
  );
}
