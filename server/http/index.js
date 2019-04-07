const axios = require('axios');
const queryString = require('querystring');
const {baseURL} = require('../config');

// axios.defaults.timeout = 5000
axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Referer'] = 'https://music.163.com';

axios.interceptors.request.use(res => {
  return res
}, err => {
  return Promise.reject(err)
});

axios.interceptors.response.use(res => {
  return res
}, err => {
  return Promise.reject(err)
});

module.exports = obj => {
  const {method, url, data, params} = obj;
  if (method.toUpperCase() === 'POST') {
    return axios({
      method,
      url,
      data: queryString.stringify(data)
    });
  }
  return axios({
    method,
    url,
    params
  });
};