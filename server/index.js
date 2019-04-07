const express = require('express');
const app = express();
const route = require('./router');
const cors = require('./middleware/cors');
const parser = require('./middleware/parser');
const listen = require('./middleware/listen');

parser(app);
cors(app);
route(app);
listen(app);
