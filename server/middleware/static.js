const express = require('express');
const history = require('connect-history-api-fallback');
const compression = require('compression');
const path = require('path');

module.exports = app => {
  const options = {
    maxAge: 12 * 24 * 60 * 60 * 1000
  };
  app.use(history());
  app.use(compression());
  app.use(express.static(path.resolve(__dirname, '../../dist'), options));
};