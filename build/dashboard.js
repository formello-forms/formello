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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/dashboard.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");

var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "./src/dashboard.js":
/*!**************************!*\
  !*** ./src/dashboard.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _dashboard_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dashboard.scss */ "./src/dashboard.scss");
/* harmony import */ var _dashboard_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_dashboard_scss__WEBPACK_IMPORTED_MODULE_8__);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * WordPress dependencies
 */
var __ = wp.i18n.__;
var _wp$components = wp.components,
    BaseControl = _wp$components.BaseControl,
    Button = _wp$components.Button,
    PanelBody = _wp$components.PanelBody,
    PanelRow = _wp$components.PanelRow,
    Placeholder = _wp$components.Placeholder,
    Spinner = _wp$components.Spinner,
    TextControl = _wp$components.TextControl,
    SelectControl = _wp$components.SelectControl,
    RadioControl = _wp$components.RadioControl,
    TabPanel = _wp$components.TabPanel;
var _wp$element = wp.element,
    render = _wp$element.render,
    Component = _wp$element.Component,
    Fragment = _wp$element.Fragment;
var _wp = wp,
    apiFetch = _wp.apiFetch;
var applyFilters = wp.hooks.applyFilters;
/**
 * Internal dependencies
 */



var App = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(App, _Component);

  var _super = _createSuper(App);

  function App() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, App);

    _this = _super.apply(this, arguments);
    _this.state = {
      isAPILoaded: false,
      isAPISaving: false,
      isRegeneratingCSS: false,
      settings: formelloSettings.settings
    };
    _this.getSetting = _this.getSetting.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.updateSettings = _this.updateSettings.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isAPILoaded: true
      });
    }
  }, {
    key: "getSetting",
    value: function getSetting(group, name, defaultVal) {
      var result = defaultVal;

      if ('undefined' !== typeof this.state.settings[group][name]) {
        result = this.state.settings[group][name];
      }

      return result;
    }
  }, {
    key: "updateSettings",
    value: function updateSettings(e) {
      var _this2 = this;

      this.setState({
        isAPISaving: true
      });
      var message = e.target.nextElementSibling;
      apiFetch({
        path: '/formello/v1/settings',
        method: 'POST',
        data: {
          settings: this.state.settings
        }
      }).then(function (result) {
        _this2.setState({
          isAPISaving: false
        });

        message.classList.add('formello-action-message--show');
        message.textContent = result.response;

        if (!result.success || !result.response) {
          message.classList.add('formello-action-message--error');
        } else {
          setTimeout(function () {
            message.classList.remove('formello-action-message--show');
          }, 3000);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (!this.state.isAPILoaded) {
        return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Placeholder, {
          className: "formello-settings-placeholder"
        }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null));
      }

      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Fragment, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: true,
        title: __('Google ReCaptcha', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, {
        className: "formello-css-print-method"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(RadioControl, {
        label: "ReCaptcha type",
        help: "The type of the current user",
        selected: this.getSetting('recaptcha', 'version'),
        options: [{
          label: 'ReCaptcha v2 checkbox',
          value: '1'
        }, //{ label: 'ReCaptcha v2 invisible', value: 'uno' },
        {
          label: 'ReCaptcha v3 invisible',
          value: '3'
        }],
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              recaptcha: _objectSpread(_objectSpread({}, _this3.state.settings.recaptcha), {}, {
                version: value
              })
            })
          });
        }
      })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        help: __('Sync our responsive preview controls with the editor responsive previews.', 'formello'),
        value: this.getSetting('recaptcha', 'site_key'),
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              recaptcha: _objectSpread(_objectSpread({}, _this3.state.settings.recaptcha), {}, {
                site_key: value
              })
            })
          });
        }
      })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Secret Key'),
        help: __('Sync our responsive preview controls with the editor responsive previews.', 'formello'),
        value: this.getSetting('recaptcha', 'secret_key'),
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              recaptcha: _objectSpread(_objectSpread({}, _this3.state.settings.recaptcha), {}, {
                secret_key: value
              })
            })
          });
        }
      })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Threshold'),
        help: __('Sync our responsive preview controls with the editor responsive previews.', 'formello'),
        value: this.getSetting('recaptcha', 'threshold'),
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              recaptcha: _objectSpread(_objectSpread({}, _this3.state.settings.recaptcha), {}, {
                threshold: value
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: false,
        title: __('Missing values', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Default'),
        value: this.state.settings.validation_messages.missingValue.default,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                missingValue: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.missingValue), {}, {
                  default: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Checkbox'),
        value: this.state.settings.validation_messages.missingValue.checkbox,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                missingValue: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.missingValue), {}, {
                  checkbox: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Radio'),
        value: this.state.settings.validation_messages.missingValue.radio,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                missingValue: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.missingValue), {}, {
                  radio: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Select'),
        value: this.state.settings.validation_messages.missingValue.select,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                missingValue: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.missingValue), {}, {
                  select: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Select multiple'),
        value: this.state.settings.validation_messages.missingValue['select-multiple'],
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                missingValue: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.missingValue), {}, {
                  'select-multiple': value
                })
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: false,
        title: __('Pattern mismatch', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.email,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  email: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.url,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  url: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.number,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  number: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.color,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  color: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.date,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  date: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.time,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  time: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.month,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  month: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.patternMismatch.default,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                patternMismatch: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.patternMismatch), {}, {
                  default: value
                })
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: false,
        title: __('Out of Range', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.outOfRange.over,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                outOfRange: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.outOfRange), {}, {
                  over: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.outOfRange.under,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                outOfRange: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.outOfRange), {}, {
                  under: value
                })
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: false,
        title: __('Wrong Length', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.wrongLength.over,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                wrongLength: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.wrongLength), {}, {
                  over: value
                })
              })
            })
          });
        }
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.validation_messages.wrongLength.under,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              validation_messages: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages), {}, {
                wrongLength: _objectSpread(_objectSpread({}, _this3.state.settings.validation_messages.wrongLength), {}, {
                  under: value
                })
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-settings-main"
      }, applyFilters('formello.dashboard.beforeSettings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelBody, {
        initialOpen: false,
        title: __('MailChimp Api Key', 'formello')
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-dashboard-panel-row-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(PanelRow, null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(TextControl, {
        label: __('Site Key'),
        value: this.state.settings.integrations.mailchimp.key,
        onChange: function onChange(value) {
          _this3.setState({
            settings: _objectSpread(_objectSpread({}, _this3.state.settings), {}, {
              integrations: _objectSpread(_objectSpread({}, _this3.state.settings.integrations), {}, {
                mailchimp: _objectSpread(_objectSpread({}, _this3.state.settings.integrations.mailchimp), {}, {
                  key: value
                })
              })
            })
          });
        }
      })), applyFilters('formello.dashboard.settings', '', this), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("div", {
        className: "formello-action-button"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Button, {
        isPrimary: true,
        disabled: this.state.isAPISaving,
        onClick: function onClick(e) {
          return _this3.updateSettings(e);
        }
      }, this.state.isAPISaving && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(Spinner, null), !this.state.isAPISaving && __('Save')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])("span", {
        className: "formello-action-message"
      })))), applyFilters('formello.dashboard.afterSettings', '', this)));
    }
  }]);

  return App;
}(Component);

window.addEventListener('DOMContentLoaded', function () {
  render(Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__["createElement"])(App, null), document.getElementById('formello-block-default-settings'));
});

/***/ }),

/***/ "./src/dashboard.scss":
/*!****************************!*\
  !*** ./src/dashboard.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["element"]; }());

/***/ })

/******/ });
//# sourceMappingURL=dashboard.js.map