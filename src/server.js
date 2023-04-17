const express = require('express');
const { default: AdminBro } = require('admin-bro');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const options = require('./admin.options');
const buildAdminRouter = require('./admin.router');

const app = express();
const port = 3000;

const newsRouter = require('./news/news.route');
const prayTimeRouter = require('./prayTime/prayTime.route');
const authRouter = require('./users/auth/auth');
const userRoute = require('./users/user.route');


const run = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,})
    .then(() => console.log("DB Connection successfull!"))
    .catch((err) => console.log(err));

  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);

  app.use(admin.options.rootPath, router);
  app.use(express.json());
  app.use('/news', newsRouter);
  app.use('/users', userRoute);
  app.use('/prayTime', prayTimeRouter);
  app.use('/auth', authRouter);
  app.use('/uploads', express.static('uploads'));


  app.listen(port, () => console.log(
    `Example app listening at http://localhost:${port}`,
  ));
};


module.exports = run;