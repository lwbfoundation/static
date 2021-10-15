import React, { ReactElement } from 'react';
import {
  ContainerProps as ChakraContainerProps,
  Container as ChakraContainer,
} from '@chakra-ui/react';

export function PageContainer(props: ChakraContainerProps): ReactElement {
  return <ChakraContainer maxWidth="container.xl" {...props} />;
}
