require('dotenv').config();
const Tour = require('../../models/TourModals');
const User = require('../../models/userModal');
const Review = require('../../models/ReviewModal');
const mongoose = require('mongoose');
const fs = require('fs');
// dotenv.config({ path: './config.env' });
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('data exist'));

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`, 'utf-8')
);
const data1 = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/users.json`, 'utf-8')
);
const data2 = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/reviews.json`, 'utf-8')
);

const deleteDB = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Tour is deleted all');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
const fetchJSON = async () => {
  try {
    await Tour.create(data);
    await Review.create(data2);
    await User.create(data1, { validateBeforeSave: false });
    console.log('all data is up');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  fetchJSON();
} else if (process.argv[2] === '--delete') {
  deleteDB();
}
