const day = require('dayjs');
const {weapi} = require('../util');
const http = require('../http');
const DB = require('../database');
const getIP = require('../util/getIP');
const {dateFormat} = require('../database/config');

module.exports = router => {
  router.get('/getUserInfo', async (req, res) => {
    const id = req.query.id;
    try {
      const response = await http({
        method: 'POST',
        url: `weapi/v1/user/detail/${id}`,
        data: weapi({})
      });
      const result = response.data;
      try {
        const {nickname, gender, signature, avatarUrl} = result.profile;
        const user = new DB.User({
          username: nickname,
          gender,
          signature,
          avatarUrl,
          id,
          ip: getIP(req),
          date: day().format(dateFormat)
        });
        await user.save();
      } catch(err) {
        throw new Error(err.message);
      }
      res.status(200).send(result);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};