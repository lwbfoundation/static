import { StripeError, StripeCardElement } from '@stripe/stripe-js';
import { SignupFormValues } from '../form';

type CardFieldValue = {
  error: StripeError | undefined;
  element: StripeCardElement | null | undefined;
};

export type PaymentFormValues = SignupFormValues & {
  readonly amountOption: number | undefined;
  readonly customAmount: string | undefined;
  readonly baseAmount: number | undefined;
  readonly amountWithFeesCovered: number | undefined;
  readonly amount: number | undefined;
  readonly coverFees: boolean;
  readonly card: CardFieldValue;
};
