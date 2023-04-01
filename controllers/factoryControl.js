const appError = require('../utily/ErrorClass');
const catchHadler = require('../utily/catchHandler');
const apiFeatures = require('../utily/apiFeatuires');

exports.deleteOne = (modal) => {
  return catchHadler(async (req, res, next) => {
    const docs = await modal.findByIdAndDelete(req.params.id);
    if (!docs) {
      return next(
        new appError(`there is no math for this id in our database`, 404)
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

exports.createOne = (modal) => {
  return catchHadler(async (req, res, next) => {
    const docs = await modal.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        docs,
      },
    });
  });
};

exports.updateOne = (modal) => {
  return catchHadler(async (req, res) => {
    const docs = await modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, //========> when u upadate a docs the validation must be respêcted
    });
    if (!docs) {
      return next(
        new appError(`there is no math for this id in our database`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        docs,
      },
    });
  });
};
exports.getOne = (modal, populate) => {
  return catchHadler(async (req, res, next) => {
    let query = modal.findById(req.params.id);
    if (populate) query = query.populate(populate); // 'reviews';
    const docs = await query;
    if (!docs) {
      return next(
        new appError(`there is no math for this id in our database`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        docs: docs,
      },
    });
  });
};
exports.getAll = (modal) => {
  return catchHadler(async (req, res) => {
    let filtre = {};
    if (req.params.tourId) filtre = { tour: req.params.tourId };
    const demand = new apiFeatures(modal.find(filtre), req.query)
      .filtre()
      .sorting()
      .limit()
      .select();
    // const docs = await demand.query.explain();
    const docs = await demand.query;
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });
};
