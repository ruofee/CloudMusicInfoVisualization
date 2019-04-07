const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getUser', async (req, res) => {
    const {name, limit, page} = req.query;
    _limit = limit || 30;
    const data = {
      s: name,
      type: 1002,
      limit: _limit,
      offset: page ? (page - 1) * _limit : 0,
      csrf_token: ''
    };
    try {
      const response = await http({
        method: 'POST',
        url: 'weapi/search/get',
        data: weapi(data)
      });
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};