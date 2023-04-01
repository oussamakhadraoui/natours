// const appError = require('../utily/ErrorClass');
const Review = require('../models/ReviewModal');
const catchHadler = require('../utily/catchHandler');
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require('./factoryControl');

exports.getTourNdUserID = catchHadler(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.OneReview = getOne(Review);
exports.newReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
exports.getAllReview = getAll(Review);

// exports.updateReview = catchHadler(async (req, res, next) => {
//   const id = req.params.id;
//   const review = await Review.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.newReview = catchHadler(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const review = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.OneReview = catchHadler(async (req, res, next) => {
//   const id = req.params.id;
//   const review = await Review.findById(id);
//   if (!review) {
//     return next(new appError('there is no review with this id'));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.getAllReview = catchHadler(async (req, res) => {
//   let filtre = {};
//   if (req.params.tourId) filtre = { tour: req.params.tourId };
//   const review = await Review.find(filtre);
//   res.status(200).json({
//     status: 'success',
//     results: review.length,
//     data: {
//       review,
//     },
//   });
// });
