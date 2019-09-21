const express = require('express');
const app = express();
const route = require('./router');
const static = require('./middleware/static');
const cors = require('./middleware/cors');
const parser = require('./middleware/parser');
const listen = require('./middleware/listen');

static(app);
parser(app);
cors(app);
route(app);
listen(app);
