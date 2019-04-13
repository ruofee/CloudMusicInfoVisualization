const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getFans', async (req, res) => {
    const {id, offset, limit} = req.query;
    const data = {
      userId: id,
      offset: offset || 0,
      limit: limit || 30
    };
    try {
      const response = await http({
        method: 'POST',
        url: 'weapi/user/getfolloweds',
        data: weapi(data)
      });
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};