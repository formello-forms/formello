/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/events.js":
/*!********************************!*\
  !*** ./src/frontend/events.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Formello: function() { return /* binding */ Formello; }
/* harmony export */ });
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/frontend/events.js");

class Formello {
  constructor(element) {
    this.element = element;
    this.init();
  }
  init() {
    const {
      validate
    } = this.element.dataset;
    if (validate) {
      this.enableJsValidation();
      this.element.addEventListener('bouncerFormValid', this.handleSubmit.bind(this), false);
    } else {
      this.element.addEventListener('submit', this.handleSubmit.bind(this), true);
    }
    this.isRtfEnabled();
    this.addFlatpickr();
  }
  handleSubmit(e) {
    // prevent default, we send trough ajax
    e.preventDefault();
    e.stopPropagation();
    this.showLoading();
    const {
      captcha,
      noajax
    } = this.element.dataset;
    if (noajax) {
      this.submitNoAjax();
      return;
    }
    if (!captcha) {
      this.submitForm();
    } else {
      this.submitWithCaptcha(captcha);
    }
  }
  submitNoAjax() {
    this.element.submit();
  }
  submitWithCaptcha(captchaType) {
    if ('reCaptcha' === captchaType) {
      const captcha = this.element.querySelector('.g-recaptcha');
      const {
        size
      } = captcha.dataset;
      if ('invisible' === size) {
        window.grecaptcha.execute().then(() => this.submitForm());
      } else {
        this.submitForm();
      }
    } else {
      window.hcaptcha.execute().then(() => this.submitForm());
    }
  }
  async submitForm() {
    this.cleanMessage();
    this.emitEvent('submit');
    const formData = new FormData(this.element);
    try {
      const res = await fetch(window.formello.ajax_url, {
        method: 'POST',
        body: formData
      });
      const resData = await res.json();
      this.showLoading();
      this.response(resData);
    } catch (err) {
      this.addMessage({
        data: {
          message: err
        }
      });
    }
  }
  response(res) {
    this.emitEvent('submitted', this.element);
    if (res.success) {
      this.emitEvent('success', this.element);
    } else {
      this.emitEvent('error', this.element);
    }
    const {
      data
    } = res;

    // Should we redirect?
    if (data.redirect_url && res.success) {
      window.location = data.redirect_url;
      return false;
    }

    // Show form message
    if (data.message) {
      this.addMessage(res);
      this.emitEvent('message', this.element);
    }

    // Should we hide form?
    if (data.hide && res.success) {
      this.element.style.display = 'none';
    }
    if (data.debug) {
      this.addDebug(data.debug);
      // eslint-disable-next-line no-console
      console.log(data.debug);
    }

    // clear form
    if (res.success) {
      this.element.reset();
    }
  }
  addMessage(res) {
    const msg = this.element.querySelector('.formello-message');
    const type = res.success ? 'success' : 'error';
    msg.classList.add(type);
    const {
      data
    } = res;
    msg.innerHTML = '<p>' + data.message + '</p>';
    if (data.errors?.length) {
      const ul = document.createElement('ul');
      msg.appendChild(ul);
      data.errors.forEach(function (item) {
        const li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
      });
    }
    if (data.hide && res.success) {
      this.element.insertAdjacentElement('afterend', msg);
    }
  }
  addDebug(debug) {
    const msg = this.element.querySelector('.formello-message');
    const debugDiv = document.createElement('div');
    debugDiv.classList.add('formello-debug');
    debugDiv.innerHTML = '<p>Debug output:</p>';
    debugDiv.innerHTML += '<small>This output is visible only to admin.</small>';
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
  emitEvent(eventName) {
    // browser event API: formElement.on('formello-success', ..)
    window.dispatchEvent(new CustomEvent('formello-' + eventName));
    this.element.dispatchEvent(new CustomEvent('formello-' + eventName));

    // custom events API: formello.on('success', ..)
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].trigger(eventName, [this.element]);
  }
  enableJsValidation() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/bouncer@1/dist/bouncer.polyfills.min.js';
    const {
      id
    } = this.element.dataset;
    script.onload = function () {
      //do stuff with the script
      new window.Bouncer(`.wp-block-formello-form[data-id='${id}']`, {
        disableSubmit: true,
        customValidations: {
          valueMismatch(field) {
            // Look for a selector for a field to compare
            // If there isn't one, return false (no error)
            const selector = field.getAttribute('data-bouncer-match');
            if (!selector) {
              return false;
            }

            // Get the field to compare
            const otherField = field.form.querySelector('[name=' + selector + ']');
            if (!otherField) {
              return false;
            }

            // Compare the two field values
            // We use a negative comparison here because if they do match, the field validates
            // We want to return true for failures, which can be confusing
            return otherField.value !== field.value;
          }
        },
        messageCustom: 'data-bouncer-message',
        // The data attribute to use for custom error messages
        messages: {
          missingValue: window.formello.settings.messages.missingValue,
          patternMismatch: window.formello.settings.messages.patternMismatch,
          outOfRange: window.formello.settings.messages.outOfRange,
          wrongLength: window.formello.settings.messages.wrongLength,
          valueMismatch(field) {
            const customMessage = field.getAttribute('data-bouncer-mismatch-message');
            return customMessage ? customMessage : 'Please make sure the fields match.';
          }
        }
      });
    };
    document.head.appendChild(script);
  }
  isRtfEnabled() {
    const richtext = this.element.querySelectorAll('.formello-rtf');
    if (richtext.length) {
      const script = document.createElement('script');
      script.onload = function () {
        window.tinymce.init({
          selector: '.formello-rtf',
          setup: editor => {
            editor.on('change', () => {
              window.tinymce.triggerSave();
            });
          },
          menubar: false,
          plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
          toolbar: 'formatselect | ' + 'bold italic underline | bullist numlist  | ' + 'alignleft aligncenter alignright alignjustify | link unlink | undo redo',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
      };
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js';
      document.head.appendChild(script);
    }
  }
  addFlatpickr() {
    const advancedDate = this.element.querySelectorAll('input.formello-advanced[type=date]');
    if (advancedDate.length) {
      const script = document.createElement('script');
      const css = document.createElement('link');
      css.setAttribute('type', 'text/css');
      css.setAttribute('href', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');
      css.setAttribute('rel', 'stylesheet');
      script.onload = function () {
        //do stuff with the script
        window.flatpickr('input.formello-advanced[type=date]');
      };
      script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      document.head.appendChild(script);
      document.head.appendChild(css);
    }
  }
}


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************************!*\
  !*** ./src/frontend/frontend.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./src/frontend/form.js");

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