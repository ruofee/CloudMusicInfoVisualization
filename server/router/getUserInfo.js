const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getUserInfo', async (req, res) => {
    const id = req.query.id;
    try {
      const response = await http({
        method: 'POST',
        url: `weapi/v1/user/detail/${id}`,
        data: weapi({})
      });
      res.status(200).send(response.data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};