const express = require('express');
const {
  AllTours,
  newTour,
  OneTour,
  UpdateTour,
  DeleteTour,
  topcheap,
  avgTour,
  monthly,
  withinTour,
  getDistance,
  upload,
  resizeImages,
} = require('../controllers/apiControl');
const { protect, restrictTo } = require('../controllers/authControl');
// const { newReview } = require('../controllers/reviewControl');
const reviewRouter = require('./reviewRouter');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(withinTour);
router.route('/tours-within/center/:latlng/unit/:unit').get(getDistance);
router.route('/top5').get(topcheap, AllTours);
router.route('/avg').get(avgTour);
router
  .route('/topmonth/:year')
  .get(protect, restrictTo('admin', 'leader', 'guide'), monthly);
router
  .route('/')
  .get(AllTours)
  .post(protect, restrictTo('admin', 'leader'), newTour);
// .post(protect, restrictTo('admin', 'leader'), newReview);
router
  .route('/:id')
  .get(OneTour)
  .patch(
    protect,
    restrictTo('admin', 'leader'),
    upload,
    resizeImages,
    UpdateTour
  )
  .delete(protect, restrictTo('admin', 'leader'), DeleteTour);
module.exports = router;
