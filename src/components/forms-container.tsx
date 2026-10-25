import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  ComponentWithAs,
  Heading,
  Text,
} from '@chakra-ui/react';
// Donations are moving offsite, so the form is out of the page for now.
// import { DonateForm } from './donate-form';
import { heroButtonStyle } from './form';

export const HeaderButton: ComponentWithAs<'button', ButtonProps> = ({
  ...rest
}) => {
  return (
    <Button
      {...heroButtonStyle}
      backgroundColor="mint.brand"
      _hover={{
        backgroundColor: 'mint.brandlight',
      }}
      _active={{
        backgroundColor: 'mint.branddark',
      }}
      borderRadius={0}
      // Vertical to match the horizontal: the pair wraps to two rows wherever
      // the column holding them is narrower than both together, and without
      // this they meet with no seam between them.
      margin={1}
      textTransform="uppercase"
      fontFamily="Edmond Sans, Helvetica"
      {...rest}
    />
  );
};

// eslint-disable-next-line no-shadow
export enum FormsState {
  none = 0,
  donate,
  thankYou,
}

/** Shown when a donor comes back to `/#thank-you`. */
const ThankYouMessage: FunctionComponent = () => (
  <Box
    role="status"
    backgroundColor="#F4F9F9"
    borderTopWidth={6}
    borderTopColor="mint.brand"
    paddingX={[4, 8]}
    paddingY={[6, 8]}
    borderRadius={[0, 10]}
    textAlign="center"
  >
    <Heading
      as="h2"
      variant="h3"
      fontSize={['2xl', '3xl']}
      fontWeight="bold"
      marginTop={0}
    >
      Thank you for your donation!
    </Heading>
    <Text fontSize={['1em', '1.4em']} marginTop={4} marginBottom={0}>
      Every dollar donated goes directly to our scholars studying architecture
      and design. Your support is essential to help these students grow and find
      their calling in the world of design.
    </Text>
  </Box>
);

type FormsContainerProps = {
  initialState?: FormsState;
};

const FormsContainer: FunctionComponent<FormsContainerProps> = ({
  initialState = FormsState.none,
}) => {
  const [openForm, setOpenForm] = useState(initialState);
  const formsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setOpenForm(initialState);
  }, [initialState]);

  useEffect(() => {
    if (openForm !== FormsState.none)
      formsContainerRef.current?.scrollIntoView(true);
  }, [openForm, formsContainerRef]);

  return (
    <Box
      ref={formsContainerRef}
      position="relative"
      marginX="auto"
      zIndex={2}
      width={['auto', 'calc(100% - 1rem)']}
      maxWidth={600}
      borderRadius={10}
      marginTop={8}
      marginBottom={openForm === FormsState.none ? 0 : 16}
    >
      {/* {openForm === FormsState.donate && <DonateForm />} */}
      {openForm === FormsState.thankYou && <ThankYouMessage />}
    </Box>
  );
};

export default FormsContainer;
