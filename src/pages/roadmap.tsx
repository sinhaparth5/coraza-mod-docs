import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import KanbanSection from '@site/src/components/KanbanSection';
import styles from './roadmap.module.css';

export default function Roadmap(): ReactNode {
  return (
    <Layout
      title="Roadmap"
      description="Live issue tracker and development roadmap for Coraza WAF Mod, pulled directly from GitLab."
    >
      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>GitLab · Live</span>
          <h1 className={styles.pageTitle}>Project Roadmap</h1>
          <p className={styles.pageDesc}>
            Development progress tracked live from our GitLab issue tracker.
            Click any card to open the issue directly on GitLab.
          </p>
        </div>
      </div>
      <KanbanSection />
    </Layout>
  );
}
