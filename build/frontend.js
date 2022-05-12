/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/events.js":
/*!********************************!*\
  !*** ./src/frontend/events.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const listeners = {};

function trigger(event, args) {
  listeners[event] = listeners[event] || [];
  listeners[event].forEach(f => f.apply(null, args));
}

function on(event, func) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(func);
}

function off(event, func) {
  listeners[event] = listeners[event] || [];
  listeners[event] = listeners[event].filter(f => f !== func);
}

/* harmony default export */ __webpack_exports__["default"] = ({
  trigger,
  on,
  off
});

/***/ }),

/***/ "./src/frontend/form.js":
/*!******************************!*\
  !*** ./src/frontend/form.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Formello": function() { return /* binding */ Formello; }
/* harmony export */ });
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/frontend/events.js");


class Formello {
  constructor(element) {
    this.element = element; //this.element.addEventListener( 'submit', this.handleSubmit.bind(this), true )

    this.element.addEventListener('bouncerFormValid', this.handleSubmit.bind(this), true);
    this.init();
  }

  init() {
    this.reCaptcha();
    this.isRtfEnabled();
    this.addFlatpickr();
  }

  handleSubmit(e) {
    // always prevent default (because regular submit doesn't work for Formello)
    e.preventDefault();
    e.stopPropagation(); // Validate the field

    /*var bouncer = new Bouncer();
    var errors = bouncer.validateAll( this.element );
    	if( errors.length ){
    	errors[0].scrollIntoView({behaviour: "smooth", block: "end", inline: "nearest"});
    	return
    }*/

    if (this.enableRecaptcha) {
      this.reCaptchaToken();
      return;
    }

    this.submitForm();
  }

  submitForm(token) {
    this.showLoading();
    this.cleanMessage();
    this.emitEvent('submit');
    const formData = new FormData(this.element);

    if (token) {
      formData.append('g-recaptcha-response', token);
    }

    let request = new XMLHttpRequest();
    request.onreadystatechange = this.createRequestHandler(this.element);
    request.open('POST', formello.ajax_url, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send(formData);
    request = null;
  }

  emitEvent(eventName) {
    // browser event API: formElement.on('formello-success', ..)
    window.dispatchEvent(new CustomEvent('formello-' + eventName)); // custom events API: formello.on('success', ..)

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].trigger(eventName, [this.element]);
  }

  createRequestHandler(formEl) {
    const parent = this;
    return function () {
      // are we done?
      if (this.readyState === 4) {
        parent.showLoading();
        let response;

        if (this.status >= 200 && this.status < 400) {
          try {
            response = JSON.parse(this.responseText);
          } catch (error) {
            console.log('Formello: failed to parse AJAX response.\n\nError: "' + error + '"');
            return;
          }

          parent.emitEvent('submitted', this.element);

          if (response.errors.length) {
            parent.emitEvent('error', this.element);
          } else {
            parent.emitEvent('success', this.element);
          } // Show form message


          if (response.message) {
            parent.addMessage(response.message, response.errors, response.hide_form);
            parent.emitEvent('message', this.element);
          } // Should we hide form?


          if (response.hide_form) {
            parent.element.style.display = 'none';
          }

          if (response.debug) {
            parent.addDebug(response.debug);
            console.log(response.debug);
          } // Should we redirect?


          if (response.redirect_url) {
            window.location = response.redirect_url;
          } // clear form


          if (!response.message.errors) {
            parent.element.reset();
          }
        } else {
          // Server error :(
          console.log(response);
        }
      }
    };
  }

  reCaptcha() {
    var _formello$settings$re, _formello$settings$re2;

    const {
      recaptcha
    } = this.element.dataset;

    if (!JSON.parse(recaptcha)) {
      return;
    }

    let recaptchaUrl = 'https://www.google.com/recaptcha/api.js';
    const sitekey = (_formello$settings$re = formello.settings.reCaptcha) === null || _formello$settings$re === void 0 ? void 0 : _formello$settings$re.site_key;
    const version = (_formello$settings$re2 = formello.settings.reCaptcha) === null || _formello$settings$re2 === void 0 ? void 0 : _formello$settings$re2.version;
    const buttons = this.element.getElementsByTagName('button');

    if ('1' === version) {
      const recaptchaDiv = document.createElement('div');
      recaptchaDiv.classList.add('g-recaptcha');
      recaptchaDiv.setAttribute('data-sitekey', sitekey);
      this.element.insertBefore(recaptchaDiv, buttons[0]);
    } else {
      recaptchaUrl += '?render=' + sitekey;
      const recaptchaInput = document.createElement('input');
      recaptchaInput.type = 'hidden';
      recaptchaInput.name = 'g-recaptcha-response';
      recaptchaInput.classList.add('formello-g-recaptcha');
      this.element.appendChild(recaptchaInput);
    }

    if (sitekey && version) {
      this.enableRecaptcha = true;
      const script = document.createElement('script');
      script.src = recaptchaUrl;
      document.head.appendChild(script);
    }
  }

  reCaptchaToken() {
    grecaptcha.ready(() => {
      grecaptcha.execute(formello.settings.reCaptcha.site_key, {
        action: 'submit'
      }).then(token => {
        this.element.querySelector('.formello-g-recaptcha').value = token;
        this.submitForm();
      });
    });
  }

  addMessage(message, errors, hide) {
    const msg = this.element.querySelector('.formello-message');
    msg.classList.add(message.type);
    msg.innerHTML = '<p>' + message.text + '</p>';

    if (errors.length) {
      const ul = document.createElement('ul');
      msg.appendChild(ul);
      errors.forEach(function (item) {
        const li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
      });
    }

    if (hide) {
      this.element.insertAdjacentElement('afterend', msg);
    }
  }

  addDebug(debug) {
    const msg = this.element.querySelector('.formello-message');
    const debugDiv = document.createElement('div');
    debugDiv.classList.add('formello-debug');
    debugDiv.innerHTML = '<p>Debug output:</p>';
    debugDiv.innerHTML += '<pre>' + JSON.stringify(debug, undefined, 2) + '</pre>';
    msg.insertAdjacentElement('afterend', debugDiv);
  }

  cleanMessage() {
    const msg = this.element.querySelector('.formello-message');
    msg.innerHTML = '';
    msg.setAttribute('class', 'formello-message');

    if (msg.nextSibling) {
      if ('formello-debug' === msg.nextSibling.className) {
        msg.nextSibling.remove();
      }
    }
  }

  showLoading() {
    const btn = this.element.querySelector('.wp-block-formello-button');
    btn.classList.toggle('wp-block-formello-button--loading');
    btn.toggleAttribute('disabled');
  }

  isRtfEnabled() {
    const richtext = this.element.querySelectorAll('.formello-rtf');

    if (richtext.length) {
      const script = document.createElement('script');

      script.onload = function () {
        tinymce.init({
          selector: '.formello-rtf',
          menubar: false,
          plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
          toolbar: 'formatselect | ' + 'bold italic underline | bullist numlist  | ' + 'alignleft aligncenter alignright alignjustify | link unlink | undo redo',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
      };

      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js';
      document.head.appendChild(script); //or something of the likes
    }
  }

  addFlatpickr() {
    const advancedDate = this.element.querySelectorAll('.flatpickr');

    if (advancedDate.length) {
      const script = document.createElement('script');
      const css = document.createElement('link');
      css.setAttribute('type', 'text/css');
      css.setAttribute('href', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');
      css.setAttribute('rel', 'stylesheet');

      script.onload = function () {
        //do stuff with the script
        flatpickr('.flatpickr');
      };

      script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      document.head.appendChild(script); //or something of the likes

      document.head.appendChild(css); //or something of the likes
    }
  }

}



/***/ }),

/***/ "./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js":
/*!******************************************************************!*\
  !*** ./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js ***!
  \******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! formbouncerjs v1.4.6 | (c) 2019 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/bouncer */
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||(function(e){"use strict";if("Element"in e){var t="classList",r="prototype",n=e.Element[r],a=Object,i=String[r].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[r].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1},l=function(e,t){this.name=e,this.code=DOMException[e],this.message=t},u=function(e,t){if(""===t)throw new l("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(t))throw new l("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(e,t)},s=function(e){for(var t=i.call(e.getAttribute("class")||""),r=t?t.split(/\s+/):[],n=0,a=r.length;n<a;n++)this.push(r[n]);this._updateClassName=function(){e.setAttribute("class",this.toString())}},c=s[r]=[],f=function(){return new s(this)};if(l[r]=Error[r],c.item=function(e){return this[e]||null},c.contains=function(e){return-1!==u(this,e+="")},c.add=function(){for(var e,t=arguments,r=0,n=t.length,a=!1;e=t[r]+"",-1===u(this,e)&&(this.push(e),a=!0),++r<n;);a&&this._updateClassName()},c.remove=function(){var e,t,r=arguments,n=0,a=r.length,i=!1;do{for(e=r[n]+"",t=u(this,e);-1!==t;)this.splice(t,1),i=!0,t=u(this,e)}while(++n<a);i&&this._updateClassName()},c.toggle=function(e,t){e+="";var r=this.contains(e),n=r?!0!==t&&"remove":!1!==t&&"add";return n&&this[n](e),!0===t||!1===t?t:!r},c.toString=function(){return this.join(" ")},a.defineProperty){var d={get:f,enumerable:!0,configurable:!0};try{a.defineProperty(n,t,d)}catch(e){void 0!==e.number&&-2146823252!==e.number||(d.enumerable=!1,a.defineProperty(n,t,d))}}else a[r].__defineGetter__&&n.__defineGetter__(t,f)}})(self),(function(){"use strict";var e=document.createElement("_");if(e.classList.add("c1","c2"),!e.classList.contains("c2")){var t=function(e){var n=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(e){var t,r=arguments.length;for(t=0;t<r;t++)e=arguments[t],n.call(this,e)}};t("add"),t("remove")}if(e.classList.toggle("c3",!1),e.classList.contains("c3")){var r=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(e,t){return 1 in arguments&&!this.contains(e)==!t?t:r.call(this,e)}}e=null})()),Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null}),(function(){if("function"==typeof window.CustomEvent)return;function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var r=document.createEvent("CustomEvent");return r.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),r}e.prototype=window.Event.prototype,window.CustomEvent=e})(),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),(function(e,t){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return t(e)}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0})("undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof window?window:this,(function(a){"use strict";var u={fieldClass:"error",errorClass:"error-message",fieldPrefix:"bouncer-field_",errorPrefix:"bouncer-error_",patterns:{email:/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,url:/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,number:/^(?:[-+]?[0-9]*[.,]?[0-9]+)$/,color:/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,date:/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,time:/^(?:(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]))$/,month:/^(?:(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])))$/},customValidations:{},messageAfterField:!0,messageCustom:"data-bouncer-message",messageTarget:"data-bouncer-target",messages:{missingValue:{checkbox:"This field is required.",radio:"Please select a value.",select:"Please select a value.","select-multiple":"Please select at least one value.",default:"Please fill out this field."},patternMismatch:{email:"Please enter a valid email address.",url:"Please enter a URL.",number:"Please enter a number",color:"Please match the following format: #rrggbb",date:"Please use the YYYY-MM-DD format",time:"Please use the 24-hour time format. Ex. 23:00",month:"Please use the YYYY-MM format",default:"Please match the requested format."},outOfRange:{over:"Please select a value that is no more than {max}.",under:"Please select a value that is no less than {min}."},wrongLength:{over:"Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.",under:"Please lengthen this text to {minLength} characters or more. You are currently using {length} characters."},fallback:"There was an error with this field."},disableSubmit:!1,emitEvents:!0},s=function(e,t){Array.prototype.forEach.call(e,t)},c=function(){var r={};return s(arguments,(function(e){for(var t in e){if(!e.hasOwnProperty(t))return;"[object Object]"===Object.prototype.toString.call(e[t])?r[t]=c(r[t],e[t]):r[t]=e[t]}})),r},f=function(e,t,r){if("function"==typeof a.CustomEvent){var n=new CustomEvent(t,{bubbles:!0,detail:r||{}});e.dispatchEvent(n)}},d=function(e,t){return{missingValue:(function(e){if(!e.hasAttribute("required"))return!1;if("checkbox"===e.type)return!e.checked;var t=e.value.length;return"radio"===e.type&&(t=Array.prototype.filter.call(e.form.querySelectorAll('[name="'+m(e.name)+'"]'),(function(e){return e.checked})).length),t<1})(e),patternMismatch:(r=e,n=t,a=r.getAttribute("pattern"),!(!(a=a?new RegExp("^(?:"+a+")$"):n.patterns[r.type])||!r.value||r.value.length<1||r.value.match(a))),outOfRange:(function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("max"),r=e.getAttribute("min"),n=parseFloat(e.value);return t&&t<n?"over":!!(r&&n<r)&&"under"})(e),wrongLength:(function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("maxlength"),r=e.getAttribute("minlength"),n=e.value.length;return t&&t<n?"over":!!(r&&n<r)&&"under"})(e)};var r,n,a},m=function(e){for(var t,r=String(e),n=r.length,a=-1,i="",o=r.charCodeAt(0);++a<n;){if(0===(t=r.charCodeAt(a)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");1<=t&&t<=31||127==t||0===a&&48<=t&&t<=57||1===a&&48<=t&&t<=57&&45===o?i+="\\"+t.toString(16)+" ":i+=128<=t||45===t||95===t||48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122?r.charAt(a):"\\"+r.charAt(a)}return i},h=function(e,t,r){var n=e.name?e.name:e.id;return!n&&r&&(n=t.fieldPrefix+Math.floor(999*Math.random()),e.id=n),"checkbox"===e.type&&(n+="_"+(e.value||e.id)),n},x=function(e,t){var r=document.createElement("div");r.className=t.errorClass,r.id=t.errorPrefix+h(e,t,!0);var n=(function(e,t,r){var n=e.getAttribute(r.messageTarget);if(n){var a=e.form.querySelector(n);if(a)return a.firstChild||a.appendChild(document.createTextNode(""))}return r.messageAfterField?(t.nextSibling||t.parentNode.appendChild(document.createTextNode("")),t.nextSibling):t})(e,(function(e){if("radio"===e.type&&e.name){var t=e.form.querySelectorAll('[name="'+m(e.name)+'"]');e=t[t.length-1]}"radio"!==e.type&&"checkbox"!==e.type||(e=e.closest("label")||e.form.querySelector('[for="'+e.id+'"]')||e);return e})(e),t);return n.parentNode.insertBefore(r,n),r},v=function(e,t,r){e.classList.add(r.fieldClass),e.setAttribute("aria-describedby",t.id),e.setAttribute("aria-invalid",!0)},g=function(e,t,r){var n,a,i,o=e.form.querySelector("#"+m(r.errorPrefix+h(e,r)))||x(e,r),l=(function(e,t,r){var n=r.messages;if(t.missingValue)return n.missingValue[e.type]||n.missingValue.default;if(t.outOfRange)return n.outOfRange[t.outOfRange].replace("{max}",e.getAttribute("max")).replace("{min}",e.getAttribute("min")).replace("{length}",e.value.length);if(t.wrongLength)return n.wrongLength[t.wrongLength].replace("{maxLength}",e.getAttribute("maxlength")).replace("{minLength}",e.getAttribute("minlength")).replace("{length}",e.value.length);if(t.patternMismatch){var a=e.getAttribute(r.messageCustom);return a||n.patternMismatch[e.type]||n.patternMismatch.default}for(var i in r.customValidations)if(r.customValidations.hasOwnProperty(i)&&t[i]&&n[i])return n[i];return n.fallback})(e,t,r);o.textContent="function"==typeof l?l(e,r):l,a=o,i=r,"radio"===(n=e).type&&n.name&&Array.prototype.forEach.call(document.querySelectorAll('[name="'+n.name+'"]'),(function(e){v(e,a,i)})),v(n,a,i),r.emitEvents&&f(e,"bouncerShowError",{errors:t})},i=function(e,t){e.classList.remove(t.fieldClass),e.removeAttribute("aria-describedby"),e.removeAttribute("aria-invalid")},p=function(e,t){var r,n,a=e.form.querySelector("#"+m(t.errorPrefix+h(e,t)));a&&(a.parentNode.removeChild(a),n=t,"radio"===(r=e).type&&r.name?Array.prototype.forEach.call(document.querySelectorAll('[name="'+r.name+'"]'),(function(e){i(e,n)})):i(r,n),t.emitEvents&&f(e,"bouncerRemoveError"))};return function(n,e){var l,r={};r.validate=function(e,t){if(!e.disabled&&!e.readOnly&&"reset"!==e.type&&"submit"!==e.type&&"button"!==e.type){var r,n,a,i=c(l,t||{}),o=(a=d(r=e,n=i),{valid:!(function(e){for(var t in e)if(e[t])return!0;return!1})(a=(function(e,t,r,n){for(var a in r)r.hasOwnProperty(a)&&(t[a]=r[a](e,n));return t})(r,a,n.customValidations,n)),errors:a});if(!o.valid)return g(e,o.errors,i),o;p(e,i)}},r.validateAll=function(e){return Array.prototype.filter.call(e.querySelectorAll("input, select, textarea"),(function(e){var t=r.validate(e);return t&&!t.valid}))};var a=function(e){e.target.form&&e.target.form.matches(n)&&r.validate(e.target)},i=function(e){e.target.form&&e.target.form.matches(n)&&e.target.classList.contains(l.fieldClass)&&r.validate(e.target)},o=function(e){if(e.target.matches(n)){e.preventDefault();var t=r.validateAll(e.target);if(0<t.length)return t[0].focus(),void f(e.target,"bouncerFormInvalid",{errors:t});l.disableSubmit||e.target.submit(),l.emitEvents&&f(e.target,"bouncerFormValid")}};r.destroy=function(){var e,t,r;document.removeEventListener("blur",a,!0),document.removeEventListener("input",i,!1),document.removeEventListener("click",i,!1),document.removeEventListener("submit",o,!1),e=n,t=l,s(document.querySelectorAll(e),(function(e){s(e.querySelectorAll("input, select, textarea"),(function(e){p(e,t)}))})),r=n,s(document.querySelectorAll(r),(function(e){e.removeAttribute("novalidate")})),l.emitEvents&&f(document,"bouncerDestroyed",{settings:l}),l=null};var t;return l=c(u,e||{}),t=n,s(document.querySelectorAll(t),(function(e){e.setAttribute("novalidate",!0)})),document.addEventListener("blur",a,!0),document.addEventListener("input",i,!1),document.addEventListener("click",i,!1),document.addEventListener("submit",o,!1),l.emitEvents&&f(document,"bouncerInitialized",{settings:l}),r}}));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************************!*\
  !*** ./src/frontend/frontend.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./src/frontend/form.js");
/* harmony import */ var formbouncerjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! formbouncerjs */ "./node_modules/formbouncerjs/dist/bouncer.polyfills.min.js");
/* harmony import */ var formbouncerjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(formbouncerjs__WEBPACK_IMPORTED_MODULE_1__);


new (formbouncerjs__WEBPACK_IMPORTED_MODULE_1___default())('.wp-block-formello-form', {
  disableSubmit: true
});
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.wp-block-formello-form');

  if (!forms.length) {
    return;
  }

  forms.forEach(block => {
    new _form__WEBPACK_IMPORTED_MODULE_0__.Formello(block);
  });
});
}();
/******/ })()
;
//# sourceMappingURL=frontend.js.map