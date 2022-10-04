import { AspectRatio, Box, Heading, Text } from '@chakra-ui/react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import React, { FunctionComponent, ReactNode } from 'react';
import useMatchingHeights from '../utils/use-matching-heights';
import PostBody from './post-body';

type Person = {
  id: number | string;
  imageData: IGatsbyImageData | null;
  heading: ReactNode;
  subheading: ReactNode;
  description: string | null;
};

type PeopleListProps = {
  people: Person[];
  lastItem?: ReactNode | null;
};

const PeopleList: FunctionComponent<PeopleListProps> = ({
  people,
  lastItem,
}) => {
  const headingRefs = useMatchingHeights<HTMLHeadingElement>(people.length);
  const subheadingRefs = useMatchingHeights<HTMLHeadingElement>(people.length);
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between">
      {people.map((person, index) => (
        <Box
          key={person.id}
          width={['100%', null, 'calc(33% - 3rem)']}
          maxWidth={80}
          marginBottom={16}
          marginX="auto"
        >
          <AspectRatio ratio={1} marginBottom={4}>
            <Box
              backgroundColor="gray.600"
              width="100%"
              height="100%"
              borderRadius="100%"
              overflow="hidden"
            >
              {person.imageData && (
                <GatsbyImage alt="" image={person.imageData} />
              )}
            </Box>
          </AspectRatio>
          <Text as="div" textAlign="center">
            <Heading
              as="h3"
              variant="h3"
              fontSize="lg"
              textAlign="center"
              marginBottom={2}
              ref={headingRefs[index]}
            >
              {person.heading}
            </Heading>
            <Text
              color="gray.500"
              marginBottom="0.5em"
              textAlign="center"
              ref={subheadingRefs[index]}
            >
              {person.subheading}
            </Text>
          </Text>
          <Text as="div" textAlign={['left', null, 'justify']}>
            <PostBody body={person.description} />
          </Text>
        </Box>
      ))}
      {lastItem && (
        <Box
          width={[
            '100%',
            null,
            'calc(50% - 3rem)',
            null,
            null,
            null,
            null,
            null,
            'calc(33% - 3rem)',
          ]}
          maxWidth={80}
          marginBottom={16}
          marginX="auto"
          display="flex"
          alignItems="center"
        >
          <Box>{lastItem}</Box>
        </Box>
      )}
    </Box>
  );
};

export default PeopleList;
