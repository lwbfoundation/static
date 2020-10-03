import React, { FunctionComponent, useState, forwardRef } from 'react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import createFieldCalculator from 'final-form-calculate';
import {
  Box,
  Button,
  Input,
  Text,
  RadioButtonGroup,
  RadioProps,
} from '@chakra-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const isServer = typeof window === 'undefined';

const StripeLoader: FunctionComponent = ({ children }) => {
  const stripePromise = isServer
    ? Promise.resolve(null)
    : loadStripe(
        'pk_test_51HXbQZG7ZcxuJ2LfYoyjGHZajbyOTdqKgBSCaUPXBQ0X8rWg6oV7OiWk5hxmqOJdV1lTOE45PhH5xTXY9zlgwsvx00pluDc8l8'
      );

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

interface FormError {
  message: string;
}

const genericError: FormError = {
  message: 'There was an error processing your payment.',
};

const InputControl: FunctionComponent<FieldRenderProps<any>> = ({ input }) => (
  <Input {...input} />
);

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
  amountOption || parseFloat(customAmount) * 100;

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
);

const PaymentForm: FunctionComponent<DonateProps> = ({ donateButtonText }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  if (isPaymentComplete)
    return (
      <div>
        Thank you for supporting the Lewis W. Butler Foundation! You will
        receive an email receipt for your records.
      </div>
    );

  return (
    <Form
      initialValues={{ amountOption: 1000 }}
      decorators={[fieldCalculator]}
      onSubmit={async (values) => {
        return;

        if (!stripe) return genericError;

        try {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: values.card,
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
      {({ handleSubmit, submitting, values, form: { change } }) => (
        <form onSubmit={handleSubmit}>
          <pre>
            {(() => {
              const { card, ...otherValues } = values;
              return JSON.stringify(otherValues, null, 2);
            })()}
          </pre>
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
                  onChange={() =>
                    change('card', elements?.getElement(CardElement))
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
