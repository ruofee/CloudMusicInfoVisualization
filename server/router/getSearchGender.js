const DB = require('../database');

module.exports = router => {
  router.get('/getSearchGender', async (req, res) => {
    const data = {
      man: 0,
      woman: 0,
      other: 0
    };
    try {
      const users = await DB.User.find();
      if (users.length) {
        const genderMap = {
          0: 'other',
          1: 'man',
          2: 'woman'
        };
        users.forEach(user => {
          const gender = user.gender;
          const type = genderMap[gender];
          if (type) {
            data[type]++;
          }
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