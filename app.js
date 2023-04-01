const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ApiRoute = require('./routes/apiRouter');
const UserRoute = require('./routes/userRouter');
const Review = require('./routes/reviewRouter');
const errorClass = require('./utily/ErrorClass');
const GlobalError = require('./controllers/globalErrorHandle');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const sanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const viewsRouter = require('./routes/viewsRouter');
const booking = require('./routes/bookingRouter');

// doesnt work don t know why
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//===================> global middleware^

if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}

//security http service

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
// app.use(helmet());

//limit request from the same api

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    'Too many accounts created from this IP, please try again after an hour',
});
//parser reading data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//serving static file
app.use(express.static(path.join(__dirname, 'public')));

//sanitize against no-sql injection
app.use(sanitize());

//sanitize against xss attack html injection
app.use(xss());

//http pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//routes
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
//////////////////
// app.use((req, res, next) => {
//   res.removeHeader('Cross-Origin-Resource-Policy');
//   res.removeHeader('Cross-Origin-Embedder-Policy');
//   next();
// });
//////////////////////
app.use('/', viewsRouter);
app.use('/v1', limiter);
app.use('/v1/api', ApiRoute);
app.use('/v1/user', UserRoute);
app.use('/v1/reviews', Review);
app.use('/v1/booking', booking);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't found this ${req.originalUrl} in my database `);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(
    new errorClass(`can't found this ${req.originalUrl} in my database`, 404)
  );
});

app.use(GlobalError);
module.exports = app;
