const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Desc: {
    type: String
  },
  address: {
    type: String,
  },
  profilePhotoLocation: {
    type: String,
  }, 
}, {timestamps: true});

const News = mongoose.model('News', NewsSchema);

module.exports = { NewsSchema, News };
