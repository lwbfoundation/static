import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';

export interface NewsPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly content: string;
  readonly year: string;
  readonly featuredImage: {
    node: {
      localFile: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData;
        } | null;
      } | null;
    };
  } | null;
}

export interface NewsYear {
  readonly year: string;
  readonly posts: NewsPost[];
}

/**
 * Every published post, newest first, with full bodies — the index and the year
 * archives both render articles in full, and there are few enough posts that
 * holding the whole set and filtering in memory stays cheap.
 */
export function useNewsPosts(): NewsPost[] {
  const { allWpPost } = useStaticQuery(graphql`
    query NewsPosts {
      allWpPost(sort: { fields: date, order: DESC }, limit: 999) {
        nodes {
          id
          slug
          title
          content
          year: date(formatString: "YYYY")
          featuredImage {
            node {
              localFile {
                childImageSharp {
                  gatsbyImageData(
                    quality: 80
                    width: 900
                    layout: CONSTRAINED
                    placeholder: TRACED_SVG
                  )
                }
              }
            }
          }
        }
      }
    }
  `);

  return allWpPost.nodes;
}

/** Relies on `posts` already being sorted newest-first, so years stay contiguous. */
export function groupPostsByYear(posts: NewsPost[]): NewsYear[] {
  return posts.reduce((years: NewsYear[], post) => {
    const current = years[years.length - 1];

    if (current && current.year === post.year) {
      current.posts.push(post);
      return years;
    }

    return [...years, { year: post.year, posts: [post] }];
  }, []);
}
