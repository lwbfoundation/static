import React from 'react';
import { PaymentFormValues } from './types';
import { validateSignupFormValues, ErrorInfo } from '../form';

export const genericError: ErrorInfo = {
  message: (
    <>
      There was an error processing your payment. Please double-check your
      payment information and try again, or email{' '}
      <a href="mailto:info@lewiswbutlerfoundation.org">
        info@lewiswbutlerfoundation.org
      </a>{' '}
      if you need assistance.
    </>
  ),
};

export const genericCardError: ErrorInfo = {
  message:
    'There was an issue with your credit card details. Please double-check them and try again.',
};

export const validatePaymentFormValues: (
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

  if (amount > 514964) {
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
    return genericCardError;
  }

  return undefined;
};
