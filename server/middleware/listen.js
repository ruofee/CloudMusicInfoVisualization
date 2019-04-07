const {port} = require('../config');

module.exports = app => {
  app.listen(port, () => {
    console.log(`服务器已经开启, 端口为: ${port}`);
  });
};