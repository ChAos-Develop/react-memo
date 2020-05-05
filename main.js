"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpack = _interopRequireDefault(require("webpack"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 3000;
var devPort = 4000;
var contentsPath = process.env.NODE_ENV === 'production' ? 'build' : 'public';
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])('dev'));
app.use(_bodyParser["default"].json());
/* mongodb connection */

var db = _mongoose["default"].connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongodb server');
}); // mongoose.connect('mongodb://username:password@host:port/database=');

_mongoose["default"].connect('mongodb://localhost/codelab', {
  authSource: 'admin',
  user: 'chaos',
  pass: 'funkyworld#33',
  useNewUrlParser: true,
  useUnifiedTopology: true
});
/* use session */


app.use((0, _expressSession["default"])({
  secret: 'CodeLab1$1$234',
  resave: false,
  saveUninitialized: true
}));
app.use('/', _express["default"]["static"](_path["default"].join(__dirname, "../".concat(contentsPath))));
app.use('/api', _routes["default"]);
/* support client-side routing */

app.get('*', function (req, res) {
  res.sendFile(_path["default"].resolve(__dirname, "../".concat(contentsPath, "/index.html")));
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broken!');
});
app.listen(port, function () {
  console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');

  var config = require('../webpack.dev.config');

  var compiler = (0, _webpack["default"])(config);
  var devServer = new _webpackDevServer["default"](compiler, config.devServer); //const devServer = new WebpackDevServer(webpack(config.devServer), {});

  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', port);
  });
}