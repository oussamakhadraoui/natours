const User = require('../models/userModal');
const catchHadler = require('../utily/catchHandler');
const appError = require('../utily/ErrorClass');
const { deleteOne, updateOne, getOne, getAll } = require('./factoryControl');
const multer = require('multer');
const sharp = require('sharp');

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const fileName = `user-${req.user.id}-${Date.now()}.${
//       file.mimetype.split('/')[1]
//     }`;
//     cb(null, fileName);
//   },
// });
const diskStorage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Please upload only image type!', 400), false);
  }
};

exports.resizeImage = catchHadler(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const upload = multer({ storage: diskStorage, fileFilter: filter });

exports.uploadFile = upload.single('photo');

const filtre = (jsonfile, ...fields) => {
  const availableChanger = {};
  Object.keys(jsonfile).forEach((element) => {
    if (fields.includes(element)) {
      availableChanger[element] = jsonfile[element];
    }
  });
  return availableChanger;
};
exports.UpdateUserData = catchHadler(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError('if you want to change password go to /updatepass', 401)
    );
  }
  const changer = filtre(req.body, 'name', 'email');
  if (req.file) {
    changer.photo = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.user._id, changer, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteMe = catchHadler(async (req, res, next) => {
  if (!req.body.password) {
    return next(new appError('insert your password', 404));
  }
  let user = await User.findById(req.user._id)
    .select('+password')
    .select('+active');
  const verify = await user.checkpass(req.body.password, user.password);

  if (!verify) {
    return next(new appError('insert your correct password', 401));
  }

  user.active = false;
  await user.save({ validateBeforeSave: false });
  res.status(204).json({
    status: 'success',
    message: 'if you want to back again just login',
    user,
  });
});
exports.GetMe = catchHadler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
////////////////////////////////////////////////////////////////
exports.DeleteUser = deleteOne(User);
exports.UpdateUser = updateOne(User);
exports.GetUser = getOne(User);
exports.AllUsers = getAll(User);

exports.CreateUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'use signUp instead!!!!!!!!!!!!',
  });
};

// exports.AllUsers = catchHadler(async (req, res, next) => {
//   const Users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     result: Users.length,
//     data: {
//       Users,
//     },
//   });
// });
