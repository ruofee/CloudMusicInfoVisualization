const {weapi} = require('../util');
const http = require('../http');
const DB = require('../database');
const getIP = require('../util/getIP');

module.exports = router => {
  router.get('/getUser', async (req, res) => {
    const {name, limit, page} = req.query;
    const keyword = new DB.Keyword({
      ip: getIP(req),
      keyword: name
    });
    try {
      await keyword.save();
    } catch(err) {
      throw new Error(err.message);
    }
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