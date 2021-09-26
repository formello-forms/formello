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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/frontend/frontend.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js":
/*!******************************************************************!*\
  !*** ./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! formbouncerjs v1.4.6 | (c) 2019 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/bouncer */
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||(function(e){"use strict";if("Element"in e){var t="classList",r="prototype",n=e.Element[r],a=Object,i=String[r].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[r].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1},l=function(e,t){this.name=e,this.code=DOMException[e],this.message=t},u=function(e,t){if(""===t)throw new l("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(t))throw new l("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(e,t)},s=function(e){for(var t=i.call(e.getAttribute("class")||""),r=t?t.split(/\s+/):[],n=0,a=r.length;n<a;n++)this.push(r[n]);this._updateClassName=function(){e.setAttribute("class",this.toString())}},c=s[r]=[],f=function(){return new s(this)};if(l[r]=Error[r],c.item=function(e){return this[e]||null},c.contains=function(e){return-1!==u(this,e+="")},c.add=function(){for(var e,t=arguments,r=0,n=t.length,a=!1;e=t[r]+"",-1===u(this,e)&&(this.push(e),a=!0),++r<n;);a&&this._updateClassName()},c.remove=function(){var e,t,r=arguments,n=0,a=r.length,i=!1;do{for(e=r[n]+"",t=u(this,e);-1!==t;)this.splice(t,1),i=!0,t=u(this,e)}while(++n<a);i&&this._updateClassName()},c.toggle=function(e,t){e+="";var r=this.contains(e),n=r?!0!==t&&"remove":!1!==t&&"add";return n&&this[n](e),!0===t||!1===t?t:!r},c.toString=function(){return this.join(" ")},a.defineProperty){var d={get:f,enumerable:!0,configurable:!0};try{a.defineProperty(n,t,d)}catch(e){void 0!==e.number&&-2146823252!==e.number||(d.enumerable=!1,a.defineProperty(n,t,d))}}else a[r].__defineGetter__&&n.__defineGetter__(t,f)}})(self),(function(){"use strict";var e=document.createElement("_");if(e.classList.add("c1","c2"),!e.classList.contains("c2")){var t=function(e){var n=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(e){var t,r=arguments.length;for(t=0;t<r;t++)e=arguments[t],n.call(this,e)}};t("add"),t("remove")}if(e.classList.toggle("c3",!1),e.classList.contains("c3")){var r=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(e,t){return 1 in arguments&&!this.contains(e)==!t?t:r.call(this,e)}}e=null})()),Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null}),(function(){if("function"==typeof window.CustomEvent)return;function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var r=document.createEvent("CustomEvent");return r.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),r}e.prototype=window.Event.prototype,window.CustomEvent=e})(),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),(function(e,t){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return t(e)}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined})("undefined"!=typeof global?global:"undefined"!=typeof window?window:this,(function(a){"use strict";var u={fieldClass:"error",errorClass:"error-message",fieldPrefix:"bouncer-field_",errorPrefix:"bouncer-error_",patterns:{email:/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,url:/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,number:/^(?:[-+]?[0-9]*[.,]?[0-9]+)$/,color:/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,date:/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,time:/^(?:(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]))$/,month:/^(?:(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])))$/},customValidations:{},messageAfterField:!0,messageCustom:"data-bouncer-message",messageTarget:"data-bouncer-target",messages:{missingValue:{checkbox:"This field is required.",radio:"Please select a value.",select:"Please select a value.","select-multiple":"Please select at least one value.",default:"Please fill out this field."},patternMismatch:{email:"Please enter a valid email address.",url:"Please enter a URL.",number:"Please enter a number",color:"Please match the following format: #rrggbb",date:"Please use the YYYY-MM-DD format",time:"Please use the 24-hour time format. Ex. 23:00",month:"Please use the YYYY-MM format",default:"Please match the requested format."},outOfRange:{over:"Please select a value that is no more than {max}.",under:"Please select a value that is no less than {min}."},wrongLength:{over:"Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.",under:"Please lengthen this text to {minLength} characters or more. You are currently using {length} characters."},fallback:"There was an error with this field."},disableSubmit:!1,emitEvents:!0},s=function(e,t){Array.prototype.forEach.call(e,t)},c=function(){var r={};return s(arguments,(function(e){for(var t in e){if(!e.hasOwnProperty(t))return;"[object Object]"===Object.prototype.toString.call(e[t])?r[t]=c(r[t],e[t]):r[t]=e[t]}})),r},f=function(e,t,r){if("function"==typeof a.CustomEvent){var n=new CustomEvent(t,{bubbles:!0,detail:r||{}});e.dispatchEvent(n)}},d=function(e,t){return{missingValue:(function(e){if(!e.hasAttribute("required"))return!1;if("checkbox"===e.type)return!e.checked;var t=e.value.length;return"radio"===e.type&&(t=Array.prototype.filter.call(e.form.querySelectorAll('[name="'+m(e.name)+'"]'),(function(e){return e.checked})).length),t<1})(e),patternMismatch:(r=e,n=t,a=r.getAttribute("pattern"),!(!(a=a?new RegExp("^(?:"+a+")$"):n.patterns[r.type])||!r.value||r.value.length<1||r.value.match(a))),outOfRange:(function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("max"),r=e.getAttribute("min"),n=parseFloat(e.value);return t&&t<n?"over":!!(r&&n<r)&&"under"})(e),wrongLength:(function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("maxlength"),r=e.getAttribute("minlength"),n=e.value.length;return t&&t<n?"over":!!(r&&n<r)&&"under"})(e)};var r,n,a},m=function(e){for(var t,r=String(e),n=r.length,a=-1,i="",o=r.charCodeAt(0);++a<n;){if(0===(t=r.charCodeAt(a)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");1<=t&&t<=31||127==t||0===a&&48<=t&&t<=57||1===a&&48<=t&&t<=57&&45===o?i+="\\"+t.toString(16)+" ":i+=128<=t||45===t||95===t||48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122?r.charAt(a):"\\"+r.charAt(a)}return i},h=function(e,t,r){var n=e.name?e.name:e.id;return!n&&r&&(n=t.fieldPrefix+Math.floor(999*Math.random()),e.id=n),"checkbox"===e.type&&(n+="_"+(e.value||e.id)),n},x=function(e,t){var r=document.createElement("div");r.className=t.errorClass,r.id=t.errorPrefix+h(e,t,!0);var n=(function(e,t,r){var n=e.getAttribute(r.messageTarget);if(n){var a=e.form.querySelector(n);if(a)return a.firstChild||a.appendChild(document.createTextNode(""))}return r.messageAfterField?(t.nextSibling||t.parentNode.appendChild(document.createTextNode("")),t.nextSibling):t})(e,(function(e){if("radio"===e.type&&e.name){var t=e.form.querySelectorAll('[name="'+m(e.name)+'"]');e=t[t.length-1]}"radio"!==e.type&&"checkbox"!==e.type||(e=e.closest("label")||e.form.querySelector('[for="'+e.id+'"]')||e);return e})(e),t);return n.parentNode.insertBefore(r,n),r},v=function(e,t,r){e.classList.add(r.fieldClass),e.setAttribute("aria-describedby",t.id),e.setAttribute("aria-invalid",!0)},g=function(e,t,r){var n,a,i,o=e.form.querySelector("#"+m(r.errorPrefix+h(e,r)))||x(e,r),l=(function(e,t,r){var n=r.messages;if(t.missingValue)return n.missingValue[e.type]||n.missingValue.default;if(t.outOfRange)return n.outOfRange[t.outOfRange].replace("{max}",e.getAttribute("max")).replace("{min}",e.getAttribute("min")).replace("{length}",e.value.length);if(t.wrongLength)return n.wrongLength[t.wrongLength].replace("{maxLength}",e.getAttribute("maxlength")).replace("{minLength}",e.getAttribute("minlength")).replace("{length}",e.value.length);if(t.patternMismatch){var a=e.getAttribute(r.messageCustom);return a||n.patternMismatch[e.type]||n.patternMismatch.default}for(var i in r.customValidations)if(r.customValidations.hasOwnProperty(i)&&t[i]&&n[i])return n[i];return n.fallback})(e,t,r);o.textContent="function"==typeof l?l(e,r):l,a=o,i=r,"radio"===(n=e).type&&n.name&&Array.prototype.forEach.call(document.querySelectorAll('[name="'+n.name+'"]'),(function(e){v(e,a,i)})),v(n,a,i),r.emitEvents&&f(e,"bouncerShowError",{errors:t})},i=function(e,t){e.classList.remove(t.fieldClass),e.removeAttribute("aria-describedby"),e.removeAttribute("aria-invalid")},p=function(e,t){var r,n,a=e.form.querySelector("#"+m(t.errorPrefix+h(e,t)));a&&(a.parentNode.removeChild(a),n=t,"radio"===(r=e).type&&r.name?Array.prototype.forEach.call(document.querySelectorAll('[name="'+r.name+'"]'),(function(e){i(e,n)})):i(r,n),t.emitEvents&&f(e,"bouncerRemoveError"))};return function(n,e){var l,r={};r.validate=function(e,t){if(!e.disabled&&!e.readOnly&&"reset"!==e.type&&"submit"!==e.type&&"button"!==e.type){var r,n,a,i=c(l,t||{}),o=(a=d(r=e,n=i),{valid:!(function(e){for(var t in e)if(e[t])return!0;return!1})(a=(function(e,t,r,n){for(var a in r)r.hasOwnProperty(a)&&(t[a]=r[a](e,n));return t})(r,a,n.customValidations,n)),errors:a});if(!o.valid)return g(e,o.errors,i),o;p(e,i)}},r.validateAll=function(e){return Array.prototype.filter.call(e.querySelectorAll("input, select, textarea"),(function(e){var t=r.validate(e);return t&&!t.valid}))};var a=function(e){e.target.form&&e.target.form.matches(n)&&r.validate(e.target)},i=function(e){e.target.form&&e.target.form.matches(n)&&e.target.classList.contains(l.fieldClass)&&r.validate(e.target)},o=function(e){if(e.target.matches(n)){e.preventDefault();var t=r.validateAll(e.target);if(0<t.length)return t[0].focus(),void f(e.target,"bouncerFormInvalid",{errors:t});l.disableSubmit||e.target.submit(),l.emitEvents&&f(e.target,"bouncerFormValid")}};r.destroy=function(){var e,t,r;document.removeEventListener("blur",a,!0),document.removeEventListener("input",i,!1),document.removeEventListener("click",i,!1),document.removeEventListener("submit",o,!1),e=n,t=l,s(document.querySelectorAll(e),(function(e){s(e.querySelectorAll("input, select, textarea"),(function(e){p(e,t)}))})),r=n,s(document.querySelectorAll(r),(function(e){e.removeAttribute("novalidate")})),l.emitEvents&&f(document,"bouncerDestroyed",{settings:l}),l=null};var t;return l=c(u,e||{}),t=n,s(document.querySelectorAll(t),(function(e){e.setAttribute("novalidate",!0)})),document.addEventListener("blur",a,!0),document.addEventListener("input",i,!1),document.addEventListener("click",i,!1),document.addEventListener("submit",o,!1),l.emitEvents&&f(document,"bouncerInitialized",{settings:l}),r}}));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/frontend/events.js":
/*!********************************!*\
  !*** ./src/frontend/events.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var listeners = {};

function trigger(event, args) {
  listeners[event] = listeners[event] || [];
  listeners[event].forEach(function (f) {
    return f.apply(null, args);
  });
}

function on(event, func) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(func);
}

function off(event, func) {
  listeners[event] = listeners[event] || [];
  listeners[event] = listeners[event].filter(function (f) {
    return f !== func;
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  trigger: trigger,
  on: on,
  off: off
});

/***/ }),

/***/ "./src/frontend/form-loading-indicator.js":
/*!************************************************!*\
  !*** ./src/frontend/form-loading-indicator.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Loader(formElement) {
  this.form = formElement;
  this.button = formElement.querySelector('input[type="submit"], button[type="submit"]');

  if (this.button) {
    this.originalButton = this.button.cloneNode(true);
  }
}

function toggle(button, toggle) {
  if (button.classList.contains('ld-over')) {
    button.style.width = button.getBoundingClientRect().width + 'px';
    button.style.height = button.getBoundingClientRect().height + 'px';
    button.children[0].style.display = toggle;
  }
}

Loader.prototype.start = function () {
  if (this.button) {
    this.button.disabled = true;
    this.button.classList.add("running");
    toggle(this.button, 'none');
  }
};

Loader.prototype.stop = function () {
  toggle(this.button, 'block');

  if (this.button) {
    this.button.disabled = false;
    this.button.classList.remove("running");
    this.button = this.originalButton;
  } else {
    this.form.style.opacity = '';
  }
};

module.exports = Loader;

/***/ }),

/***/ "./src/frontend/frontend.js":
/*!**********************************!*\
  !*** ./src/frontend/frontend.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var formbouncerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! formbouncerjs */ "./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js");
/* harmony import */ var formbouncerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(formbouncerjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events.js */ "./src/frontend/events.js");



var Loader = __webpack_require__(/*! ./form-loading-indicator.js */ "./src/frontend/form-loading-indicator.js");

var vars = window.formello || {
  ajax_url: window.location.href
};

function cleanFormMessages(formEl) {
  var messageElements = formEl.parentNode.querySelectorAll('.formello-message');
  [].forEach.call(messageElements, function (el) {
    el.parentNode.removeChild(el);
  });
}

function addFormErrors(errors) {
  var listItem;
  var listElement = document.createElement('ul');

  for (var key in errors) {
    listItem = document.createElement('li');
    listItem.innerHTML = errors[key];
    listElement.appendChild(listItem);
  }

  return listElement;
}

function addFormMessage(formEl, message) {
  var messageDiv = formEl.querySelector('.formello-message');

  if (!messageDiv) {
    messageDiv = document.createElement('p');
    messageDiv.role = 'alert';
  }

  messageDiv.className = 'formello-message ' + message.type;
  messageDiv.innerHTML = message.text; // uses innerHTML because we allow some HTML strings in the message settings

  if (message.errors) {
    messageDiv.appendChild(addFormErrors(message.errors));
  }

  formEl.parentNode.insertBefore(messageDiv, formEl.nextSibling);
}

function handleSubmitEvents(e) {
  var formEl = e.target;

  if (formEl.className.indexOf('wp-block-formello-form') < 0) {
    return;
  } // always prevent default (because regular submit doesn't work for Formello)


  e.preventDefault();
  e.stopPropagation();
  validate(formEl); // here we perform captcha and other validation
}

function submitForm(formEl, token) {
  cleanFormMessages(formEl);
  emitEvent('submit', formEl);
  var formData = new FormData(formEl);

  if (token) {
    formData.append('g-recaptcha-response', token);
  }

  var request = new XMLHttpRequest();
  request.onreadystatechange = createRequestHandler(formEl);
  request.open('POST', vars.ajax_url, true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.send(formData);
  request = null;
}

function emitEvent(eventName, element) {
  // browser event API: formElement.on('formello-success', ..)
  element.dispatchEvent(new CustomEvent('formello-' + eventName)); // custom events API: formello.on('success', ..)

  _events_js__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(eventName, [element]);
}

function createRequestHandler(formEl) {
  var loader = new Loader(formEl);
  loader.start();
  return function () {
    // are we done?
    if (this.readyState === 4) {
      var response;
      loader.stop();

      if (this.status >= 200 && this.status < 400) {
        try {
          response = JSON.parse(this.responseText);
        } catch (error) {
          console.log('Formello: failed to parse AJAX response.\n\nError: "' + error + '"');
          return;
        }

        emitEvent('submitted', formEl);

        if (response.error) {
          emitEvent('error', formEl);
        } else {
          emitEvent('success', formEl);
        } // Show form message


        if (response.message) {
          addFormMessage(formEl, response.message);
          emitEvent('message', formEl);
        }

        if (response.debug) {
          console.log(response.debug);
        } // Should we hide form?


        if (response.hide_form) {
          formEl.style.display = 'none';
        } // Should we redirect?


        if (response.redirect_url) {
          window.location = response.redirect_url;
        } // clear form


        if (!response.message.errors) {
          formEl.reset();
        }
      } else {
        // Server error :(
        console.log(this.responseText);
      }
    }
  };
}

function validate(formEl) {
  // start a loader
  var loader = new Loader(formEl);
  loader.start(); // BouncerJs validation

  var errors = bouncer.validateAll(formEl);

  if (errors.length) {
    loader.stop(); //window.scrollTo(0, errors[0].offsetTop);

    errors[0].scrollIntoView({
      behaviour: "smooth",
      block: "end",
      inline: "nearest"
    });
    return;
  }

  var settings = formEl.dataset;

  if (!settings.recaptcha) {
    submitForm(formEl);
    return;
  }

  if (!formello.settings.recaptcha.site_key) {
    submitForm(formEl);
    return;
  }

  if (formello.settings.recaptcha.version == 3) {
    grecaptcha.ready(function () {
      grecaptcha.execute(formello.settings.recaptcha.site_key, {
        action: 'submit'
      }).then(function (token) {
        submitForm(formEl, token);
      });
    }, addFormMessage(formEl, {
      type: 'error',
      text: 'Invalid recaptcha'
    }), loader.stop());
  }

  if (formello.settings.recaptcha.version == 1) {
    submitForm(formEl);
  }
}

document.addEventListener('submit', handleSubmitEvents, false); // useCapture=false to ensure we bubble upwards (and thus can cancel propagation)

var bouncer = new formbouncerjs__WEBPACK_IMPORTED_MODULE_0___default.a('.wp-block-formello-form', {
  disableSubmit: true,
  messages: formello.settings.messages
}); // add recaptcha div to all formello buttons on page

window.formelloCallback = function () {
  var buttons = document.querySelectorAll('.wp-block-formello-button');

  for (var i = 0; i < buttons.length; i++) {
    var gReCaptcha = document.createElement('div');
    gReCaptcha.className = 'g-recaptcha';
    buttons[i].parentNode.appendChild(gReCaptcha);
    grecaptcha.render(gReCaptcha, {
      'sitekey': formello.settings.recaptcha.site_key
    });
  }
}; // check if the input date is supported


function checkDateInput() {
  var input = document.createElement('input');
  input.setAttribute('type', 'date');
  var notADateValue = 'not-a-date';
  input.setAttribute('value', notADateValue);
  return input.value !== notADateValue;
}

if (!checkDateInput()) {
  var script = document.createElement('script');

  script.onload = function () {
    var date = flatpickr(".formello-date", {});
    var time = flatpickr(".formello-time", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i"
    });
  };

  script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  document.head.appendChild(script); //or something of the likes

  var link = document.createElement("link");
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";
  document.getElementsByTagName("head")[0].appendChild(link);
}

console.log("formello loaded");

/***/ })

/******/ });
//# sourceMappingURL=frontend.js.map