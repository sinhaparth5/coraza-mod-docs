import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// ── Icons ──────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L3 7v5.09c0 4.95 3.39 9.57 9 10.91 5.61-1.34 9-5.96 9-10.91V7l-9-5z"
        fill="currentColor"
      />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MetricsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

type FeatureItem = {
  title: string;
  description: string;
  Icon: () => ReactNode;
};

const FEATURES: FeatureItem[] = [
  {
    title: 'WAF Protection',
    description:
      'Coraza v3 with OWASP Core Rule Set blocks SQLi, XSS, RCE, path traversal, and scanner agents out of the box.',
    Icon: ShieldIcon,
  },
  {
    title: 'Reverse Proxy',
    description:
      'Route by Host header or path prefix to any number of backends, with automatic prefix stripping like nginx.',
    Icon: RouteIcon,
  },
  {
    title: 'IP and Geo Blocking',
    description:
      'Manual IP rules plus bundled GeoIP2 country blocking. Cloudflare-aware real-IP extraction included.',
    Icon: GlobeIcon,
  },
  {
    title: 'TLS Built In',
    description:
      "Automatic Let's Encrypt or custom cert per service. Upload a cert from the dashboard, no restart needed.",
    Icon: LockIcon,
  },
  {
    title: 'Admin Dashboard',
    description:
      'Live traffic charts, filterable request logs, and service management via HTMX UI. All changes apply instantly.',
    Icon: DashboardIcon,
  },
  {
    title: 'Prometheus Metrics',
    description:
      'Block counters by cause (IP, geo, WAF, bot, rate limit), request volume, and Go runtime metrics ready to scrape.',
    Icon: MetricsIcon,
  },
];

const STATS = [
  {value: '1', unit: 'binary', label: 'No runtime deps, deploy anywhere'},
  {value: '0', unit: 'CGO', label: 'Pure Go, cross-compiles to any target'},
  {value: '1', unit: 'SQLite file', label: 'All state in one portable file'},
  {value: '30+', unit: 'attack types', label: 'Blocked by embedded OWASP CRS'},
];

// ── Sections ───────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Decorative curve */}
      <svg
        className={styles.heroCurve}
        width="1440"
        height="425"
        viewBox="0 0 1440 425"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M122.412 240.398C24.9415 266.962 -0.894173 346.818 69.4281 386.974C139.75 427.13 151.05 357.564 19.6304 199.58C-66.0316 114.45 -63.3987 -66.5793 151.05 28.2893C419.11 146.875 963.934 215.266 1086.65 121.778C1184.82 46.987 1295.82 90.6148 1339.04 121.778C1390.03 158.535 1436 274.245 1280.73 377.145C1086.65 505.769 1083.17 328.832 1255.49 301.225C1393.35 279.139 1467.27 325.904 1487 352.047"
          stroke="#9FE0B7"
          strokeWidth="3"
        />
      </svg>

      <div className={styles.heroContent}>
        <span className={styles.heroEyebrow}>Open Source WAF</span>
        <Heading as="h1" className={styles.heroTitle}>
          Production-grade WAF<br />in a single binary
        </Heading>
        <p className={styles.heroSubtitle}>
          Coraza v3, OWASP CRS, reverse proxy, and admin dashboard in one Go binary. No Docker, no external database.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.btnPrimary} to="/docs/intro">
            Read the docs
          </Link>
          <Link className={styles.btnSecondary} to="https://gitlab.com/sinhaparth5/coraza-waf-mod">
            View on GitLab
          </Link>
        </div>
      </div>

      <div className={styles.heroBrowserWrap}>
        <img
          src="/img/hero_image.png"
          alt="Coraza WAF Mod admin dashboard"
          className={styles.heroImage}
        />
      </div>

      {/* Wave transition to white */}
      <svg
        className={styles.heroWave}
        viewBox="0 0 1440 454"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M108 268C30 268 0 224.748 0 224.748V454H1440V0C1419.18 153.169 1325.92 242.767 1158.43 242.767C1024.43 242.767 925.143 177.028 892.248 144.159C878.516 178.029 824.435 245.17 717.963 242.767C611.491 240.365 244.936 235.368 222 203.5C210.985 243.544 162.5 268 108 268Z"
          fill="white"
        />
      </svg>
    </section>
  );
}

function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.unit} className={styles.statItem}>
            <div className={styles.statValue}>
              {s.value}
              <span className={styles.statUnit}> {s.unit}</span>
            </div>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need. Nothing you don't.
          </Heading>
          <p className={styles.sectionSubtitle}>
            One binary ships with every security layer pre-configured. Add a backend, block traffic, and move on.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map(({title, description, Icon}) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Icon />
              </div>
              <Heading as="h3" className={styles.featureTitle}>
                {title}
              </Heading>
              <p className={styles.featureDesc}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className={styles.architecture}>
      <div className={styles.sectionInner}>
        <div className={styles.archHeader}>
          <Heading as="h2" className={styles.archTitle}>
            Built for the request path
          </Heading>
          <p className={styles.archDesc}>
            Every request passes through a strict pipeline before reaching any backend. Each stage
            logs asynchronously to a buffered SQLite queue, so the hot path is never blocked.
          </p>
          <ul className={styles.archList}>
            <li>Bot challenge gate with JS proof-of-work</li>
            <li>IP blocklist and token-bucket rate limiting</li>
            <li>GeoIP2 country check against bundled database</li>
            <li>Coraza WAF inspection with OWASP CRS 4.x</li>
            <li>Reverse proxy with prefix strip or host routing</li>
          </ul>
        </div>
        <img
          src="/img/arch_diagram.png"
          alt="Coraza WAF Mod request pipeline: Client → Bot Gate → IP Blocklist → Rate Limiting → Geo Blocking → WAF Inspection → Reverse Proxy → Backend Applications"
          className={styles.archImage}
        />
      </div>
    </section>
  );
}

function InstallSection() {
  return (
    <section className={styles.install}>
      <div className={styles.sectionInner}>
        <div className={styles.installInner}>
          <Heading as="h2" className={styles.sectionTitle}>
            Up and running in minutes
          </Heading>
          <p className={styles.sectionSubtitle}>
            The installer detects your architecture, verifies the SHA-256 checksum, creates a
            dedicated non-root system user with <code>CAP_NET_BIND_SERVICE</code>, and registers
            three systemd units (service + log-prune timer).
          </p>
          <div className={styles.codeBlock}>
            <div>
              <span className={styles.codePrompt}>$</span>
              {' curl -fsSL -o install.sh \\'}
            </div>
            <div>
              {'    https://gitlab.com/sinhaparth5/coraza-waf-mod/-/raw/main/deploy/install.sh'}
            </div>
            <div>
              <span className={styles.codePrompt}>$</span>
              {' sudo bash install.sh'}
            </div>
          </div>
          <p className={styles.installNote}>
            Or build from source: <code>git clone</code> the repo and run <code>make build</code>.
            Requires Go 1.25+, no CGO.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  return (
    <Layout
      title="Production-grade WAF in a single binary"
      description="Coraza WAF Mod - OWASP CRS protection, reverse proxy, and admin dashboard in one Go binary. No Docker, no external database."
    >
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ArchitectureSection />
      <InstallSection />
    </Layout>
  );
}
