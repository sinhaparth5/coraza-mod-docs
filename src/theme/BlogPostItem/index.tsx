import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import BlogAuthor from '@theme/Blog/Components/Author';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/BlogPostItem';
import styles from './styles.module.css';

/** ISO log-style date: 2019-05-28 */
function formatDateLog(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

/** Formatted date for article header: 28 MAY 2019 */
function formatDateLong(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase();
}

export default function BlogPostItem(props: Props): ReactNode {
  const {isBlogPostPage, metadata, assets} = useBlogPost();
  const {title, date, readingTime, tags, authors, description, permalink} = metadata;
  const {children} = props;

  /* ── Article detail page ── */
  if (isBlogPostPage) {
    return (
      <article className={styles.article}>
        <Link to="/blog" className={styles.backLink}>← All posts</Link>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <time className={styles.headerDate} dateTime={date}>
              {formatDateLong(date)}
            </time>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <Link key={tag.permalink} to={tag.permalink} className={styles.tag}>
                    {tag.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className={styles.headerRule} />
          <h1 className={styles.title}>{title}</h1>
          {authors.length > 0 && (
            <div className={styles.authors}>
              {authors.map((author, idx) => (
                <BlogAuthor
                  key={author.name ?? idx}
                  className={styles.author}
                  author={{
                    ...author,
                    imageURL: assets.authorsImageUrls[idx] ?? author.imageURL,
                  }}
                />
              ))}
              {readingTime !== undefined && (
                <span className={styles.readTime}>
                  &middot;&thinsp;{Math.ceil(readingTime)} min read
                </span>
              )}
            </div>
          )}
        </header>

        <div className={styles.bodyDivider} />
        <div
          id={blogPostContainerID}
          className={`${styles.body} blog-article-body markdown`}>
          <MDXContent>{children}</MDXContent>
        </div>
        <BlogPostItemFooter />
      </article>
    );
  }

  /* ── Blog list card ── */
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <time className={styles.cardDate} dateTime={date}>
          {formatDateLog(date)}
        </time>
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <Link key={tag.permalink} to={tag.permalink} className={styles.tag}>
                {tag.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.cardRule} />

      <Link to={permalink} className={styles.cardTitleLink}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </Link>

      {description && <p className={styles.cardExcerpt}>{description}</p>}

      <div className={styles.cardFooter}>
        {authors.length > 0 && (
          <div className={styles.cardAuthors}>
            {authors.map((author, idx) => {
              const imgUrl = assets.authorsImageUrls[idx] ?? author.imageURL;
              return (
                <span key={author.name ?? idx} className={styles.cardAuthor}>
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={author.name}
                      className={styles.cardAvatar}
                      loading="lazy"
                    />
                  )}
                  <span>{author.name}</span>
                </span>
              );
            })}
          </div>
        )}
        <div className={styles.cardMeta}>
          {readingTime !== undefined && (
            <span className={styles.cardReadTime}>{Math.ceil(readingTime)} min read</span>
          )}
          <Link to={permalink} className={styles.cardReadMore}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
