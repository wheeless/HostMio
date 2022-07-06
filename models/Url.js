const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  date: { type: Date, default: Date.now },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
  },
  oldExpireAt: {
    type: Date,
  },
  expireRefresh: {
    type: Boolean,
    default: false,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 1000,
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
  doesNotExpire: {
    type: Boolean,
    default: false,
  },
});

urlSchema.plugin(mongoosePaginate);

const urlModel = mongoose.model('Url', urlSchema);

const options = {
  page: 2,
  limit: 10,
  pagination: true,
  collation: {
    locale: 'en',
  },
};

urlModel.paginate({}).then({});

module.exports = urlModel;
