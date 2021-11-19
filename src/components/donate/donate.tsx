import React, {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  forwardRef,
} from 'react';
import { Decorator, FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import createFieldCalculator from 'final-form-calculate';
import {
  Box,
  BoxProps,
  Button,
  Text,
  RadioProps,
  ButtonProps,
  useRadio,
} from '@chakra-ui/react';
import type { StripeCardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { trackCustomEvent } from 'gatsby-plugin-google-analytics';
import { PaymentFormValues } from './types';
import {
  validatePaymentFormValues,
  genericError,
  genericCardError,
} from './validation';
import {
  InputControl,
  FormErrorMessage,
  FormSuccessMessage,
  SubmitButton,
  CheckboxControl,
  RadioButtonGroupControl,
} from '../form';
import signupForNewsletter, {
  NewsletterGroup,
} from '../newsletter-signup/signup-for-newsletter';

const AMOUNTS: { value: string; label: string }[] = [
  {
    label: '$10,000',
    value: '1000000',
  },
  {
    label: '$5,000',
    value: '500000',
  },
  {
    label: '$2,500',
    value: '250000',
  },
  {
    label: '$1,000',
    value: '100000',
  },
  {
    label: '$500',
    value: '50000',
  },
  {
    label: 'Other',
    value: '',
  },
];

const isServer = typeof window === 'undefined';

const StripeLoader: FunctionComponent = ({ children }) => {
  const stripePromise = isServer
    ? Promise.resolve(null)
    : loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY as string);

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

const AmountButton = forwardRef<HTMLButtonElement, RadioProps & ButtonProps>(
  (props, ref) => {
    const { getCheckboxProps, getInputProps } = useRadio(props);
    const checkbox = getCheckboxProps();
    const input = getInputProps();
    const { isChecked, children, ...rest } = props;
    return (
      <Button
        ref={ref}
        as="label"
        backgroundColor="white"
        cursor="pointer"
        borderColor="gray.brand"
        _checked={{
          backgroundColor: 'orange.brand',
          color: 'white',
        }}
        _hover={{
          backgroundColor: isChecked ? 'gray.type' : 'gray.100',
        }}
        height={7}
        paddingTop={1}
        borderWidth={1}
        width="calc(33% - 0.5rem)"
        {...checkbox}
        {...rest}
      >
        {children}
        <input {...input} />
      </Button>
    );
  }
);

interface FauxInputProps extends BoxProps {
  isFocused?: boolean;
}

const fauxInputFocusProps = {
  borderColor: '#3182ce',
  boxShadow: '0 0 0 1px #3182ce',
};

const FauxInput: FunctionComponent<FauxInputProps> = ({
  isFocused,
  ...props
}) => (
  <Box
    borderWidth={1}
    borderColor="#E2E8F0"
    paddingX={4}
    borderRadius={4}
    minHeight="40px"
    backgroundColor="white"
    {...(isFocused && fauxInputFocusProps)}
    _focusWithin={fauxInputFocusProps}
    {...props}
  />
);

const calculateAmountWithFeesCovered = (amount: number) =>
  Math.ceil((amount + 30) / (1 - 0.029));

const parseCustomAmount = (customAmount: string | undefined) => {
  if (!customAmount) return null;
  const parsed = parseFloat(customAmount.replace(/,/g, ''));
  if (!parsed) return null;
  return parsed * 100;
};

const updateBaseAmount = (_: any, { amountOption, customAmount }: any) => {
  if (amountOption === 0) return 0;
  return amountOption || parseCustomAmount(customAmount);
};

const updateAmountWithFeesCovered = (_: any, { baseAmount }: any) => {
  return baseAmount && calculateAmountWithFeesCovered(baseAmount);
};

const updateAmount = (
  _: any,
  { baseAmount, amountWithFeesCovered, coverFees }: any
) => {
  return coverFees ? amountWithFeesCovered : baseAmount;
};

const fieldCalculator = createFieldCalculator(
  {
    field: 'amountOption',
    updates: {
      baseAmount: updateBaseAmount,
    },
  },
  {
    field: 'customAmount',
    updates: {
      baseAmount: updateBaseAmount,
    },
  },
  {
    field: 'baseAmount',
    updates: {
      amountWithFeesCovered: updateAmountWithFeesCovered,
      amount: updateAmount,
    },
  },
  {
    field: 'amountWithFeesCovered',
    updates: {
      amount: updateAmount,
    },
  },
  {
    field: 'coverFees',
    updates: {
      amount: updateAmount,
    },
  }
) as Decorator<PaymentFormValues>;

const createCurrencyFormatterGetter = () => {
  let currencyFormatter: Intl.NumberFormat | undefined;
  return () => {
    currencyFormatter =
      currencyFormatter ||
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    return currencyFormatter;
  };
};

const getCurrencyFormatter = createCurrencyFormatterGetter();

const PaymentForm: FunctionComponent<DonateProps> = ({ donateButtonText }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [renderClient, setRenderClient] = useState(false);
  const [isCardFieldFocused, setIsCardFieldFocused] = useState(false);
  const formRef = useRef() as React.MutableRefObject<HTMLFormElement>;

  useEffect(() => {
    setRenderClient(true);
  }, []);

  if (isPaymentComplete)
    return (
      <FormSuccessMessage>
        Thank you for supporting the Lewis W. Butler Foundation! You will
        receive an email receipt for your records.
      </FormSuccessMessage>
    );

  return (
    <Form<PaymentFormValues>
      initialValues={{ amountOption: 0, coverFees: false }}
      decorators={[fieldCalculator]}
      onSubmit={async (values) => {
        if (!stripe) {
          formRef.current?.scrollIntoView(true);
          return { [FORM_ERROR]: genericError };
        }

        const validationError = validatePaymentFormValues(values);
        if (validationError) {
          formRef.current?.scrollIntoView(true);
          return { [FORM_ERROR]: validationError };
        }

        try {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: values.card.element as StripeCardElement,
          });

          if (error) {
            formRef.current?.scrollIntoView(true);
            return { [FORM_ERROR]: genericCardError };
          }

          const response = await fetch(
            `${process.env.GATSBY_API_BASE}/process_payment`,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: values.amount,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                paymentMethod,
              }),
            }
          );

          if (!response.ok) {
            const body = await response.json();

            formRef.current?.scrollIntoView(true);

            if (body.error?.type === 'StripeCardError') {
              return {
                [FORM_ERROR]: {
                  message:
                    'Your card was declined. Please double-check your card details or try again with a different card.',
                },
              };
            }

            return { [FORM_ERROR]: genericError };
          }

          await response.json();

          trackCustomEvent({
            category: 'Payment Form',
            action: 'Payment Complete',
            value: values.amount,
          });

          if (process.env.GATSBY_PROD_SITE)
            signupForNewsletter({
              email: values.email,
              firstName: values.firstName,
              lastName: values.lastName,
              groups: [NewsletterGroup.DONOR],
            });
        } catch (e) {
          formRef.current?.scrollIntoView(true);
          return { [FORM_ERROR]: genericError };
        }

        formRef.current?.scrollIntoView(true);
        setIsPaymentComplete(true);
        return undefined;
      }}
    >
      {({
        handleSubmit,
        submitting,
        values,
        submitError,
        dirtySinceLastSubmit,
        form: { change },
      }) => (
        <form onSubmit={handleSubmit}>
          {/* <pre>
            {(() => {
              const { card, ...otherValues } = values;
              return JSON.stringify(otherValues, null, 2);
            })()}
          </pre> */}
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
              backgroundColor="white"
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={2}>
            Last name
            <Field
              name="lastName"
              autocomplete="family-name"
              marginTop={1}
              component={InputControl}
              backgroundColor="white"
            />
          </Text>
          <Text as="label" fontWeight="bold" display="block" marginBottom={4}>
            Email address
            <Field
              name="email"
              autocomplete="email"
              marginTop={1}
              component={InputControl}
              backgroundColor="white"
            />
          </Text>
          <Box marginBottom={4}>
            <Text as="div" fontWeight="bold" display="block" marginBottom={1}>
              Donation amount
              <Field
                name="amountOption"
                component={RadioButtonGroupControl}
                parse={(value) =>
                  value === '' ? undefined : parseInt(value, 10)
                }
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                padding={0}
                marginTop={2}
                format={(value) =>
                  typeof value === 'undefined' ? '' : value.toString()
                }
              >
                {AMOUNTS.map(({ label, value }) => (
                  <AmountButton marginBottom={1} value={value}>
                    {label}
                  </AmountButton>
                ))}
              </Field>
            </Text>
            {typeof values.amountOption === 'undefined' && (
              <FauxInput display="flex">
                <Text as="div" paddingY={2}>
                  $
                </Text>
                <Field
                  name="customAmount"
                  placeholder="0.00"
                  component={InputControl}
                  borderWidth={0}
                  paddingX={0}
                  flexGrow
                  display="block"
                  _focus={{
                    boxShadow: 'none',
                  }}
                  autoFocus
                />
              </FauxInput>
            )}
          </Box>

          <Text as="div" fontWeight="bold" display="block" marginBottom={2}>
            Credit card
            {renderClient && (
              <FauxInput
                marginTop={1}
                paddingY={2}
                isFocused={isCardFieldFocused}
              >
                <Field name="card">
                  {({ input }) => (
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontFamily: '-apple-system, system-ui, "Segoe UI"',
                            fontWeight: '400',
                            color: 'rgb(26, 32, 44)',
                            fontSmoothing: 'antialiased',
                            '::placeholder': {
                              color: '#A0AEC0',
                            },
                          },
                        },
                      }}
                      {...input}
                      onChange={({ error }) =>
                        change('card', {
                          error,
                          element: elements?.getElement(CardElement),
                        })
                      }
                      onFocus={() => {
                        setIsCardFieldFocused(true);
                      }}
                      onBlur={() => {
                        setIsCardFieldFocused(false);
                      }}
                    />
                  )}
                </Field>
              </FauxInput>
            )}
          </Text>
          <Field
            name="coverFees"
            type="checkbox"
            component={CheckboxControl}
            size="lg"
            marginTop={4}
          >
            <Text fontSize="md">
              I would like to cover the{' '}
              {values.baseAmount && values.amountWithFeesCovered
                ? getCurrencyFormatter().format(
                    (values.amountWithFeesCovered - values.baseAmount) / 100
                  )
                : ''}{' '}
              transaction fee so that the Lewis W. Butler Foundation gets my
              full{' '}
              {values.baseAmount
                ? getCurrencyFormatter().format(values.baseAmount / 100)
                : ''}{' '}
              donation.
            </Text>
          </Field>
          <Box textAlign={['center', 'right']}>
            <Box marginTop={4}>
              {values.coverFees && values.amount ? (
                <Text display="block" fontWeight="bold" fontSize="lg">
                  Total: {getCurrencyFormatter().format(values.amount / 100)}
                </Text>
              ) : (
                ''
              )}
            </Box>
            <SubmitButton marginTop={4} isDisabled={!stripe || submitting}>
              {submitting ? 'Submitting...' : donateButtonText}
            </SubmitButton>
          </Box>
        </form>
      )}
    </Form>
  );
};

interface DonateProps {
  donateButtonText: string;
}

const Donate: FunctionComponent<DonateProps> = (donateProps) => {
  return (
    <StripeLoader>
      <PaymentForm {...donateProps} />
    </StripeLoader>
  );
};

export default Donate;
