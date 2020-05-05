"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _account = _interopRequireDefault(require("../models/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();
/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/


router.post('/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password; // CHECK USERNAME FORMAT

  var usernameRegex = /^[a-z0-9]+$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  }

  ; // CHECK PASS LENGTH

  if (password.length < 4 || typeof password !== 'string') {
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  } // CHECK USER EXISTANCE


  _account["default"].findOne({
    username: username
  }, function (err, exists) {
    if (err) throw err;

    if (exists) {
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 3
      });
    } // CREATE ACCOUNT


    var account = new _account["default"]({
      username: username,
      password: password
    });
    account.password = account.generateHash(account.password); // SAVE IN THE DATABASE

    account.save(function (err) {
      if (err) throw err;
      return res.json({
        success: true
      });
    });
  });
});
/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/

router.post('/signin', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (typeof password !== "string") {
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  } // FIND THE USER BY USERNAME


  _account["default"].findOne({
    username: username
  }, function (err, account) {
    if (err) throw err; // CHECK ACCOUNT EXISTANCY

    if (!account) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    } // CHECK WHTHER THE PASSWORD IS VALID


    if (!account.validateHash(password)) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    } // ALTER SESSION


    var session = req.session;
    session.loginInfo = {
      _id: account.id,
      username: account.username
    }; // RETURN SUCCESS

    return res.json({
      success: true
    });
  });
});
/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/

router.get('/getinfo', function (req, res) {
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(401).json({
      error: 1
    });
  }

  res.json({
    info: req.session.loginInfo
  });
});
/*
    SEARCH USER: GET /api/account/search/:username
*/

router.get('/search/:username', function (req, res) {
  // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
  var regex = new RegExp("^".concat(req.params.username)); // FIND THE USER BY USERNAME

  _account["default"].find({
    username: {
      $regex: regex
    }
  }, {
    _id: false,
    username: true
  }).limit(5).sort({
    username: 1
  }).exec(function (err, account) {
    if (err) throw err;
    res.json(account);
  });
});
router.get('/search', function (req, res) {
  res.json([]);
});
/*
    LOGOUT: POST /api/account/logout
*/

router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  return res.json({
    success: true
  });
});
var _default = router;
exports["default"] = _default;