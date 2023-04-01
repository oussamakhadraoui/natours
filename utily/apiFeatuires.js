class apiFeatures {
  constructor(query, queryString) {
    //queryString = req.query
    //query = Tour.find()
    this.query = query;
    this.queryString = queryString;
  }
  filtre() {
    const all = { ...this.queryString };
    const nouse = ['page', 'num', 'sort', 'fields', 'limit'];
    nouse.forEach((el) => delete all[el]);

    const matching = JSON.stringify(all).replace(
      /\b(gte|lte|lt|gt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(matching));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sorter = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sorter);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  select() {
    if (this.queryString.fields) {
      const selections = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(selections);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  limit() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = apiFeatures;
