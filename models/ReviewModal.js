const mongoose = require('mongoose');
const Tour = require('./TourModals');
const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'you must write a review first'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'you must set a rating to your review'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });
ReviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name ',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
ReviewSchema.statics.calculAvgRatingAndSum = async function (TourId) {
  const state = await this.aggregate([
    {
      $match: { tour: TourId },
    },
    {
      $group: {
        _id: TourId,
        sumReview: { $sum: 1 },
        avgrate: { $avg: '$rating' },
      },
    },
  ]);
  if (state.length > 1) {
    await Tour.findByIdAndUpdate(TourId, {
      ratingsAverage: state[0].avgrate,
      ratingsQuantity: state[0].sumReview,
    });
  } else {
    await Tour.findByIdAndUpdate(TourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
ReviewSchema.post('save', function () {
  this.constructor.calculAvgRatingAndSum(this.tour);
});
ReviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});
ReviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calculAvgRatingAndSum(this.review.tour);
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
