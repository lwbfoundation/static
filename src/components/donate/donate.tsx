import React, { FunctionComponent, useState, forwardRef } from 'react';
import { Decorator, FORM_ERROR } from 'final-form';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import createFieldCalculator from 'final-form-calculate';
import {
  Box,
  Button,
  Text,
  RadioButtonGroup,
  RadioProps,
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
import { InputControl, FormErrorMessage, FormSuccessMessage } from '../form';

const isServer = typeof window === 'undefined';

const StripeLoader: FunctionComponent = ({ children }) => {
  const stripePromise = isServer
    ? Promise.resolve(null)
    : loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY as string);

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

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
      backgroundColor={isChecked ? 'gray.600' : 'white'}
      color={isChecked ? 'white' : 'gray.600'}
      _hover={{ backgroundColor: isChecked ? 'gray.600' : 'gray.100' }}
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

const updateAmount = (_: any, { amountOption, customAmount }: any) =>
  amountOption ||
  (customAmount && parseFloat(customAmount.replace(/,/g, '')) * 100);

const fieldCalculator = createFieldCalculator(
  {
    field: 'amountOption',
    updates: {
      amount: updateAmount,
    },
  },
  {
    field: 'customAmount',
    updates: {
      amount: updateAmount,
    },
  }
) as Decorator<PaymentFormValues>;

const PaymentForm: FunctionComponent<DonateProps> = ({ donateButtonText }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  if (isPaymentComplete)
    return (
      <FormSuccessMessage>
        Thank you for supporting the Lewis W. Butler Foundation! You will
        receive an email receipt for your records.
      </FormSuccessMessage>
    );

  return (
    <Form<PaymentFormValues>
      initialValues={{ amountOption: 2000 }}
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
          <pre>
            {(() => {
              const { card, ...otherValues } = values;
              return JSON.stringify(otherValues, null, 2);
            })()}
          </pre>
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
          <Text as="label" display="block" marginBottom={4}>
            Email address
            <Field
              name="email"
              autocomplete="email"
              marginTop={1}
              component={InputControl}
            />
          </Text>
          <Box marginBottom={4}>
            <Text display="block" marginBottom={1}>
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
              <Field
                name="customAmount"
                placeholder="Enter donation amount"
                component={InputControl}
                marginBottom={2}
              />
            )}
          </Box>
          <Text display="block" marginBottom={2}>
            Credit card details
            <Box
              marginTop={1}
              borderWidth={1}
              borderColor="#E2E8F0"
              paddingX={4}
              paddingY={2}
              borderRadius="4px"
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
                  />
                )}
              </Field>
            </Box>
          </Text>
          <Box textAlign="right" marginTop={4}>
            <Button
              type="submit"
              backgroundColor="gray.600"
              color="white"
              _hover={{ backgroundColor: 'gray.700' }}
              isDisabled={!stripe || submitting}
              width={['100%', 'auto']}
            >
              {donateButtonText}
            </Button>
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
