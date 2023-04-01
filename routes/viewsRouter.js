const express = require('express');
const {
  getOverview,
  getTour,
  loginView,
  changeData,
  me,
} = require('../controllers/viewsController');
const { islogin, protect } = require('../controllers/authControl');
const router = express.Router();

router.get('/me', protect, me);
router.post('/submit-user-data', protect, changeData);
router.use(islogin);

router.get('/', getOverview);
router.get('/login', loginView);
router.get('/tour/:slug', getTour);

module.exports = router;
