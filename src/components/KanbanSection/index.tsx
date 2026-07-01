import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// ── Types ───────────────────────────────────────────────────────────────────

type GitLabUser = {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
};

type GitLabIssue = {
  id: number;
  iid: number;
  title: string;
  description: string | null;
  state: 'opened' | 'closed';
  labels: string[];
  assignees: GitLabUser[];
  author: GitLabUser;
  user_notes_count: number;
  upvotes: number;
  web_url: string;
};

// ── GitLab config ────────────────────────────────────────────────────────────

const PROJECT_PATH = 'sinhaparth5%2Fcoraza-waf-mod';
const GITLAB_API   = `https://gitlab.com/api/v4/projects/${PROJECT_PATH}`;
const ISSUES_URL   = 'https://gitlab.com/sinhaparth5/coraza-waf-mod/-/issues';

// ── Helpers ─────────────────────────────────────────────────────────────────

function getLabelClass(label: string): string {
  const l = label.toLowerCase();
  if (/bug|critical|urgent|high/.test(l))        return styles.badgeRed;
  if (/feature|enhancement|important/.test(l))   return styles.badgeIndigo;
  if (/doc|low|good.first/.test(l))              return styles.badgeGreen;
  if (/ok|medium|meh|review|in.progress/.test(l)) return styles.badgeAmber;
  return styles.badgeSlate;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[#*_~\[\]]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

// ── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.375 12c0 .298-.118.584-.33.795a1.125 1.125 0 0 1-.795.33h-7.125V20.25a1.125 1.125 0 0 1-2.25 0V13.125H3.75a1.125 1.125 0 0 1 0-2.25h7.125V3.75a1.125 1.125 0 0 1 2.25 0v7.125H20.25c.298 0 .584.119.795.33.212.211.33.497.33.795z"
        fill="white"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M13.75 12.188a3.438 3.438 0 0 0-2.273.858L8.29 11a3.125 3.125 0 0 0 0-2l3.188-2.047a3.438 3.438 0 1 0-.835-1.3L7.273 7.422a3.125 3.125 0 1 0 0 5.156l3.188 2.047a3.438 3.438 0 1 0 3.289-2.438z"
        fill="white"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10.313 1.875a7.813 7.813 0 1 0 0 15.625H16.25a1.25 1.25 0 0 0 1.25-1.25V9.688a7.813 7.813 0 0 0-7.188-7.813zM6.875 10.938a.938.938 0 1 1 0-1.876.938.938 0 0 1 0 1.876zm3.438 0a.938.938 0 1 1 0-1.876.938.938 0 0 1 0 1.876zm3.437 0a.938.938 0 1 1 0-1.876.938.938 0 0 1 0 1.876z"
        fill="#94a3b8"
      />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 1.875a8.125 8.125 0 1 0 0 16.25A8.125 8.125 0 0 0 10 1.875zm3.567 6.692-4.375 4.375a.625.625 0 0 1-.884 0L6.433 11.067a.625.625 0 0 1 .884-.884L8.75 11.617l3.933-3.933a.625.625 0 0 1 .884.883z"
        fill="#94a3b8"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.53 6.53a.75.75 0 0 1-1.06 0L8 2.06 3.53 6.53A.75.75 0 0 1 2.47 5.47l5-5a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06z"
        fill="#475569"
      />
    </svg>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#4f46e5', '#76c893', '#f59e0b', '#f43f5e', '#2b5c74', '#0ea5e9'];

function AvatarStack({users}: {users: GitLabUser[]}) {
  const visible  = users.slice(0, 4);
  const overflow = users.length - visible.length;

  return (
    <div className={styles.avatarStack}>
      {visible.map((u, i) => (
        <div
          key={u.id}
          className={styles.avatar}
          style={{zIndex: visible.length - i}}
          title={u.name}
        >
          <img
            src={u.avatar_url}
            alt={u.name}
            width={900}
            height={500}
            className={styles.avatarImg}
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent) {
                parent.style.background = AVATAR_COLORS[i % AVATAR_COLORS.length];
                parent.style.color = '#fff';
                parent.style.fontSize = '0.7rem';
                parent.style.fontWeight = '700';
                parent.textContent = u.name[0]?.toUpperCase() ?? '?';
              }
            }}
          />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`${styles.avatar} ${styles.avatarOverflow}`}
          style={{zIndex: 0}}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.375rem'}}>
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
        <div className={`${styles.skeleton} ${styles.skeletonLineXShort}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{width: '55%'}} />
      </div>
      <div className={styles.skeletonFooter}>
        <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
        <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} style={{marginLeft: '-0.5rem'}} />
        <div style={{flex: 1}} />
        <div className={styles.skeleton} style={{height: '1rem', width: '3rem', borderRadius: '0.25rem'}} />
      </div>
    </div>
  );
}

function IssueCard({issue}: {issue: GitLabIssue}) {
  const rawDesc    = issue.description ?? '';
  const desc       = stripMarkdown(rawDesc).slice(0, 120);
  const displayUsers = issue.assignees.length > 0 ? issue.assignees : [issue.author];

  return (
    <a
      href={issue.web_url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <div className={styles.badges}>
          {issue.labels.length > 0 ? (
            issue.labels.map((label) => (
              <span key={label} className={`${styles.badge} ${getLabelClass(label)}`}>
                {label}
              </span>
            ))
          ) : (
            <span className={`${styles.badge} ${styles.badgeSlate}`}>Open</span>
          )}
        </div>
        <div className={styles.cardTitles}>
          <p className={styles.cardTitle}>{issue.title}</p>
          {desc && <p className={styles.cardDesc}>{desc}</p>}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <AvatarStack users={displayUsers} />
        <div className={styles.cardStats}>
          <span className={styles.stat}>
            <CommentIcon />
            <span className={styles.statNum}>{issue.user_notes_count}</span>
          </span>
          <span className={styles.stat}>
            <ThumbsUpIcon />
            <span className={styles.statNum}>{issue.upvotes}</span>
          </span>
        </div>
      </div>
    </a>
  );
}

type ColumnConfig = {
  id:           string;
  title:        string;
  headerCls:    string;
  countCls:     string;
  issues:       GitLabIssue[];
  loading:      boolean;
  skeletonCount: number;
};

function KanbanColumn({col}: {col: ColumnConfig}) {
  return (
    <div className={styles.column}>
      {/* Colored header pill */}
      <div className={`${styles.colHeader} ${col.headerCls}`}>
        <span className={`${styles.colCount} ${col.countCls}`}>
          {col.loading ? '–' : col.issues.length}
        </span>
        <span className={styles.colTitle}>{col.title}</span>
        <button className={styles.colAdd} aria-label={`Add to ${col.title}`}>
          <PlusIcon />
        </button>
      </div>

      {/* Cards */}
      <div className={styles.cards}>
        {col.loading ? (
          Array.from({length: col.skeletonCount}, (_, i) => <SkeletonCard key={i} />)
        ) : col.issues.length === 0 ? (
          <div className={styles.emptyCol}>
            <span>No issues here</span>
          </div>
        ) : (
          col.issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function KanbanSection(): ReactNode {
  const [openIssues,   setOpenIssues]   = useState<GitLabIssue[]>([]);
  const [closedIssues, setClosedIssues] = useState<GitLabIssue[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const [openRes, closedRes] = await Promise.all([
          fetch(`${GITLAB_API}/issues?state=opened&per_page=50&page=1`),
          fetch(`${GITLAB_API}/issues?state=closed&per_page=15&page=1&order_by=updated_at&sort=desc`),
        ]);

        if (!openRes.ok || !closedRes.ok) {
          throw new Error(`GitLab API error: ${openRes.status}`);
        }

        const openData:   GitLabIssue[] = await openRes.json();
        const closedData: GitLabIssue[] = await closedRes.json();

        setOpenIssues(openData);
        setClosedIssues(closedData.slice(0, 6));
      } catch {
        setError('Could not load issues from GitLab. The repository may be temporarily unreachable.');
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  // Split open issues by label: 'in-progress' label → In Progress, everything else → Open
  const backlogIssues    = openIssues.filter((i) => !i.labels.some((l) => l.toLowerCase() === 'in-progress'));
  const inProgressIssues = openIssues.filter((i) =>  i.labels.some((l) => l.toLowerCase() === 'in-progress'));
  const totalOpen        = openIssues.length;

  const columns: ColumnConfig[] = [
    {
      id:            'open',
      title:         'Open',
      headerCls:     styles.colHeaderIndigo,
      countCls:      styles.colCountIndigo,
      issues:        backlogIssues,
      loading,
      skeletonCount: 4,
    },
    {
      id:            'in-progress',
      title:         'In Progress',
      headerCls:     styles.colHeaderAmber,
      countCls:      styles.colCountAmber,
      issues:        inProgressIssues,
      loading,
      skeletonCount: 2,
    },
    {
      id:            'closed',
      title:         'Closed',
      headerCls:     styles.colHeaderGreen,
      countCls:      styles.colCountGreen,
      issues:        closedIssues,
      loading,
      skeletonCount: 3,
    },
  ];

  return (
    <section className={styles.section}>
      {/* ── Header & tabs ── */}
      <div className={styles.topBar}>
        <div className={styles.headerRow}>
          <Heading as="h2" className={styles.headerTitle}>
            <span className={styles.liveDot} aria-hidden="true" />
            Issue Tracker
          </Heading>
          <div className={styles.headerActions}>
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.gitlabBtn}
            >
              View on GitLab
              <ShareIcon />
            </a>
          </div>
        </div>

        <div className={styles.tabBarWrap}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>By Status</button>
            <button className={styles.tab}>
              Open Issues
              {!loading && totalOpen > 0 && (
                <span className={styles.tabBadge}>{totalOpen}</span>
              )}
            </button>
            <button className={styles.tab}>Closed</button>
            <button className={styles.tab}>By Assignee</button>
            <button className={styles.tab}>By Label</button>
          </div>
          <div className={styles.sortArea}>
            <span className={styles.sortLabel}>Sort By</span>
            <button className={styles.sortBtn}>
              Newest
              <ChevronIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* ── Board ── */}
      {!error && (
        <div className={styles.boardWrap}>
          <div className={styles.board}>
            {columns.map((col) => (
              <KanbanColumn key={col.id} col={col} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
