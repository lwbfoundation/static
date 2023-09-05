const { resolve } = require(`path`);
const path = require(`path`);
const glob = require(`glob`);
const chunk = require(`lodash/chunk`);
// const { dd } = require(`dumper.js`);

const getTemplates = () => {
  const sitePath = path.resolve(`./`);
  return glob.sync('./src/templates/**/*.{js,tsx}', { cwd: sitePath });
};

const nodeRedirects = {
  '/thank-you/': '/',
  '/application-form':
    'https://docs.google.com/forms/d/e/1FAIpQLSdkPAel_o8wk9obnVdgCwy-V37XKDR_QrdiZzQUpREL2y-W_Q/viewform',
  '/recommender-form':
    'https://docs.google.com/forms/d/e/1FAIpQLSfQdbinjFJiqVniRMiIujfsPq4bSGrK0iuZykddupEQcFERGA/viewform',
  '/scholarship/recipients': '/scholarship/recipients/2023-recipients',
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
        filter: { nodeType: { ne: "MediaItem" } }
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

      if (nodeRedirects[uri]) {
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

  // create the homepage
  const {
    data: { allWpPost },
  } = await graphql(/* GraphQL */ `
    {
      allWpPost(sort: { fields: modifiedGmt, order: DESC }) {
        nodes {
          uri
          id
        }
      }
    }
  `);

  const perPage = 10;
  const chunkedContentNodes = chunk(allWpPost.nodes, perPage);

  await Promise.all(
    chunkedContentNodes.map(async (nodesChunk, index) => {
      const firstNode = nodesChunk[0];
      const page = index + 1;
      const offset = perPage * index;

      await actions.createPage({
        component: resolve(`./src/templates/index.js`),
        path: page === 1 ? `/blog/` : `/blog/${page}/`,
        context: {
          firstId: firstNode.id,
          page,
          offset,
          totalPages: chunkedContentNodes.length,
          perPage,
        },
      });
    })
  );
};
