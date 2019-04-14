const mongoose = require('mongoose');
const day = require('dayjs');
const {dateFormat} = require('./config');

exports.KeywordSchema = mongoose.Schema({
  ip: {
    default: '',
    type: String
  },
  date: {
    default: day().format(dateFormat),
    type: String
  },
  keyword: {
    default: '',
    type: String
  }
});

exports.UserSchema = mongoose.Schema({
  ip: {
    default: '',
    type: String
  },
  date: {
    default: day().format(dateFormat),
    type: String
  },
  id: {
    default: '',
    type: String
  },
  username: {
    default: '',
    type: String
  }
});
