import React, { useState, useRef, useCallback, FunctionComponent } from 'react';
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
  // Mailchimp reports an address that's already on the list as a success and
  // merges the groups, so this is a safety net for any phrasing that still
  // comes back as an error. Either way the visitor is subscribed, which is all
  // they asked for — tell them so rather than showing them a problem.
  if (mailchimpError.match('is already subscribed')) {
    return null;
  }

  if (mailchimpError === 'The email you entered is not valid.') {
    return emailError;
  }

  // Hitting submit repeatedly trips a per-address limit. Mailchimp's own
  // wording says how long to wait, which beats sending them to us over
  // something that clears itself up.
  if (mailchimpError.match('Too many subscribe attempts')) {
    return { message: mailchimpError };
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

/**
 * How far above the form to land once there is something to read. Enough that
 * the message isn't jammed against the top of the viewport, and enough to show
 * a little of whatever sits above it for context.
 */
const scrollMargin = 100;

const NewsletterSignupForm: FunctionComponent<NewsletterSignupProps> = ({
  signupButtonText,
}) => {
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  // On the wrapper rather than the form itself, because the form unmounts when
  // the confirmation replaces it — a ref on the form would be gone by the time
  // the success path wanted to scroll to it.
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const top =
      container.getBoundingClientRect().top + window.pageYOffset - scrollMargin;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }, []);

  if (isSignupComplete) {
    return (
      <Box ref={containerRef}>
        <FormSuccessMessage>
          Thank you for signing up for the Lewis W. Butler Foundation
          newsletter!
        </FormSuccessMessage>
      </Box>
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
            scrollToForm();
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
              scrollToForm();
              return {
                [FORM_ERROR]: mailchimpError,
              };
            }

            // Suppressed errors count as success, so the visitor gets the
            // confirmation rather than a form that sits there looking like the
            // button did nothing. Mailchimp now reports an already-subscribed
            // address as a success outright, so little should reach this.
            setIsSignupComplete(true);
            scrollToForm();
            return undefined;
          }

          setIsSignupComplete(true);
          scrollToForm();

          trackCustomEvent({
            category: 'Email Signup Form',
            action: 'Signup Complete',
          });
        } catch (e) {
          scrollToForm();
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
        <Box ref={containerRef}>
          <form onSubmit={handleSubmit}>
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
                Keep me in the loop about scholarship opportunities and
                deadlines.
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
        </Box>
      )}
    </Form>
  );
};

export default NewsletterSignupForm;
