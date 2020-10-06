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
import { loadStripe, StripeError, StripeCardElement } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  InputControl,
  ErrorInfo,
  SignupFormValues,
  validateSignupFormValues,
  FormErrorMessage,
  FormSuccessMessage,
} from './form';

const isServer = typeof window === 'undefined';

const StripeLoader: FunctionComponent = ({ children }) => {
  const stripePromise = isServer
    ? Promise.resolve(null)
    : loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY as string);

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

const genericError: ErrorInfo = {
  message: (
    <>
      There was an error processing your payment. Please email{' '}
      <a href="mailto:info@lewiswbutlerfoundation.org">
        info@lewiswbutlerfoundation.org
      </a>{' '}
      if you need assistance.
    </>
  ),
};

const RadioButtonGroupControl: FunctionComponent<FieldRenderProps<any>> = ({
  input,
  children,
}) => <RadioButtonGroup {...input}>{children}</RadioButtonGroup>;

const AmountButton = forwardRef((props: RadioProps, ref) => {
  const { isChecked, children, ...rest } = props;
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'red' : 'gray'}
      aria-checked={isChecked}
      role="radio"
      {...rest}
    >
      {children}
    </Button>
  );
});

const updateAmount = (_: any, { amountOption, customAmount }: any) =>
  amountOption ||
  (customAmount && parseFloat(customAmount.replace(/,/g, '')) * 100);

type CardFieldValue = {
  error: StripeError | undefined;
  element: StripeCardElement | null | undefined;
};

type PaymentFormValues = SignupFormValues & {
  readonly amountOption: number | undefined;
  readonly customAmount: string | undefined;
  readonly amount: number | undefined;
  readonly card: CardFieldValue;
};

const validatePaymentFormValues: (
  values: PaymentFormValues
) => ErrorInfo | undefined = (values) => {
  const signupValidationError = validateSignupFormValues(values);
  if (signupValidationError) return signupValidationError;

  const { card, amount, customAmount } = values;

  if (
    customAmount &&
    !customAmount.match(/^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/)
  ) {
    return {
      message: 'Please enter a valid amount.',
    };
  }

  if (!amount || amount < 500) {
    return {
      message: 'Please enter an amount of $5 or greater.',
    };
  }

  if (amount > 100000) {
    return {
      message: (
        <>
          We only accept donations less than $1,000 online. To donate $1,000 or
          more, please email us at{' '}
          <a href="mailto:info@lewiswbutlerfoundation.org">
            info@lewiswbutlerfoundation.org
          </a>{' '}
          and we&lsquo;ll give you the information you need.
        </>
      ),
    };
  }

  if (!card || !card.element) {
    return {
      message: 'Please enter your credit card details.',
    };
  }

  if (card.error) {
    return {
      message: 'Please enter valid credit card details.',
    };
  }

  return undefined;
};

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
      initialValues={{ amountOption: 1000 }}
      decorators={[fieldCalculator]}
      onSubmit={async (values) => {
        if (!stripe) return genericError;

        const validationError = validatePaymentFormValues(values);
        if (validationError) {
          return { [FORM_ERROR]: validationError };
        }

        try {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: values.card.element as StripeCardElement,
          });

          if (error) return genericError;

          const result = await fetch(
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

          await result.json();
        } catch (e) {
          return genericError;
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
          <Text as="label">
            First name
            <Field
              name="firstName"
              autocomplete="given-name"
              marginBottom={2}
              component={InputControl}
            />
          </Text>
          <Text as="label">
            Last name
            <Field
              name="lastName"
              autocomplete="family-name"
              marginBottom={2}
              component={InputControl}
            />
          </Text>
          <Text as="label">
            Email address
            <Field
              name="email"
              autocomplete="email"
              marginBottom={2}
              component={InputControl}
            />
          </Text>
          <Field
            name="amountOption"
            component={RadioButtonGroupControl}
            parse={(value) => (value === '' ? undefined : parseInt(value, 10))}
            format={(value) =>
              typeof value === 'undefined' ? '' : value.toString()
            }
          >
            <AmountButton value="1000">$10.00</AmountButton>
            <AmountButton value="2000">$20.00</AmountButton>
            <AmountButton value="">Other</AmountButton>
          </Field>
          {typeof values.amountOption === 'undefined' && (
            <Field
              name="customAmount"
              component={InputControl}
              marginBottom={2}
            />
          )}
          <Box marginBottom={2}>
            <Field name="card">
              {({ input }) => (
                <CardElement
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
          <Button type="submit" isDisabled={!stripe || submitting}>
            {donateButtonText}
          </Button>
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
