const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const AdminNews = require('./news/news.admin');


/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  resources: [AdminNews],
};

module.exports = options;
