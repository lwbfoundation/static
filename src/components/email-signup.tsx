import React, { useState, FunctionComponent } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import { Text, Button, Box } from '@chakra-ui/core';
import saveMailchimpSignup from 'gatsby-plugin-mailchimp';
import { trackCustomEvent } from 'gatsby-plugin-google-analytics';
import {
  InputControl,
  SignupFormValues,
  validateSignupFormValues,
  emailError,
  ErrorInfo,
  FormErrorMessage,
  FormSuccessMessage,
} from './form';

const genericError: ErrorInfo = {
  message: (
    <>
      There was an error submitting your email address. Please email{' '}
      <a href="mailto:info@lewiswbutlerfoundation.org">
        info@lewiswbutlerfoundation.org
      </a>{' '}
      if you need assistance.
    </>
  ),
};

const getMailchimpError: (mailchimpError: string) => ErrorInfo = (
  mailchimpError
) => {
  if (mailchimpError.match('is already subscribed')) {
    return {
      message: (
        <>
          You are already subscribed to our mailing list. Please email{' '}
          <a href="mailto:info@lewiswbutlerfoundation.org">
            info@lewiswbutlerfoundation.org
          </a>{' '}
          if you need assistance.
        </>
      ),
    };
  }

  if (mailchimpError === 'The email you entered is not valid.') {
    return emailError;
  }

  return genericError;
};

const EmailSignupForm: FunctionComponent = () => {
  const [isSignupComplete, setIsSignupComplete] = useState(false);

  if (isSignupComplete) {
    return (
      <FormSuccessMessage>
        Thank you for signing up for the Lewis W. Butler Foundation newsletter!
      </FormSuccessMessage>
    );
  }

  return (
    <Form<SignupFormValues>
      onSubmit={async (values) => {
        try {
          const validationError = validateSignupFormValues(values);
          if (validationError) {
            return {
              [FORM_ERROR]: validationError,
            };
          }

          const { firstName, lastName, email } = values;

          const { result, msg: message } = await saveMailchimpSignup(email, {
            FNAME: firstName,
            LNAME: lastName,
          });

          if (result === 'error') {
            return {
              [FORM_ERROR]: getMailchimpError(message),
            };
          }

          setIsSignupComplete(true);

          trackCustomEvent({
            category: 'Email Signup Form',
            action: 'Signup Complete',
          });
        } catch (e) {
          return { [FORM_ERROR]: genericError };
        }

        return undefined;
      }}
    >
      {({ handleSubmit, submitting, dirtySinceLastSubmit, submitError }) => (
        <form onSubmit={handleSubmit}>
          {submitError && !dirtySinceLastSubmit && (
            <Box marginBottom="2">
              <FormErrorMessage>{submitError.message}</FormErrorMessage>
            </Box>
          )}
          <Text as="label" display="block" marginBottom={2}>
            First name
            <Field
              name="firstName"
              autocomplete="given-name"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Text as="label" display="block" marginBottom={2}>
            Last name
            <Field
              name="lastName"
              autocomplete="family-name"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Text as="label" display="block" marginBottom={2}>
            Email
            <Field
              name="email"
              autocomplete="email"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Box textAlign="right">
            <Button
              type="submit"
              isDisabled={submitting}
              width={['100%', 'auto']}
            >
              Sign up
            </Button>
          </Box>
        </form>
      )}
    </Form>
  );
};

export default EmailSignupForm;
