const http = require('../http');
const cheerio = require('cheerio');
const {weapi} = require('../util');
const {getIdForHref} = require('../util/regExp');

module.exports = router => {
  router.get('/getLikeList', async (req, res) => {
    const id = req.query.id;
    try {
      const test = await http({
        method: 'GET',
        url: 'likelist',
        params: {
          id
        }
      });
      const response = await http({
        method: 'GET',
        url: 'playlist',
        params: {
          id
        }
      });
      const $ = cheerio.load(response.data);
      const likeList = [];
      $('#song-list-pre-cache ul li a').each(function(i) {
        const ele = $(this);
        likeList.push({
          title: ele.text(),
          id: ele.attr('href').match(getIdForHref)[1]
        });
      });
      res.status(200).send(likeList);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};