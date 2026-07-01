import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE_URL = 'https://waf.astrareconslabs.com';

const config: Config = {
  title: 'Coraza WAF Mod',
  tagline: 'One binary. Full WAF protection.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'sinhaparth5',
  projectName: 'coraza-waf-mod',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'manifest', href: '/manifest.json'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://gitlab.com/sinhaparth5/coraza-waf-mod/-/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: 'Coraza WAF Mod Blog',
            description: 'Technical deep-dives, release notes, and security insights from the Coraza WAF Mod team.',
            copyright: `Copyright © ${new Date().getFullYear()} Coraza WAF Mod Contributors.`,
            language: 'en',
          },
          editUrl: 'https://gitlab.com/sinhaparth5/coraza-waf-mod/-/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: null,
          changefreq: null,
          priority: null,
          ignorePatterns: ['/tags/**', '/blog/tags/**'],
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-R8GXDLB8L1',
          anonymizeIP: false,
        },
        googleTagManager: {
          containerId: 'GTM-NPSXB8DG',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Default og:image for pages that don't set their own
    image: 'img/seo_image.jpg',

    // Global meta tags injected into every page <head>
    metadata: [
      {
        name: 'keywords',
        content:
          'web application firewall, WAF, coraza, owasp crs, security, reverse proxy, go, golang, waf mod, ip blocking, geo blocking, rate limiting, TLS, bot protection',
      },
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@parth_sinha18'},
      {name: 'twitter:creator', content: '@parth_sinha18'},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Coraza WAF Mod'},
      {property: 'og:locale', content: 'en_US'},
    ],

    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Coraza WAF Mod',
      logo: {
        alt: 'Coraza WAF Mod Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/roadmap', label: 'Roadmap', position: 'left'},
        {
          href: 'https://gitlab.com/sinhaparth5/coraza-waf-mod',
          label: 'GitLab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Coraza WAF',
              href: 'https://coraza.io',
            },
            {
              label: 'OWASP Core Rule Set',
              href: 'https://coreruleset.org',
            },
            {
              label: 'GitLab',
              href: 'https://gitlab.com/sinhaparth5/coraza-waf-mod',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Issues',
              href: 'https://gitlab.com/sinhaparth5/coraza-waf-mod/-/issues',
            },
            {
              label: 'Apache 2.0 License',
              href: 'https://www.apache.org/licenses/LICENSE-2.0',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Coraza WAF Mod Contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
