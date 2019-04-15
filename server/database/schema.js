const mongoose = require('mongoose');

exports.KeywordSchema = mongoose.Schema({
  ip: {
    default: '',
    type: String
  },
  date: {
    default: '',
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
    default: '',
    type: String
  },
  id: {
    default: '',
    type: String
  },
  username: {
    default: '',
    type: String
  },
  gender: {
    default: 0,
    type: Number
  },
  signature: {
    default: '',
    type: String
  },
  avatarUrl: {
    default: '',
    type: String
  },
});
