const express = require('express');

const {
  AllUsers,
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  UpdateUserData,
  deleteMe,
  GetMe,
  uploadFile,
  resizeImage,
} = require('../controllers/userControl');
const {
  Singup,
  login,
  logout,
  forgetPass,
  resetpass,
  updatepass,
  protect,
  restrictTo,
} = require('../controllers/authControl');

const router = express.Router();

router.post('/signup', Singup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgetpassword', forgetPass);
router.patch('/resetpassword/:token', resetpass);

router.use(protect);

router.patch('/updatdata', uploadFile, resizeImage, UpdateUserData);
router.delete('/deleteme', deleteMe);
router.route('/me').get(GetMe, GetUser);
router.patch('/updatepass', updatepass);

router.use(restrictTo('admin'));

router.route('/').get(AllUsers).post(CreateUser);
router.route('/:id').get(GetUser).patch(UpdateUser).delete(DeleteUser);

module.exports = router;
