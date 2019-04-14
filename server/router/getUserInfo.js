const {weapi} = require('../util');
const http = require('../http');
const DB = require('../database');
const getIP = require('../util/getIP');

module.exports = router => {
  router.get('/getUserInfo', async (req, res) => {
    const id = req.query.id;
    try {
      const response = await http({
        method: 'POST',
        url: `weapi/v1/user/detail/${id}`,
        data: weapi({})
      });
      try {
        const user = new DB.User({
          username: response.data.profile.nickname,
          id,
          ip: getIP(req)
        });
        await user.save();
      } catch(err) {
        throw new Error(err.message);
      }
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};