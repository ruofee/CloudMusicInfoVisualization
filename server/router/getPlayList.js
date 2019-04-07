const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getPlayList', async (req, res) => {
    const {id, limit, page} = req.query;
    const _limit = limit || 30;
    const data = {
      uid: id,
      limit: _limit,
      offset: page ? (page - 1) * _limit : 0,
      csrf_token: ''
    };
    try {
      const response = await http({
        method: 'POST',
        url: 'weapi/user/playlist',
        data: weapi(data)
      });
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};