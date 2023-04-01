require('dotenv').config();
const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('data exist££££££££££££££££££'));

const port = process.env.PORT.trim() || 8000;
const server = app.listen(port, () => {
  console.log('server is on .....');
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection we gonna shut down baby.... :P');
  server.close(() => {
    process.exit(1);
  });
});
