const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'booking must belong to a tour!!'],
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'booking must belong to a user'],
  },
  createdAt: { type: Date, default: Date.now() },
  price: { type: Number, required: [true, 'booking must have a price'] },
  paid: { type: Boolean, default: true },
});
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});
const booking = mongoose.model('Booking', bookingSchema);
module.exports = booking;
