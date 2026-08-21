import React, { FunctionComponent } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PageTemplateProps } from '../../templates/single/Page';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import Footer from './footer';
import CustomHeading from '../custom-heading';
import PostBody from '../post-body';
import NewsArticles from '../news-articles';
import { useNewsPosts } from '../../utils/use-news-posts';
import NewsletterSection from '../newsletter-section';

/**
 * The /news/ index, reached through the WordPress "News" page's
 * `statictemplate` field. That page's body becomes the intro copy; the posts
 * are sourced separately, since a page query can't reach them.
 *
 * Every post is listed in full, newest first. The /news/<year>/ archives still
 * build and cross-link to each other, but nothing here points at them — with
 * this few posts the flat list is the whole story.
 */
const News: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const posts = useNewsPosts();

  return (
    <PageWrapper data={data} title={data.page.title}>
      <PageContainer maxWidth={720}>
        <CustomHeading
          as="h1"
          marginY={16}
          textAlign="center"
          body={data.page.title}
        />
        {!!data.page.content && (
          <Box marginBottom={12} textAlign="center">
            <PostBody body={data.page.content} />
          </Box>
        )}
      </PageContainer>
      <NewsletterSection marginTop={0} marginBottom={[12, 16]} />
      <PageContainer maxWidth={800}>
        {posts.length ? (
          <NewsArticles posts={posts} />
        ) : (
          <Text>There&rsquo;s no news to show just yet.</Text>
        )}
      </PageContainer>
      <Footer data={data} />
    </PageWrapper>
  );
};

export default News;
