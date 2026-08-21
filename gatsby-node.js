const { resolve } = require(`path`);
const path = require(`path`);
const glob = require(`glob`);
const { newsPostPath, newsYearPath } = require(`./src/utils/news-paths`);
// const { dd } = require(`dumper.js`);

const getTemplates = () => {
  const sitePath = path.resolve(`./`);
  return glob.sync('./src/templates/**/*.{js,tsx}', { cwd: sitePath });
};

const nodeRedirects = {
  '/thank-you/': '/',
  '/application-form': 'https://forms.gle/4RjsgBBcQ7MvaeVy5',
  '/recommender-form': 'https://forms.gle/Lbvz3nLTZAQiqeGn6',
  '/scholarship/recipients/': '/scholarship/recipients/2026-recipients',
};

//
// @todo move this to gatsby-theme-wordpress
exports.createPages = async ({ actions, graphql /* , reporter */ }) => {
  const templates = getTemplates();

  const {
    data: {
      allWpContentNode: { nodes: contentNodes },
    },
  } = await graphql(/* GraphQL */ `
    query ALL_CONTENT_NODES {
      allWpContentNode(
        sort: { fields: modifiedGmt, order: DESC }
        filter: { nodeType: { eq: "Page" } }
      ) {
        nodes {
          nodeType
          uri
          id
        }
      }
    }
  `);

  const contentTypeTemplateDirectory = `./src/templates/single/`;
  const contentTypeTemplates = templates.filter((contentTypeTemplatePath) =>
    contentTypeTemplatePath.includes(contentTypeTemplateDirectory)
  );

  Object.keys(nodeRedirects).forEach((redirectPath) => {
    console.log('creating redirect', redirectPath, nodeRedirects[redirectPath]);
    actions.createRedirect({
      fromPath: redirectPath,
      toPath: nodeRedirects[redirectPath],
    });
  });

  await Promise.all(
    contentNodes.map(async (node, i) => {
      const { nodeType, uri, id } = node;
      console.log('creating page', uri);
      if (nodeRedirects[uri]) {
        console.log('page matches redirect uri, skipping');
        return;
      }

      // this is a super super basic template hierarchy
      // this doesn't reflect what our hierarchy will look like.
      // this is for testing/demo purposes
      const templatePath = `${contentTypeTemplateDirectory}${nodeType}`;

      const contentTypeTemplate = contentTypeTemplates.find(
        (contentTypeTemplatePath) =>
          contentTypeTemplatePath.includes(templatePath)
      );

      if (!contentTypeTemplate) {
        return;
      }

      await actions.createPage({
        component: resolve(contentTypeTemplate),
        path: uri,
        context: {
          id,
          nextPage: (contentNodes[i + 1] || {}).id,
          previousPage: (contentNodes[i - 1] || {}).id,
        },
      });
    })
  );

  // News lives under /news/: a post at /news/<slug>/, plus a year archive at
  // /news/<year>/. WordPress keeps its default dated permalinks, so each post's
  // CMS uri is redirected to the path built here.
  const {
    data: { allWpPost },
  } = await graphql(/* GraphQL */ `
    {
      allWpPost(sort: { fields: date, order: DESC }) {
        nodes {
          id
          slug
          uri
          year: date(formatString: "YYYY")
        }
      }
    }
  `);

  const posts = allWpPost.nodes;

  await Promise.all(
    posts.map(async (post, i) => {
      const postPath = newsPostPath(post.slug);
      console.log('creating post', postPath);

      if (post.uri && post.uri !== postPath) {
        actions.createRedirect({
          fromPath: post.uri,
          toPath: postPath,
          isPermanent: true,
        });
      }

      await actions.createPage({
        component: resolve(`./src/templates/single/Post.tsx`),
        path: postPath,
        context: {
          id: post.id,
          // Sorted newest-first, so the following entry is the older post.
          olderPost: (posts[i + 1] || {}).id,
          newerPost: (posts[i - 1] || {}).id,
        },
      });
    })
  );

  const years = [...new Set(posts.map((post) => post.year))];

  await Promise.all(
    years.map(async (year) => {
      const yearPath = newsYearPath(year);
      console.log('creating news archive', yearPath);

      await actions.createPage({
        component: resolve(`./src/templates/news-year.tsx`),
        path: yearPath,
        context: { year },
      });
    })
  );
};
