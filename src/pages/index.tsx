import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// ── Icons ──────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 7v5.09c0 4.95 3.39 9.57 9 10.91 5.61-1.34 9-5.96 9-10.91V7l-9-5z" fill="currentColor" />
    </svg>
  );
}
function RouteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" />
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
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Decorative green shape clusters ────────────────────────────────────────
// Same pill+circle morphology as Shape.png, green palette instead of lavender.

// Dashboard — top-left: two circles stacked
function DashShapesTopLeft() {
  return (
    <svg width="220" height="360" viewBox="0 0 220 360" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dtl_g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e6f9ef" /><stop offset="1" stopColor="#9ed9b8" />
        </linearGradient>
        <linearGradient id="dtl_g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#d0f0e0" /><stop offset="1" stopColor="#76c893" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="95" r="88" fill="url(#dtl_g1)" />
      <circle cx="110" cy="275" r="78" fill="url(#dtl_g2)" />
    </svg>
  );
}

// Dashboard — right-center: tall pill + circle below
function DashShapesRightCenter() {
  return (
    <svg width="180" height="430" viewBox="0 0 180 430" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="drc_g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#d6f5e5" /><stop offset="1" stopColor="#5ab88a" />
        </linearGradient>
        <linearGradient id="drc_g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#c8f0da" /><stop offset="1" stopColor="#76c893" />
        </linearGradient>
      </defs>
      <rect x="25" y="0" width="130" height="260" rx="65" fill="url(#drc_g1)" />
      <circle cx="90" cy="355" r="62" fill="url(#drc_g2)" />
    </svg>
  );
}

// Features — bottom-right: pill + two circles
function FeatShapesBottomRight() {
  return (
    <svg width="300" height="320" viewBox="0 0 300 320" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fbr_g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e6f9ef" /><stop offset="1" stopColor="#9ed9b8" />
        </linearGradient>
        <linearGradient id="fbr_g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#d0f0e0" /><stop offset="1" stopColor="#76c893" />
        </linearGradient>
        <linearGradient id="fbr_g3" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#bde8d0" /><stop offset="1" stopColor="#4aad72" />
        </linearGradient>
      </defs>
      {/* Tall pill — right side */}
      <rect x="165" y="30" width="115" height="290" rx="57" fill="url(#fbr_g1)" />
      {/* Circle — left-top */}
      <circle cx="72" cy="72" r="66" fill="url(#fbr_g2)" />
      {/* Circle — left-bottom */}
      <circle cx="72" cy="240" r="58" fill="url(#fbr_g3)" />
    </svg>
  );
}

// Architecture — bottom-left: three circles stepping down
function ArchShapesBottomLeft() {
  return (
    <svg width="310" height="290" viewBox="0 0 310 290" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="abl_g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#76c893" stopOpacity="0.45" /><stop offset="1" stopColor="#2d8f5a" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="abl_g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#4aad72" stopOpacity="0.38" /><stop offset="1" stopColor="#1f6644" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="abl_g3" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#9ed9b8" stopOpacity="0.32" /><stop offset="1" stopColor="#3a9d6e" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <circle cx="65" cy="65" r="62" fill="url(#abl_g3)" />
      <circle cx="175" cy="148" r="70" fill="url(#abl_g1)" />
      <circle cx="65" cy="238" r="52" fill="url(#abl_g2)" />
    </svg>
  );
}

// Install — top-right: circle pair + tall pill
function InstallShapesTopRight() {
  return (
    <svg width="290" height="360" viewBox="0 0 290 360" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="itr_g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#9ed9b8" stopOpacity="0.32" /><stop offset="1" stopColor="#3a9d6e" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="itr_g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#76c893" stopOpacity="0.4" /><stop offset="1" stopColor="#2d8f5a" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="itr_g3" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#4aad72" stopOpacity="0.3" /><stop offset="1" stopColor="#1a5c38" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Circle top-left */}
      <circle cx="70" cy="70" r="65" fill="url(#itr_g1)" />
      {/* Circle top-right */}
      <circle cx="210" cy="80" r="58" fill="url(#itr_g2)" />
      {/* Tall pill bottom */}
      <rect x="110" y="160" width="110" height="200" rx="55" fill="url(#itr_g3)" />
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
    description: 'Coraza v3 with OWASP Core Rule Set blocks SQLi, XSS, RCE, path traversal, and scanner agents out of the box.',
    Icon: ShieldIcon,
  },
  {
    title: 'Reverse Proxy',
    description: 'Route by Host header or path prefix to any number of backends, with automatic prefix stripping like nginx.',
    Icon: RouteIcon,
  },
  {
    title: 'IP and Geo Blocking',
    description: 'Manual IP rules plus bundled GeoIP2 country blocking. Cloudflare-aware real-IP extraction included.',
    Icon: GlobeIcon,
  },
  {
    title: 'TLS Built In',
    description: "Automatic Let's Encrypt or custom cert per service. Upload a cert from the dashboard, no restart needed.",
    Icon: LockIcon,
  },
  {
    title: 'Admin Dashboard',
    description: 'Live traffic charts, filterable request logs, and service management via HTMX UI. All changes apply instantly.',
    Icon: DashboardIcon,
  },
  {
    title: 'Prometheus Metrics',
    description: 'Block counters by cause (IP, geo, WAF, bot, rate limit), request volume, and Go runtime metrics ready to scrape.',
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
      <img src="/img/Gradient.png" alt="" className={styles.heroBg} aria-hidden="true" />
      <img src="/img/Shape.png" alt="" className={styles.heroShape} aria-hidden="true" />
      <div className={styles.heroGrid}>
        <div className={styles.heroLeft}>
          <span className={styles.heroEyebrow}>Open Source WAF</span>
          <Heading as="h1" className={styles.heroTitle}>
            Production-grade WAF<br />in a single binary
          </Heading>
        </div>
        <div className={styles.heroRight}>
          <p className={styles.heroSubtitle}>
            Coraza v3, OWASP CRS, reverse proxy, and admin dashboard in one Go binary. No Docker, no external database.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.btnPrimary} to="/docs/intro">Read the docs</Link>
            <Link className={styles.btnSecondary} to="https://gitlab.com/sinhaparth5/coraza-waf-mod">View on GitLab</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className={styles.dashSection}>
      {/* Top-left circle stack */}
      <div className={styles.shapeTopLeft} aria-hidden="true">
        <DashShapesTopLeft />
      </div>
      {/* Right-center pill + circle */}
      <div className={styles.shapeRightCenter} aria-hidden="true">
        <DashShapesRightCenter />
      </div>
      <div className={styles.dashInner}>
        <div className={styles.dashLabel}>Admin Dashboard</div>
        <p className={styles.dashCaption}>
          Every request decision, live. Filter by status, app, or date — or watch traffic stream in real time.
        </p>
        <div className={styles.dashFrame}>
          <img
            src="/img/hero_image.png"
            alt="Coraza WAF Mod admin dashboard — live traffic charts, request log table, and threat summary"
            className={styles.dashImage}
            width={1200}
            height={700}
          />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.unit} className={styles.statItem}>
            <div className={styles.statAccent} aria-hidden="true" />
            <div className={styles.statValue}>
              {s.value}<span className={styles.statUnit}> {s.unit}</span>
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
      {/* Bottom-right pill + circle cluster */}
      <div className={styles.shapeBottomRight} aria-hidden="true">
        <FeatShapesBottomRight />
      </div>
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
              <div className={styles.featureIcon}><Icon /></div>
              <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
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
      {/* Bottom-left stepping circles (semi-transparent on dark bg) */}
      <div className={styles.shapeBottomLeft} aria-hidden="true">
        <ArchShapesBottomLeft />
      </div>
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
          width={1200}
          height={700}
          className={styles.archImage}
        />
      </div>
    </section>
  );
}

function InstallSection() {
  return (
    <section className={styles.install}>
      {/* Footer blobs — large ambient glow */}
      <div className={styles.footerBlobWrap} aria-hidden="true">
        <svg width="1096" height="1344" viewBox="0 0 1096 1344" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerBlobRightA}>
          <g filter="url(#ffbra_f)">
            <path d="M430.016 1489.2L400 1207.94C1012.17 1142.61 1479.63 803.659 1442.13 452.297L1932.17 400C1986.22 906.418 1312.34 1395.04 430.016 1489.2Z" fill="url(#ffbra_g)" />
          </g>
          <defs>
            <filter id="ffbra_f" x="-3.05176e-05" y="0" width="2335.21" height="1889.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur" />
            </filter>
            <linearGradient id="ffbra_g" x1="380.988" y1="1029.96" x2="1981.2" y2="859.185" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d4060" /><stop offset="1" stopColor="#76c893" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="1440" height="1086" viewBox="0 0 1440 1086" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerBlobLeft}>
          <g filter="url(#ffbl_f)">
            <path d="M1068.76 1199.96L1038.74 918.696C426.566 984.027 -101.892 751.362 -139.389 400L-629.43 452.297C-575.385 958.715 186.431 1294.12 1068.76 1199.96Z" fill="url(#ffbl_g)" />
          </g>
          <defs>
            <filter id="ffbl_f" x="-1029.43" y="0" width="2498.19" height="1615.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur" />
            </filter>
            <linearGradient id="ffbl_g" x1="1019.77" y1="740.705" x2="-580.443" y2="911.479" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6b0018" /><stop offset="1" stopColor="#2b5c74" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="1107" height="1317" viewBox="0 0 1107 1317" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerBlobRightB}>
          <g filter="url(#ffbrb_f)">
            <path d="M425.229 1315.41L400 1079C914.417 1024.1 1307.33 739.21 1275.82 443.956L1687.7 400C1733.13 825.645 1166.7 1236.28 425.229 1315.41Z" fill="url(#ffbrb_g)" />
          </g>
          <defs>
            <filter id="ffbrb_f" x="0" y="0" width="2090.25" height="1715.41" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur" />
            </filter>
            <linearGradient id="ffbrb_g" x1="384.026" y1="929.489" x2="1728.84" y2="785.972" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1a3d52" /><stop offset="1" stopColor="#3a9d80" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top-right circle pair + pill */}
      <div className={styles.shapeTopRight} aria-hidden="true">
        <InstallShapesTopRight />
      </div>

      <div className={styles.sectionInner}>
        <div className={styles.installInner}>
          <Heading as="h2" className={styles.installTitle}>
            Up and running in minutes
          </Heading>
          <p className={styles.installSubtitle}>
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
          <div className={styles.installCtaRow}>
            <Link className={styles.btnPrimaryDark} to="/docs/intro">Read the docs</Link>
            <Link className={styles.btnSecondaryDark} to="https://gitlab.com/sinhaparth5/coraza-waf-mod">View source</Link>
          </div>
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
      <DashboardSection />
      <StatsSection />
      <FeaturesSection />
      <ArchitectureSection />
      <InstallSection />
    </Layout>
  );
}
