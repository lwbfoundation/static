import React, { FunctionComponent, FormEvent } from 'react';
import { Form, Field } from 'react-final-form';
import { Box } from '@chakra-ui/core';
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

const genericError = { message: 'There was an error processing your payment.' };

const PaymentForm: FunctionComponent<DonateProps> = ({ donateButtonText }) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <Form
      onSubmit={async ({ card }) => {
        if (!stripe) return genericError;

        try {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
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

          const json = await result.json();

          debugger;
        } catch (e) {
          return genericError;
        }

        return undefined;
      }}
    >
      {({ handleSubmit, form: { change } }) => (
        <Box as="form" maxWidth={400} onSubmit={handleSubmit}>
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
          <button type="submit" disabled={!stripe}>
            {donateButtonText}
          </button>
        </Box>
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
