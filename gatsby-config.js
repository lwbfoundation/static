require('dotenv').config({
  path: `.env.GATSBY_CONCURRENT_DOWNLOAD`,
});

// require .env.development or .env.production
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    'gatsby-plugin-gatsby-cloud',
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    ...(process.env.GOOGLE_ANALYTICS_TRACKING_ID
      ? [
          {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
              trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
              // respectDNT: true,
            },
          },
        ]
      : []),
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        url:
          process.env.WPGRAPHQL_URL ||
          'https://admin.lewiswbutlerfoundation.org/graphql',
        verbose: true,
        develop: {
          hardCacheMediaFiles: true,
        },
        debug: {
          graphql: {
            writeQueriesToDisk: true,
          },
        },
        type: {
          Post: {
            limit:
              process.env.NODE_ENV === 'development'
                ? // Lets just pull 50 posts in development to make it easy on ourselves.
                  50
                : // and we don't actually need more than 5000 in production for this particular site
                  5000,
          },
        },
      },
    },
    '@chakra-ui/gatsby-plugin',
    'gatsby-transformer-sharp',
    'gatsby-background-image',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/, // See below to configure properly
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: process.env.MAILCHIMP_FORM_URL,
      },
    },
    // 'gatsby-plugin-netlify-cache',
  ],
};
