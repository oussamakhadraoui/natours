const Tour = require('../models/TourModals');
const catchHadler = require('../utily/catchHandler');
const appError = require('../utily/ErrorClass');
// const apiFeatures = require('../utily/apiFeatuires');
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require('./factoryControl');

const sharp = require('sharp');
const multer = require('multer');

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Please upload only image type!', 400), false);
  }
};
const storage = multer.memoryStorage();

exports.upload = multer({ storage: storage, fileFilter: filter }).fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
exports.resizeImages = catchHadler(async (req, res, next) => {
  if (!req.files) return next();
  //imageCover
  req.body.imageCover = `cover-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  //images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const fileName = `images-${req.params.id}-${Date.now()}-${
        index + 1
      }.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);
      req.body.images.push(fileName);
    })
  );
  next();
});

exports.topcheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'price';
  req.query.sort = 'price';
  next();
};

exports.AllTours = getAll(Tour);
exports.newTour = createOne(Tour);
exports.DeleteTour = deleteOne(Tour);
exports.UpdateTour = updateOne(Tour);
exports.OneTour = getOne(Tour, { path: 'reviews' });

exports.avgTour = catchHadler(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTour: { $sum: 1 },
        avgrate: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.monthly = catchHadler(async (req, res) => {
  const year = req.params.year * 1;
  const monthly = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numtours: { $sum: 1 },
        name: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $sort: { numtours: -1 },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      monthly,
    },
  });
});

exports.withinTour = catchHadler(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(new appError('write a provide lat,lng', 400));
  }
  let rad = 0;
  unit === 'mi' ? (rad = distance / 3963) : (rad = distance / 6378);
  const tour = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], rad],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tour.length,
    data: { data: tour },
  });
});

exports.getDistance = catchHadler(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(new appError('write a provide lat,lng', 400));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const tour = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { name: 1, distance: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { data: tour },
  });
});

// exports.DeleteTour = catchHadler(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(
//       new appError(
//         `there is no math for #### ${req.params.id} #### in our database`,
//         404
//       )
//     );
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
// exports.newTour = catchHadler(async (req, res) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });
// exports.UpdateTour = catchHadler(async (req, res) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true, //========> when u upadate a tour the validation must be respêcted
//   });
//   if (!tour) {
//     return next(
//       new appError(
//         `there is no math for #### ${req.params.id} #### in our database`,
//         404
//       )
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.OneTour = catchHadler(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(
//       new appError(
//         `there is no math for #### ${req.params.id} #### in our database`,
//         404
//       )
//     );
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });

// exports.AllTours = catchHadler(async (req, res) => {
//   const demand = new apiFeatures(Tour.find(), req.query)
//     .filtre()
//     .sorting()
//     .limit()
//     .select();
//   const tours = await demand.query;
//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });
