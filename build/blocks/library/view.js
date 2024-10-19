import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/blocks/library/config.js":
/*!**************************************!*\
  !*** ./src/blocks/library/config.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
const config = {
  bouncer: {
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
      valueMismatch(field) {
        const customMessage = field.getAttribute('data-bouncer-mismatch-message');
        return customMessage ? customMessage : 'Please make sure the fields match.';
      }
    }
  },
  tinyMce: {
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
  }
};

/***/ }),

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

var x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var y = x => () => x
module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/blocks/library/view.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/blocks/library/config.js");
/**
 * WordPress dependencies
 */


const showLoading = e => {
  const btn = e.submitter || e.target.closest('button');
  btn.classList.toggle('wp-block-formello-button--loading');
  btn.toggleAttribute('disabled');
};
const formSubmit = async e => {
  const {
    ref
  } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
  const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
  const config = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
  const {
    id
  } = ref.dataset;
  const formData = new FormData(ref);
  formData.append('action', 'formello');
  formData.append('_formello', config.nonce);
  formData.append('_formello_id', id);
  try {
    showLoading(e);
    const req = await fetch(config.ajax_url, {
      method: 'POST',
      body: formData
    });
    const res = await req.json();
    context.response = res;
    showLoading(e);
    response(ref, res);
  } catch (err) {
    showLoading(e);
    state.response = {
      data: {
        message: err
      },
      success: false
    };
  }
};
const captchaChallenge = async () => {
  const config = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
  const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
  if (context.captchaEnabled && 'reCaptcha' === context.captchaType && '3' === config.settings.reCaptcha.version) {
    return window.grecaptcha.execute();
  }
  if (context.captchaEnabled && 'hCaptcha' === context.captchaType) {
    await window.hcaptcha.execute({
      async: true
    });
  }
};
const response = (ref, res) => {
  const {
    data
  } = res;

  // Should we redirect?
  if (data.redirect_url && res.success) {
    window.location = data.redirect_url;
    return false;
  }

  // Should we hide form?
  if (data.hide && res.success) {
    const msg = ref.querySelector('.formello-message');
    ref.insertAdjacentElement('beforebegin', msg);
    setTimeout(() => {
      ref.style.display = 'none';
      msg.scrollIntoView({
        behavior: 'smooth'
      });
    }, '300');
  }
  if (data.debug && res.success) {
    // eslint-disable-next-line no-console
    const deguagData = ref.querySelector('.formello-debug');
    const position = data.hide ? 'beforebegin' : 'afterend';
    ref.insertAdjacentElement(position, deguagData);
    // eslint-disable-next-line no-console
    console.log(data.debug);
  }

  // clear form
  if (res.success) {
    ref.reset();
  }
};
const {
  state
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('formello', {
  state: {
    get debugData() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return JSON.stringify(context.response.data.debug, undefined, 2);
    },
    get message() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return context.response?.data?.message || '';
    },
    get errors() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return context.response?.data?.errors || [];
    }
  },
  actions: {
    validateCaptcha: e => {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      e.preventDefault();
      if (context.enableJsValidation) {
        const errors = context.validator.validateAll(ref.closest('form'));
        if (errors.length) {
          errors[0].scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
          return;
        }
      }
      showLoading(e);
      captchaChallenge().then(() => {
        showLoading(e);
        ref.closest('form').requestSubmit(ref);
      });
    },
    sendForm: e => {
      e.preventDefault();
      e.stopPropagation();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (context.enableJsValidation) {
        const {
          ref
        } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
        const errors = context.validator.validateAll(ref);
        if (errors.length) {
          errors[0].scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
          return;
        }
      }
      formSubmit(e);
    },
    setOutput: () => {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if ('OUTPUT' === ref.nextElementSibling?.nodeName) {
        ref.nextElementSibling.value = ref.value;
      }
    }
  },
  callbacks: {
    init: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (context.enableJsValidation) {
        const config = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
        const {
          ref
        } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
        const {
          id
        } = ref.dataset;
        context.validator = new window.Bouncer(`.wp-block-formello-form[data-id='${id}']`, {
          ..._config__WEBPACK_IMPORTED_MODULE_1__.config.bouncer,
          messages: {
            ..._config__WEBPACK_IMPORTED_MODULE_1__.config.bouncer.messages,
            ...config.settings.messages
          }
        });
      }
      window.tinymce?.init(_config__WEBPACK_IMPORTED_MODULE_1__.config.tinyMce);
      window.flatpickr?.('input.formello-advanced[type=date]');
    }
  }
});
})();


//# sourceMappingURL=view.js.map