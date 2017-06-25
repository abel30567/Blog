module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const devConfig = {
  MONGO_URL: 'mongodb://localhost/nodejsrestapi-dev',
  JWT_SECRET: 'imarkettech'
};

const testConfig = {
  MONGO_URL: 'mongodb://localhost/nodejsrestapi-test'
};

const prodConfig = {
  MONGO_URL: 'mongodb://localhost/nodejsrestapi-prod'
};

const defaultConfig = {
  PORT: process.env.PORT || 3000
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

exports.default = Object.assign({}, defaultConfig, envConfig(process.env.NODE_ENV));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = __webpack_require__(18);

var _validator2 = _interopRequireDefault(_validator);

var _bcryptNodejs = __webpack_require__(19);

var _jsonwebtoken = __webpack_require__(20);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = __webpack_require__(5);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return _validator2.default.isEmail(email);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'LastName is required!'],
    trim: true
  },
  userName: {
    type: String,
    required: [true, 'UserName is required!'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [6, 'Password need to be longer!'],
    validate: {
      validator(password) {
        return _user.passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password!'
    }
  }
});
// Before saving the password to the database we want to encrypt the password for security reasons
UserSchema.pre('save', function (next) {
  // we want the user to be able to change his password so the line below allows the new password to be hashed
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    // new password going to be new password encrypted
    return next();
  }
});

// password is the password user types

UserSchema.methods = {
  _hashPassword(password) {
    return (0, _bcryptNodejs.hashSync)(password);
  },
  authenticateUser(password) {
    return (0, _bcryptNodejs.compareSync)(password, this.password);
    // hashSync(password) === this.password,
    // password comes from the front end and this.password is the object's stored password
  },
  createToken() {
    return _jsonwebtoken2.default.sign({
      _id: this._id
    }, _constants2.default.JWT_SECRET);
  },
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `JWT ${this.createToken()}`
    };
  }
};

exports.default = _mongoose2.default.model('User', UserSchema);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordReg = undefined;

var _joi = __webpack_require__(21);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passwordReg = exports.passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

exports.default = {
  signup: {
    email: _joi2.default.string().email().required(),
    password: _joi2.default.string().regex(passwordReg).required(),
    firstName: _joi2.default.string().required(),
    lastName: _joi2.default.string().required(),
    userName: _joi2.default.string().required()
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authJwt = exports.authLocal = undefined;

var _passport = __webpack_require__(3);

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = __webpack_require__(22);

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = __webpack_require__(23);

var _user = __webpack_require__(4);

var _user2 = _interopRequireDefault(_user);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const localOpts = {
  usernameField: 'email' // this is because of the way passport is set up
};

// Local Strategy
const localStrategy = new _passportLocal2.default(localOpts, (() => {
  var _ref = _asyncToGenerator(function* (email, password, done) {
    try {
      const user = yield _user2.default.findOne({ email });

      console.log(email, password);
      console.log('-------------------');
      console.log(user);

      // we are seeing if an email has been stored in DB to authorize access
      if (!user) {
        // if there is no user email in DB they can't log in
        return done(null, false);
      } else if (!user.authenticateUser(password)) {
        // if the typed password is not the user's password, they cant log in
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

// JWT Strategy

const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeader('authorization'),
  secretOrKey: _constants2.default.JWT_SECRET
};
// Payload is the data coming from the JWT
const jwtStrategy = new _passportJwt.Strategy(jwtOpts, (() => {
  var _ref2 = _asyncToGenerator(function* (payload, done) {
    try {
      // We are using ID because we are going to place the user's ID in the payload
      const user = yield _user2.default.findById(payload._id);

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  });

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})());

_passport2.default.use(localStrategy);
_passport2.default.use(jwtStrategy);

// Authentication middlewares
const authLocal = exports.authLocal = _passport2.default.authenticate('local', { session: false });
const authJwt = exports.authJwt = _passport2.default.authenticate('jwt', { session: false });

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

__webpack_require__(8);

var _middleware = __webpack_require__(9);

var _middleware2 = _interopRequireDefault(_middleware);

var _modules = __webpack_require__(14);

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)(); /* eslint-disable no-console */


(0, _middleware2.default)(app);

// Routes

app.get('/', (req, res) => {
  res.send('Hello  World');
});

// Setting up the API
(0, _modules2.default)(app);

// Port set up
app.listen(_constants2.default.PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`Server running on port: ${_constants2.default.PORT}
        ---------------
        Running on ${process.env.NODE_ENV}
        --------------
        Have fun bro!!
        `);
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Remove the warning with Promise
/* eslint-disable no-console */
_mongoose2.default.Promise = global.Promise;

// Connect the DB with the URL provided

try {
  _mongoose2.default.connect(_constants2.default.MONGO_URL);
} catch (err) {
  _mongoose2.default.createConnection(_constants2.default.MONGO_URL);
}

_mongoose2.default.connection.once('open', () => console.log('MongoDB Running')).on('error', e => {
  throw e;
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morgan = __webpack_require__(10);

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = __webpack_require__(11);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = __webpack_require__(12);

var _compression2 = _interopRequireDefault(_compression);

var _helmet = __webpack_require__(13);

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = __webpack_require__(3);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

exports.default = app => {
  if (isProd) {
    app.use((0, _compression2.default)());
    app.use((0, _helmet2.default)());
    app.use(_passport2.default.initialize());
  }
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  if (isDev) {
    app.use((0, _morgan2.default)('dev'));
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = __webpack_require__(15);

var _user2 = _interopRequireDefault(_user);

var _auth = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = app => {
  app.use('/api/v1/users', _user2.default);
  app.get('/hello', _auth.authJwt, (req, res) => {
    res.send('This is a private route!');
  });
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(16);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _user = __webpack_require__(17);

var userController = _interopRequireWildcard(_user);

var _user2 = __webpack_require__(5);

var _user3 = _interopRequireDefault(_user2);

var _auth = __webpack_require__(6);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.post('/signup', (0, _expressValidation2.default)(_user3.default.signup), userController.signUp);
routes.post('/login', _auth.authLocal, userController.login);

exports.default = routes;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("express-validation");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = undefined;

let signUp = exports.signUp = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    try {
      const user = yield _user2.default.create(req.body);
      return res.status(201).json(user);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.login = login;

var _user = __webpack_require__(4);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function login(req, res, next) {
  res.status(200).json(req.user);
  // passport puts the user as a request, then we create a JWT token to send to the front

  return next();
}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ })
/******/ ]);