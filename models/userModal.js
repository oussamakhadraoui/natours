const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'you must set a name'] },
  password: {
    type: String,
    required: [true, 'you must set a password'],
    minlength: [8, 'A user pasword must have more or equal then 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'you must confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'you must confirm right your password',
    },
  },
  email: {
    type: String,
    required: [true, 'you must set your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'insert a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'leader', 'guide'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  passwordChange: {
    type: Date,
  },
  passResetToken: { type: String },
  passResetTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.active = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  (this.passwordChange = Date.now() - 1000), next();
});
userSchema.methods.checkpass = async function (password, codedPass) {
  return await bycrypt.compare(password, codedPass);
};
userSchema.methods.changedPass = function (iot) {
  if (
    this.passwordChange &&
    parseInt(this.passwordChange.getTime(), 10) / 1000 > iot
  ) {
    return true;
  }

  return false;
};
userSchema.methods.CreateResetPassToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const UserModal = mongoose.model('User', userSchema);

module.exports = UserModal;
