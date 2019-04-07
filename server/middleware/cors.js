const cors = require('cors');

module.exports = app => {
  const options = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  };
  app.use(cors(options));
};