const express = require('express');
const {
  getAllReview,
  newReview,
  updateReview,
  OneReview,
  deleteReview,
  getTourNdUserID,
} = require('../controllers/reviewControl');
const { protect, restrictTo } = require('../controllers/authControl');
const Router = express.Router({ mergeParams: true });

Router.use(protect);

Router.route('/')
  .get(getAllReview)
  .post(restrictTo('user'), getTourNdUserID, newReview);

Router.route('/:id')
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(OneReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = Router;
