import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { NEWS_ROOT, newsYearPath } from '../utils/news-paths';

interface NewsYearLinksProps {
  /** Every year that has posts, newest first. */
  readonly years: string[];
  /** The year currently on screen; it's omitted from the links. */
  readonly currentYear: string;
  readonly label: string;
  /** Adds a link back to /news/, for pages that aren't the index. */
  readonly includeLatestLink?: boolean;
}

const NewsYearLinks: FunctionComponent<NewsYearLinksProps> = ({
  years,
  currentYear,
  label,
  includeLatestLink = false,
}) => {
  const otherYears = years.filter((year) => year !== currentYear);

  if (!otherYears.length && !includeLatestLink) {
    return null;
  }

  return (
    <Box>
      <Heading
        as="h2"
        fontSize="sm"
        textTransform="uppercase"
        color="gray.icon"
        textDecoration="none"
        marginBottom={4}
      >
        {label}
      </Heading>
      <Stack
        direction="row"
        spacing={6}
        flexWrap="wrap"
        textTransform="uppercase"
        fontWeight={600}
        fontSize="sm"
        color="blue.brand"
      >
        {includeLatestLink && (
          <Box>
            <Link to={NEWS_ROOT}>Latest</Link>
          </Box>
        )}
        {otherYears.map((year) => (
          <Box key={year}>
            <Link to={newsYearPath(year)}>{year}</Link>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NewsYearLinks;
