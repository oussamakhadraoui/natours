const User = require('../models/userModal');
const { promisify } = require('util');
const catchHadler = require('../utily/catchHandler');
const jwt = require('jsonwebtoken');
const appError = require('../utily/ErrorClass');
// const sendEmail = require('../utily/mail');
const crypto = require('crypto');
const Eamil = require('../utily/mail');

const tokenGen = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXP_DATE,
  });
};

// secure:true
const createSendToken = (res, status, user) => {
  const token = tokenGen(user._id);
  const CookieOptions = {
    expires: new Date(
      Date.now() + process.env.EXP_DATE_COOKIE * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV.trim() === 'production') {
    CookieOptions.secure = true;
  }
  res.cookie('jwt', token, CookieOptions);
  user.password = undefined;
  res.status(status).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.Singup = catchHadler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    passwordConfirm: req.body.passwordConfirm,
    passwordChange: req.body.passwordChange,
    role: req.body.role,
  });
  url = `${req.protocol}://${req.get('host')}/me`;
  await new Eamil(newUser, url).sendWelcome();
  createSendToken(res, 201, newUser);
});
exports.logout = catchHadler(async (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
});
exports.login = catchHadler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new appError('you need to insert both the password and email', 400)
    );
  }
  const login = await User.findOne({ email: email }).select('+password');

  if (!login || !(await login.checkpass(password, login.password))) {
    return next(new appError('your password or email is wrong', 400));
  }

  createSendToken(res, 200, login);
});

exports.protect = catchHadler(async (req, res, next) => {
  let token;
  //valid token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError('you are not login', 401));
  }
  //verification token
  const decoder = await promisify(jwt.verify)(token, process.env.SECRET);

  //check the user still exist
  const freshUser = await User.findById(decoder.id);
  if (!freshUser) {
    return next(
      new appError('User belong to this token is no longer exist', 401)
    );
  }
  //check the password didn t change

  if (freshUser.changedPass(decoder.iat)) {
    return next(new appError('changed password please login again', 401));
  }
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});
exports.islogin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // let token;
      //valid token

      //verification token
      const decoder = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET
      );

      //check the user still exist
      const freshUser = await User.findById(decoder.id);
      if (!freshUser) {
        return next();
      }
      //check the password didn t change

      if (freshUser.changedPass(decoder.iat)) {
        return next();
      }
      res.locals.user = freshUser;

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError('you are not authorize to do this action', 403));
    }
    next();
  };
};
exports.forgetPass = catchHadler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new appError(`your email doesn't exist in our database.`, 404));
  }
  const token = user.CreateResetPassToken();

  await user.save({ validateBeforeSave: false });
  const resetEmail = `${req.protocol}://${req.get(
    'host'
  )}/v1/user/resetpassword/${token}`;
  const text = `you need to send a patch request to ${resetEmail} with your new password and your confirmation.\nIf you didn't forget please ignore this email. `;

  try {
    await new Eamil(user, resetEmail).sendReset();

    res.status(200).json({
      status: 'sucess',
      message: 'token is sent to your email.',
    });
  } catch (error) {
    console.log(error);
    user.passResetToken = undefined;
    user.passResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        'something went wrong sending this email!\n Please try again later.',
        500
      )
    );
  }
});
exports.resetpass = catchHadler(async (req, res, next) => {
  const newToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passResetToken: newToken,
    passResetTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new appError('this token is invalid or the expire date is attend', 404)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passResetToken = undefined;
  user.passResetTokenExpire = undefined;
  await user.save();

  createSendToken(res, 200, user);
});
exports.updatepass = catchHadler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select('+password');
  if (!user || !(await user.checkpass(req.body.password, user.password))) {
    return next(new appError('you insert an incorrect password!!!!', 401));
  }
  user.password = req.body.Newpassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(res, 201, user);
});
