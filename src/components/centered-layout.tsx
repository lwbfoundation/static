import React, { FunctionComponent } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import HeadContent from './head-content';

interface CenteredLayoutProps {
  title: string;
}

const CenteredLayout: FunctionComponent<CenteredLayoutProps> = ({
  title,
  children,
}) => (
  <>
    <HeadContent title={title} />
    <Global
      styles={css`
        html {
          height: 100%;
          background-color: #4b4b4b;
        }

        body {
          height: 100%;
          color: #ffffff;
        }

        #___gatsby,
        #gatsby-focus-wrapper {
          height: 100%;
        }
      `}
    />
    <Flex
      align="center"
      justify="center"
      width="100%"
      height="100%"
      paddingX={5}
    >
      <Box marginBottom="8%" maxWidth={800}>
        {children}
      </Box>
    </Flex>
  </>
);

export default CenteredLayout;
