const catchHadler = require('../utily/catchHandler');
const appError = require('../utily/ErrorClass');
const Tour = require('../models/TourModals');
const User = require('../models/userModal');

exports.getOverview = catchHadler(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'tours', tours });
});
exports.getTour = catchHadler(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new appError('there is no Tour with this name!', 404));
  }
  res.status(200).render('tour', { title: `${tour.name}`, tour });
});
exports.loginView = catchHadler(async (req, res, next) => {
  res.status(200).render('login', { title: `login` });
});
exports.me = catchHadler(async (req, res, next) => {
  res.status(200).render('account', { title: `me` });
});
exports.changeData = catchHadler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', { title: 'me', user });
});
