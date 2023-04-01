import axios from 'axios';
import { alert } from './alert';
var stripe = Stripe(
  'pk_test_51MrpeCE4PH0W5SI3ZE7zLzecvnv8ATskwSaezHeIBmSJG4nxEElP0bipvj68VHgVgplVe5zfkKmDuOE7g21DlYGG003j209NfK'
);
// import { loadStripe } from '@stripe/stripe-js';

export const booking = async (tourID) => {
  try {
    const result = await axios(
      `http://127.0.0.1:8000/v1/booking/checkout-session/${tourID}`
    );
    // const stripe = await loadStripe(
    //   'pk_test_51MrpeCE4PH0W5SI3ZE7zLzecvnv8ATskwSaezHeIBmSJG4nxEElP0bipvj68VHgVgplVe5zfkKmDuOE7g21DlYGG003j209NfK'
    // );
    console.log(result);
    stripe.redirectToCheckout({ sessionId: result.data.data.session.id });
  } catch (error) {
    alert('error', error);
  }
};
