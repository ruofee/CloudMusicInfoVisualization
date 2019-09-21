const DB = require('../database');
const day = require('dayjs');

module.exports = router => {
  router.get('/getSearchTrend', async (req, res) => {
    let data = {};
    try {
      const keywords = await DB.Keyword.find();
      const dateFormat = 'YYYY-MM-DD';
      if (keywords.length) {
        keywords.forEach(keyword => {
          const date = keyword.date;
          const formatDate = day(date).format(dateFormat);

          if (!data[formatDate]) {
            data[formatDate] = 1;
          }

          data[formatDate]++;
        });
      }
    } catch(err) {
      res.status(500).send(err.message);
    }
    try {
      res.status(200).send(data);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};