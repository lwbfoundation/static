/**
 * Post paths are built here rather than read from WordPress. The CMS keeps its
 * default dated permalinks (/2026/08/21/test-post/) while the site publishes
 * posts under /news/, so gatsby-node.js redirects the former to the latter.
 *
 * Plain CommonJS so gatsby-node.js can require it alongside the components.
 */

const NEWS_ROOT = '/news/';

const newsPostPath = (slug) => `${NEWS_ROOT}${slug}/`;

const newsYearPath = (year) => `${NEWS_ROOT}${year}/`;

module.exports = { NEWS_ROOT, newsPostPath, newsYearPath };
