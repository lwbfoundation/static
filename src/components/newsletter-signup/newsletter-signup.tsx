import React, { useState, useRef, FunctionComponent } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import { Text, Box } from '@chakra-ui/react';
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
  CheckboxControl,
  heroButtonStyle,
} from '../form';
import signupForNewsletter, { NewsletterGroup } from './signup-for-newsletter';

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

const getMailchimpError: (mailchimpError: string) => ErrorInfo | null = (
  mailchimpError
) => {
  if (mailchimpError.match('is already subscribed')) {
    // For now, just show success message if they are already subscribed.
    // In the future, merge their signup groups.
    return null;

    // return {
    //   message: (
    //     <>
    //       You are already subscribed to our mailing list. Please email{' '}
    //       <a href="mailto:info@lewiswbutlerfoundation.org">
    //         info@lewiswbutlerfoundation.org
    //       </a>{' '}
    //       if you need assistance.
    //     </>
    //   ),
    // };
  }

  if (mailchimpError === 'The email you entered is not valid.') {
    return emailError;
  }

  return genericError;
};

const contactTypes: { name?: NewsletterGroup; label: string }[] = [
  {
    name: NewsletterGroup.DESIGN_STUDENT,
    label: 'Design student',
  },
  {
    name: NewsletterGroup.DESIGN_PROFESSIONAL,
    label: 'Design professional',
  },
  {
    name: NewsletterGroup.DESIGN_EDUCATOR,
    label: 'Design educator',
  },
  {
    name: NewsletterGroup.COMMUNITY_MEMBER,
    label: 'Community member',
  },
  {
    label: 'Other',
  },
];

type NewsletterSignupProps = Readonly<{
  signupButtonText: string;
}>;

type NewsletterSignupFormValues = SignupFormValues & {
  contactType: NewsletterGroup | undefined;
  interestedInScholarshipOpportunities: boolean;
};

const NewsletterSignupForm: FunctionComponent<NewsletterSignupProps> = ({
  signupButtonText,
}) => {
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const formRef = useRef() as React.MutableRefObject<HTMLFormElement>;

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
        contactType: NewsletterGroup.DESIGN_STUDENT,
      }}
      onSubmit={async (values) => {
        try {
          const validationError = validateSignupFormValues(values);
          if (validationError) {
            formRef.current?.scrollIntoView(true);
            return {
              [FORM_ERROR]: validationError,
            };
          }

          const {
            firstName,
            lastName,
            email,
            contactType,
            interestedInScholarshipOpportunities,
          } = values;

          const groups: NewsletterGroup[] = [
            ...(contactType ? [contactType] : []),
            ...(interestedInScholarshipOpportunities
              ? [NewsletterGroup.SCHOLARSHIP_OPPORTUNITIES]
              : []),
          ];

          const { result, msg: message } = await signupForNewsletter({
            firstName,
            lastName,
            email,
            groups,
          });

          // Branch on success rather than on error, so an unrecognized result
          // shows the error message instead of a false confirmation.
          if (result !== 'success') {
            const mailchimpError = getMailchimpError(message);
            if (mailchimpError) {
              formRef.current?.scrollIntoView(true);
              return {
                [FORM_ERROR]: mailchimpError,
              };
            }

            // Suppressed errors — currently only "already subscribed" — count
            // as success, so the visitor gets the confirmation rather than a
            // form that sits there looking like the button did nothing.
            setIsSignupComplete(true);
            return undefined;
          }

          // No scroll on success, unlike the error paths. The confirmation
          // replaces the form in place, so it lands where the visitor is
          // already looking; scrolling would just yank the page under them.
          setIsSignupComplete(true);

          trackCustomEvent({
            category: 'Email Signup Form',
            action: 'Signup Complete',
          });
        } catch (e) {
          formRef.current?.scrollIntoView(true);
          return { [FORM_ERROR]: genericError };
        }

        return undefined;
      }}
    >
      {({
        handleSubmit,
        submitting,
        // values,
        dirtySinceLastSubmit,
        submitError,
      }) => (
        <form onSubmit={handleSubmit} ref={formRef}>
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          {submitError && !dirtySinceLastSubmit && (
            <Box marginBottom={8}>
              <FormErrorMessage>{submitError.message}</FormErrorMessage>
            </Box>
          )}
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            First name
            <Field
              name="firstName"
              autoComplete="given-name"
              marginTop={1}
              component={InputControl}
              backgroundColor="white"
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            Last name
            <Field
              name="lastName"
              autoComplete="family-name"
              marginTop={1}
              component={InputControl}
              backgroundColor="white"
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            Email address
            <Field
              name="email"
              autoComplete="email"
              marginTop={1}
              component={InputControl}
              backgroundColor="white"
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            I am a...
            <Field
              name="contactType"
              marginTop={1}
              component={SelectControl}
              backgroundColor="white"
            >
              {contactTypes.map((contactType) => (
                <option
                  key={contactType.name || 'Other'}
                  value={contactType.name || ''}
                >
                  {contactType.label}
                </option>
              ))}
            </Field>
          </Text>
          <Field
            name="interestedInScholarshipOpportunities"
            type="checkbox"
            component={CheckboxControl}
            size="lg"
            marginTop={4}
          >
            <Text fontSize="md">
              Keep me in the loop about scholarship opportunities and deadlines.
            </Text>
          </Field>
          <Box textAlign="right" marginTop={4}>
            <SubmitButton
              {...heroButtonStyle}
              marginTop={2}
              isDisabled={submitting}
            >
              {submitting ? 'Submitting...' : signupButtonText}
            </SubmitButton>
          </Box>
        </form>
      )}
    </Form>
  );
};

export default NewsletterSignupForm;
