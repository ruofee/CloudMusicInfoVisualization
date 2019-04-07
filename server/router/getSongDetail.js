const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getSongDetail', async (req, res) => {
    const ids = req.query.ids;
    const data = {
      c: '[' + ids.map(id => ('{"id":' + id + '}')).join(',') + ']',
      ids: '[' + ids.join(',') + ']'
    };
    try {
      const response = await http({
        method: 'POST',
        url: 'weapi/v3/song/detail',
        data: weapi(data)
      });
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};