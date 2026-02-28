import { PaymentProvider } from '@/services/payments';
import Square from '@/assets/images/payment_square.png';
import Stripe from '@/assets/images/payment_stripe.png';
import Zelle from '@/assets/images/payment_zelle.png';
import Authorize from '@/assets/images/payment_authorize.png';
import Revit from '@/assets/images/payment_revit.png';
import Quickbooks from '@/assets/images/payment_quickbooks.png';

export const getProviderImage = (provider: PaymentProvider) => {
  switch (provider) {
  case PaymentProvider.SQUARE:
    return Square;
  case PaymentProvider.STRIPE:
    return Stripe;
  case PaymentProvider.ZELLE:
    return Zelle;
  case PaymentProvider.AUTHORIZE_NET:
    return Authorize;
  case PaymentProvider.REVIT_PAY:
    return Revit;
  case PaymentProvider.QUICKBOOKS:
    return Quickbooks;
  default:
    return null;
  }
};
