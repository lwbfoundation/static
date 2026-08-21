import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { Box, Button, ButtonProps, ComponentWithAs } from '@chakra-ui/react';
import { DonateForm } from './donate-form';
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
}

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
      {openForm === FormsState.donate && <DonateForm />}
    </Box>
  );
};

export default FormsContainer;
