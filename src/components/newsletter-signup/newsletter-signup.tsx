import React, { useState, FunctionComponent } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import { Text, Box, Select } from '@chakra-ui/core';
import saveMailchimpSignup from 'gatsby-plugin-mailchimp';
import { trackCustomEvent } from 'gatsby-plugin-google-analytics';
import {
  InputControl,
  SelectControl,
  SignupFormValues,
  validateSignupFormValues,
  emailError,
  ErrorInfo,
  FormErrorMessage,
  FormSuccessMessage,
  SubmitButton,
} from '../form';
import groups from './groups.json';

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

interface NewsletterSignupProps {
  readonly signupButtonText: string;
}

type NewsletterSignupFormValues = SignupFormValues & {
  contactType: string | undefined;
  contactAboutScholarshipOpportunities: boolean;
};

const transformContactTypeField = (
  contactType: NewsletterSignupFormValues['contactType']
) =>
  contactType && {
    [`group[${groups.contactType.categoryId}][${contactType}]`]: contactType,
  };

const NewsletterSignupForm: FunctionComponent<NewsletterSignupProps> = ({
  signupButtonText,
}) => {
  const [isSignupComplete, setIsSignupComplete] = useState(false);

  if (isSignupComplete) {
    return (
      <FormSuccessMessage>
        Thank you for signing up for the Lewis W. Butler Foundation newsletter!
      </FormSuccessMessage>
    );
  }

  return (
    <Form<NewsletterSignupFormValues>
      initialValues={{
        contactType: groups.contactType.groups[0].id?.toString(),
      }}
      onSubmit={async (values) => {
        try {
          const validationError = validateSignupFormValues(values);
          if (validationError) {
            return {
              [FORM_ERROR]: validationError,
            };
          }

          const { firstName, lastName, email } = values;

          debugger;

          const { result, msg: message } = await saveMailchimpSignup(email, {
            FNAME: firstName,
            LNAME: lastName,
            ...transformContactTypeField(values.contactType),
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
      {({
        handleSubmit,
        submitting,
        values,
        dirtySinceLastSubmit,
        submitError,
      }) => (
        <form onSubmit={handleSubmit}>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          {submitError && !dirtySinceLastSubmit && (
            <Box marginBottom={8}>
              <FormErrorMessage>{submitError.message}</FormErrorMessage>
            </Box>
          )}
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            First name
            <Field
              name="firstName"
              autocomplete="given-name"
              marginTop={1}
              component={InputControl}
              autoFocus
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            Last name
            <Field
              name="lastName"
              autocomplete="family-name"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            Email address
            <Field
              name="email"
              autocomplete="email"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            I am a...
            <Field name="contactType" marginTop={1} component={SelectControl}>
              {groups.contactType.groups.map((group) => (
                <option key={group.id} value={group.id || ''}>
                  {group.label}
                </option>
              ))}
            </Field>
          </Text>
          <Box textAlign="right">
            <SubmitButton marginTop={2} isDisabled={submitting}>
              {signupButtonText}
            </SubmitButton>
          </Box>
        </form>
      )}
    </Form>
  );
};

export default NewsletterSignupForm;
