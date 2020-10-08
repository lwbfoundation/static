import React, { FunctionComponent, useState } from 'react';
import { Box, Text, Button, ButtonProps } from '@chakra-ui/core';
import Donate from './donate/donate';
import NewsletterSignup from './newsletter-signup';

type HeaderButtonProps = ButtonProps & {
  readonly isSelected?: boolean;
};

const selectedStyle = {
  backgroundColor: 'transparent',
  borderColor: 'gray.200',
};

const HeaderButton: FunctionComponent<HeaderButtonProps> = ({
  isSelected,
  ...rest
}) => {
  return (
    <Button
      color="white"
      backgroundColor="transparent"
      borderColor="gray.500"
      {...(isSelected && selectedStyle)}
      _hover={
        isSelected
          ? selectedStyle
          : {
              backgroundColor: 'transparent',
              borderColor: 'gray.400',
            }
      }
      borderRadius={0}
      borderBottomWidth={2}
      marginX={1}
      display="inline-block"
      minWidth={150}
      fontWeight={200}
      textTransform="uppercase"
      letterSpacing={4}
      fontFamily="Trade Gothic, Helvetica"
      {...rest}
    />
  );
};

type FormContainerProps = {
  donateButtonText: string;
  emailSignupButtonText: string;
};

enum FormsState {
  None = 1,
  Donate,
  NewsletterSignup,
}

const FormsContainer: FunctionComponent<FormContainerProps> = ({
  donateButtonText,
  emailSignupButtonText,
}) => {
  const [openForm, setOpenForm] = useState(FormsState.None);
  return (
    <Box
      position="relative"
      marginX="auto"
      zIndex={2}
      marginTop={-20}
      width="calc(100% - 2rem)"
      maxWidth={520}
      borderRadius={10}
      paddingX={4}
      paddingY={2}
      marginBottom={openForm === FormsState.None ? 0 : 20}
    >
      <Text as="div" textAlign="center" marginBottom={16}>
        <HeaderButton
          onClick={() => setOpenForm(FormsState.Donate)}
          isSelected={openForm === FormsState.Donate}
        >
          {donateButtonText}
        </HeaderButton>
        <HeaderButton
          onClick={() => setOpenForm(FormsState.NewsletterSignup)}
          isSelected={openForm === FormsState.NewsletterSignup}
        >
          {emailSignupButtonText}
        </HeaderButton>
      </Text>
      {openForm === FormsState.Donate && (
        <Donate donateButtonText="Donate now" />
      )}
      {openForm === FormsState.NewsletterSignup && (
        <NewsletterSignup signupButtonText="Sign up" />
      )}
    </Box>
  );
};

export default FormsContainer;
