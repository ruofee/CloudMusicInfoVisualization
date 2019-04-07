const express = require('express');
const router = new express.Router();
const {prefix} = require('../config');
const getUser = require('./getUser');
const getUserInfo = require('./getUserInfo');
const getPlayList = require('./getPlayList');
const getLikeList = require('./getLikeList');
const getArtist = require('./getArtist');
const getSongDetail = require('./getSongDetail');
const getCommentHot = require('./getCommentHot');


module.exports = app => {
  // 导入路由中间件

  app.use(prefix, router);

  // 根据用户名获取相似用户列表

  getUser(router);

  // 根据id获取用户详细信息

  getUserInfo(router);

  // 获取用户歌单列表

  getPlayList(router);

  // 根据歌手id获取详情

  getArtist(router);

  // 根据id获取用户喜欢的歌曲

  getLikeList(router);

  // 根据id获取歌曲详情

  getSongDetail(router);

  //根据id和type获取热评

  getCommentHot(router);
};