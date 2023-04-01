const catchHadler = require('../utily/catchHandler');
const appError = require('../utily/ErrorClass');
const Tour = require('../models/TourModals');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.sessionPaymant = catchHadler(async (req, res, next) => {
  const tourID = req.params.tourID;
  const tour = await Tour.findById(tourID);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.user.id,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: tour.name,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    data: { session },
  });
});
