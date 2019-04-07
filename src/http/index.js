import axios from 'axios';
import {Notify} from 'vant';
import {baseURL} from './config';

axios.defaults.timeout = 5000
axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.default.withCredentials = true;

axios.interceptors.request.use(res => {
  return res
}, err => {
  Notify({
    message: err.message,
    background: '#fa1971'
  });
  return Promise.reject(err)
});

axios.interceptors.response.use(res => {
  return res
}, err => {
  Notify({
    message: err.message,
    background: '#fa1971'
  });
  return Promise.reject(err)
});

export default axios;