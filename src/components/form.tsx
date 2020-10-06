import React, { FunctionComponent } from 'react';
import { Input, Box, BoxProps } from '@chakra-ui/core';
import { FORM_ERROR } from 'final-form';
import { FieldRenderProps } from 'react-final-form';

export const InputControl: FunctionComponent<FieldRenderProps<any>> = ({
  input,
}) => <Input {...input} />;

export interface ErrorInfo {
  readonly message: JSX.Element | string;
}

export type FormError = {
  readonly [FORM_ERROR]: ErrorInfo;
};

export interface FormErrorMessageProps {
  readonly error: ErrorInfo;
}

export const emailIsValid: (email: string | null | undefined) => boolean = (
  email
) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const emailError: ErrorInfo = {
  message: 'Please enter a valid email address',
};

export interface SignupFormValues {
  readonly firstName: string | undefined;
  readonly lastName: string | undefined;
  readonly email: string | undefined;
}

const maxLength = 255;

export const validateSignupFormValues: (
  values: SignupFormValues
) => ErrorInfo | undefined = ({ firstName, lastName, email }) => {
  if (!firstName || firstName.length > maxLength)
    return {
      message: 'Please enter a valid first name',
    };

  if (!lastName || lastName.length > maxLength)
    return {
      message: 'Please enter a valid last name',
    };

  if (!lastName || lastName.length > maxLength)
    return {
      message: 'Please enter a valid last name',
    };

  if (!emailIsValid(email)) return emailError;

  return undefined;
};

const FormMessage: FunctionComponent<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box borderWidth={1} borderRadius={10} paddingX={4} paddingY={1} {...rest}>
      {children}
    </Box>
  );
};

export const FormErrorMessage: FunctionComponent = ({ children }) => {
  return (
    <FormMessage
      backgroundColor="yellow.100"
      borderColor="yellow.300"
      color="yellow.600"
    >
      {children}
    </FormMessage>
  );
};

export const FormSuccessMessage: FunctionComponent = ({ children }) => {
  return (
    <FormMessage
      backgroundColor="green.100"
      borderColor="green.300"
      color="green.500"
    >
      {children}
    </FormMessage>
  );
};
