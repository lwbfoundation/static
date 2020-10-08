import React, {
  FunctionComponent,
  useState,
  forwardRef,
  useEffect,
} from 'react';
import { Decorator, FORM_ERROR } from 'final-form';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import createFieldCalculator from 'final-form-calculate';
import {
  Box,
  PseudoBox,
  PseudoBoxProps,
  Button,
  Text,
  RadioButtonGroup,
  RadioProps,
  Checkbox,
} from '@chakra-ui/core';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
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
} from '../form';

const isServer = typeof window === 'undefined';

const StripeLoader: FunctionComponent = ({ children }) => {
  const stripePromise = isServer
    ? Promise.resolve(null)
    : loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY as string);

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

const CheckboxControl: FunctionComponent<FieldRenderProps<any>> = ({
  input,
  children,
  meta,
  ...rest
}) => (
  <Checkbox {...input} {...rest}>
    {children}
  </Checkbox>
);

const RadioButtonGroupControl: FunctionComponent<FieldRenderProps<any>> = ({
  input,
  children,
  meta,
  ...rest
}) => (
  <RadioButtonGroup {...input} {...rest}>
    {children}
  </RadioButtonGroup>
);

const AmountButton = forwardRef((props: RadioProps, ref) => {
  const { isChecked, children, ...rest } = props;
  return (
    <Button
      ref={ref}
      backgroundColor={isChecked ? 'gray.500' : 'white'}
      color={isChecked ? 'white' : 'gray.600'}
      _hover={{ backgroundColor: isChecked ? 'gray.500' : 'gray.100' }}
      borderWidth={1}
      borderColor={isChecked ? 'white' : 'gray.brand'}
      aria-checked={isChecked}
      role="radio"
      width="calc(33% - 0.5rem)"
      {...rest}
    >
      {children}
    </Button>
  );
});

interface FauxInputProps extends PseudoBoxProps {
  isFocused?: boolean;
}

const fauxInputFocusProps = {
  borderColor: '#3182ce',
  boxShadow: '0 0 0 1px #3182c',
};

const FauxInput: FunctionComponent<FauxInputProps> = ({
  isFocused,
  ...props
}) => (
  <PseudoBox
    borderWidth={1}
    borderColor="#E2E8F0"
    paddingX={4}
    borderRadius={4}
    minHeight="40px"
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
      initialValues={{ amountOption: 2000, coverFees: false }}
      decorators={[fieldCalculator]}
      onSubmit={async (values) => {
        if (!stripe) return { [FORM_ERROR]: genericError };

        const validationError = validatePaymentFormValues(values);
        if (validationError) {
          return { [FORM_ERROR]: validationError };
        }

        try {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: values.card.element as StripeCardElement,
          });

          if (error) return { [FORM_ERROR]: genericCardError };

          const response = await fetch(
            'http://localhost:3000/dev/process_payment',
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: 1000,
                email: 'tobiasab@gmail.com',
                paymentMethod,
              }),
            }
          );

          if (!response.ok) {
            return { [FORM_ERROR]: genericError };
          }

          await response.json();

          trackCustomEvent({
            category: 'Payment Form',
            action: 'Payment Complete',
            value: values.amount,
          });
        } catch (e) {
          return { [FORM_ERROR]: genericError };
        }

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
          <Text as="label" fontWeight="bold" display="block" marginBottom={4}>
            Email address
            <Field
              name="email"
              autocomplete="email"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Box marginBottom={4}>
            <Text fontWeight="bold" display="block" marginBottom={1}>
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
                <AmountButton marginBottom={1} value="1000">
                  $10
                </AmountButton>
                <AmountButton marginBottom={1} value="2000">
                  $20
                </AmountButton>
                <AmountButton marginBottom={1} value="5000">
                  $50
                </AmountButton>
                <AmountButton marginBottom={1} value="10000">
                  $100
                </AmountButton>
                <AmountButton marginBottom={1} value="50000">
                  $500
                </AmountButton>
                <AmountButton marginBottom={1} value="">
                  Other
                </AmountButton>
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

          <Text fontWeight="bold" display="block" marginBottom={2}>
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
              {values.baseAmount &&
                values.amountWithFeesCovered &&
                getCurrencyFormatter().format(
                  (values.amountWithFeesCovered - values.baseAmount) / 100
                )}{' '}
              transaction fee so that the Lewis W. Butler Foundation gets my
              full{' '}
              {values.baseAmount &&
                getCurrencyFormatter().format(values.baseAmount / 100)}{' '}
              donation.
            </Text>
          </Field>
          <Box textAlign={['center', 'right']} marginTop={8}>
            {values.coverFees && values.amount && (
              <Text display="block" fontWeight="bold" fontSize="lg">
                Total: {getCurrencyFormatter().format(values.amount / 100)}
              </Text>
            )}
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
