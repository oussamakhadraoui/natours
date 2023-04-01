const appError = require('../utily/ErrorClass');
const handleCastErr = (err) => {
  const message = 'INVALID path';
  return new appError(message, 404);
};

const handleduplicate = (err) => {
  const value = err.message.match(/"((?:\\.|[^"\\])*)"/)[0];
  const message = `you are entering a duplicate input ${value}`;
  return new appError(message, 400);
};

const handlevalidation = (err) => {
  const value = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input you are missing :: ${value.join('. ')} `;
  return new appError(message, 400);
};
const handlejwtError = () =>
  new appError('invalid token please login again', 401);

const handlExpToken = () => new appError('token is expired', 401);
const errProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/v1')) {
    if (err.Operational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR *** ', err);
    return res.status(500).json({
      status: 'error',
      message: 'Somethingh went wrong !',
    });
  }
  if (err.Operational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later.',
  });
};

const errDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/v1')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong', message: err.message });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV.trim() === 'development') {
    errDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastErr(err);
      console.log('cast');
    }
    if (error.code === 11000) {
      error = handleduplicate(err);
      console.log('dusplicate');
    }
    if (err.name === 'ValidationError') {
      error = handlevalidation(err);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handlejwtError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handlExpToken();
    }
    errProd(error, req, res);
  }
};
