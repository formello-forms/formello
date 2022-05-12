!function(){var e={525:function(e,t,n){var r,a;"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||function(e){"use strict";if("Element"in e){var t="classList",n="prototype",r=e.Element[n],a=Object,i=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[n].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1},s=function(e,t){this.name=e,this.code=DOMException[e],this.message=t},l=function(e,t){if(""===t)throw new s("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(t))throw new s("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(e,t)},c=function(e){for(var t=i.call(e.getAttribute("class")||""),n=t?t.split(/\s+/):[],r=0,a=n.length;r<a;r++)this.push(n[r]);this._updateClassName=function(){e.setAttribute("class",this.toString())}},u=c[n]=[],d=function(){return new c(this)};if(s[n]=Error[n],u.item=function(e){return this[e]||null},u.contains=function(e){return-1!==l(this,e+="")},u.add=function(){for(var e,t=arguments,n=0,r=t.length,a=!1;e=t[n]+"",-1===l(this,e)&&(this.push(e),a=!0),++n<r;);a&&this._updateClassName()},u.remove=function(){var e,t,n=arguments,r=0,a=n.length,i=!1;do{for(e=n[r]+"",t=l(this,e);-1!==t;)this.splice(t,1),i=!0,t=l(this,e)}while(++r<a);i&&this._updateClassName()},u.toggle=function(e,t){e+="";var n=this.contains(e),r=n?!0!==t&&"remove":!1!==t&&"add";return r&&this[r](e),!0===t||!1===t?t:!n},u.toString=function(){return this.join(" ")},a.defineProperty){var m={get:d,enumerable:!0,configurable:!0};try{a.defineProperty(r,t,m)}catch(e){void 0!==e.number&&-2146823252!==e.number||(m.enumerable=!1,a.defineProperty(r,t,m))}}else a[n].__defineGetter__&&r.__defineGetter__(t,d)}}(self),function(){"use strict";var e=document.createElement("_");if(e.classList.add("c1","c2"),!e.classList.contains("c2")){var t=function(e){var t=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(e){var n,r=arguments.length;for(n=0;n<r;n++)e=arguments[n],t.call(this,e)}};t("add"),t("remove")}if(e.classList.toggle("c3",!1),e.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(e,t){return 1 in arguments&&!this.contains(e)==!t?t:n.call(this,e)}}e=null}()),Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null}),function(){function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}"function"!=typeof window.CustomEvent&&(e.prototype=window.Event.prototype,window.CustomEvent=e)}(),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),a=void 0!==n.g?n.g:"undefined"!=typeof window?window:this,r=function(){return function(e){"use strict";var t={fieldClass:"error",errorClass:"error-message",fieldPrefix:"bouncer-field_",errorPrefix:"bouncer-error_",patterns:{email:/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,url:/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,number:/^(?:[-+]?[0-9]*[.,]?[0-9]+)$/,color:/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,date:/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,time:/^(?:(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]))$/,month:/^(?:(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])))$/},customValidations:{},messageAfterField:!0,messageCustom:"data-bouncer-message",messageTarget:"data-bouncer-target",messages:{missingValue:{checkbox:"This field is required.",radio:"Please select a value.",select:"Please select a value.","select-multiple":"Please select at least one value.",default:"Please fill out this field."},patternMismatch:{email:"Please enter a valid email address.",url:"Please enter a URL.",number:"Please enter a number",color:"Please match the following format: #rrggbb",date:"Please use the YYYY-MM-DD format",time:"Please use the 24-hour time format. Ex. 23:00",month:"Please use the YYYY-MM format",default:"Please match the requested format."},outOfRange:{over:"Please select a value that is no more than {max}.",under:"Please select a value that is no less than {min}."},wrongLength:{over:"Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.",under:"Please lengthen this text to {minLength} characters or more. You are currently using {length} characters."},fallback:"There was an error with this field."},disableSubmit:!1,emitEvents:!0},n=function(e,t){Array.prototype.forEach.call(e,t)},r=function(){var e={};return n(arguments,(function(t){for(var n in t){if(!t.hasOwnProperty(n))return;"[object Object]"===Object.prototype.toString.call(t[n])?e[n]=r(e[n],t[n]):e[n]=t[n]}})),e},a=function(t,n,r){if("function"==typeof e.CustomEvent){var a=new CustomEvent(n,{bubbles:!0,detail:r||{}});t.dispatchEvent(a)}},i=function(e){for(var t,n=String(e),r=n.length,a=-1,i="",o=n.charCodeAt(0);++a<r;){if(0===(t=n.charCodeAt(a)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");i+=1<=t&&t<=31||127==t||0===a&&48<=t&&t<=57||1===a&&48<=t&&t<=57&&45===o?"\\"+t.toString(16)+" ":128<=t||45===t||95===t||48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122?n.charAt(a):"\\"+n.charAt(a)}return i},o=function(e,t,n){var r=e.name?e.name:e.id;return!r&&n&&(r=t.fieldPrefix+Math.floor(999*Math.random()),e.id=r),"checkbox"===e.type&&(r+="_"+(e.value||e.id)),r},s=function(e,t,n){e.classList.add(n.fieldClass),e.setAttribute("aria-describedby",t.id),e.setAttribute("aria-invalid",!0)},l=function(e,t,n){var r,l,c,u=e.form.querySelector("#"+i(n.errorPrefix+o(e,n)))||function(e,t){var n=document.createElement("div");n.className=t.errorClass,n.id=t.errorPrefix+o(e,t,!0);var r=function(e,t,n){var r=e.getAttribute(n.messageTarget);if(r){var a=e.form.querySelector(r);if(a)return a.firstChild||a.appendChild(document.createTextNode(""))}return n.messageAfterField?(t.nextSibling||t.parentNode.appendChild(document.createTextNode("")),t.nextSibling):t}(e,function(e){if("radio"===e.type&&e.name){var t=e.form.querySelectorAll('[name="'+i(e.name)+'"]');e=t[t.length-1]}return"radio"!==e.type&&"checkbox"!==e.type||(e=e.closest("label")||e.form.querySelector('[for="'+e.id+'"]')||e),e}(e),t);return r.parentNode.insertBefore(n,r),n}(e,n),d=function(e,t,n){var r=n.messages;if(t.missingValue)return r.missingValue[e.type]||r.missingValue.default;if(t.outOfRange)return r.outOfRange[t.outOfRange].replace("{max}",e.getAttribute("max")).replace("{min}",e.getAttribute("min")).replace("{length}",e.value.length);if(t.wrongLength)return r.wrongLength[t.wrongLength].replace("{maxLength}",e.getAttribute("maxlength")).replace("{minLength}",e.getAttribute("minlength")).replace("{length}",e.value.length);if(t.patternMismatch)return e.getAttribute(n.messageCustom)||r.patternMismatch[e.type]||r.patternMismatch.default;for(var a in n.customValidations)if(n.customValidations.hasOwnProperty(a)&&t[a]&&r[a])return r[a];return r.fallback}(e,t,n);u.textContent="function"==typeof d?d(e,n):d,l=u,c=n,"radio"===(r=e).type&&r.name&&Array.prototype.forEach.call(document.querySelectorAll('[name="'+r.name+'"]'),(function(e){s(e,l,c)})),s(r,l,c),n.emitEvents&&a(e,"bouncerShowError",{errors:t})},c=function(e,t){e.classList.remove(t.fieldClass),e.removeAttribute("aria-describedby"),e.removeAttribute("aria-invalid")},u=function(e,t){var n,r,s=e.form.querySelector("#"+i(t.errorPrefix+o(e,t)));s&&(s.parentNode.removeChild(s),r=t,"radio"===(n=e).type&&n.name?Array.prototype.forEach.call(document.querySelectorAll('[name="'+n.name+'"]'),(function(e){c(e,r)})):c(n,r),t.emitEvents&&a(e,"bouncerRemoveError"))};return function(e,o){var s,c,d={validate:function(e,t){if(!e.disabled&&!e.readOnly&&"reset"!==e.type&&"submit"!==e.type&&"button"!==e.type){var n,a,o,c=r(s,t||{}),d=(o=function(e,t){return{missingValue:function(e){if(!e.hasAttribute("required"))return!1;if("checkbox"===e.type)return!e.checked;var t=e.value.length;return"radio"===e.type&&(t=Array.prototype.filter.call(e.form.querySelectorAll('[name="'+i(e.name)+'"]'),(function(e){return e.checked})).length),t<1}(e),patternMismatch:(n=e,r=t,a=n.getAttribute("pattern"),!(!(a=a?new RegExp("^(?:"+a+")$"):r.patterns[n.type])||!n.value||n.value.length<1||n.value.match(a))),outOfRange:function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("max"),n=e.getAttribute("min"),r=parseFloat(e.value);return t&&t<r?"over":!!(n&&r<n)&&"under"}(e),wrongLength:function(e){if(!e.value||e.value.length<1)return!1;var t=e.getAttribute("maxlength"),n=e.getAttribute("minlength"),r=e.value.length;return t&&t<r?"over":!!(n&&r<n)&&"under"}(e)};var n,r,a}(n=e,a=c),{valid:!function(e){for(var t in e)if(e[t])return!0;return!1}(o=function(e,t,n,r){for(var a in n)n.hasOwnProperty(a)&&(t[a]=n[a](e,r));return t}(n,o,a.customValidations,a)),errors:o});if(!d.valid)return l(e,d.errors,c),d;u(e,c)}},validateAll:function(e){return Array.prototype.filter.call(e.querySelectorAll("input, select, textarea"),(function(e){var t=d.validate(e);return t&&!t.valid}))}},m=function(t){t.target.form&&t.target.form.matches(e)&&d.validate(t.target)},f=function(t){t.target.form&&t.target.form.matches(e)&&t.target.classList.contains(s.fieldClass)&&d.validate(t.target)},h=function(t){if(t.target.matches(e)){t.preventDefault();var n=d.validateAll(t.target);if(0<n.length)return n[0].focus(),void a(t.target,"bouncerFormInvalid",{errors:n});s.disableSubmit||t.target.submit(),s.emitEvents&&a(t.target,"bouncerFormValid")}};return d.destroy=function(){var t,r,i;document.removeEventListener("blur",m,!0),document.removeEventListener("input",f,!1),document.removeEventListener("click",f,!1),document.removeEventListener("submit",h,!1),t=e,r=s,n(document.querySelectorAll(t),(function(e){n(e.querySelectorAll("input, select, textarea"),(function(e){u(e,r)}))})),i=e,n(document.querySelectorAll(i),(function(e){e.removeAttribute("novalidate")})),s.emitEvents&&a(document,"bouncerDestroyed",{settings:s}),s=null},s=r(t,o||{}),c=e,n(document.querySelectorAll(c),(function(e){e.setAttribute("novalidate",!0)})),document.addEventListener("blur",m,!0),document.addEventListener("input",f,!1),document.addEventListener("click",f,!1),document.addEventListener("submit",h,!1),s.emitEvents&&a(document,"bouncerInitialized",{settings:s}),d}}(a)}.apply(t,[]),void 0===r||(e.exports=r)}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";const e={};var t=function(t,n){e[t]=e[t]||[],e[t].forEach((e=>e.apply(null,n)))};class r{constructor(e){this.element=e,this.element.addEventListener("bouncerFormValid",this.handleSubmit.bind(this),!0),this.init()}init(){this.reCaptcha(),this.isRtfEnabled(),this.addFlatpickr()}handleSubmit(e){e.preventDefault(),e.stopPropagation(),this.enableRecaptcha?this.reCaptchaToken():this.submitForm()}submitForm(e){this.showLoading(),this.cleanMessage(),this.emitEvent("submit");const t=new FormData(this.element);e&&t.append("g-recaptcha-response",e);let n=new XMLHttpRequest;n.onreadystatechange=this.createRequestHandler(this.element),n.open("POST",formello.ajax_url,!0),n.setRequestHeader("X-Requested-With","XMLHttpRequest"),n.send(t),n=null}emitEvent(e){window.dispatchEvent(new CustomEvent("formello-"+e)),t(e,[this.element])}createRequestHandler(e){const t=this;return function(){if(4===this.readyState){let e;if(t.showLoading(),this.status>=200&&this.status<400){try{e=JSON.parse(this.responseText)}catch(e){return void console.log('Formello: failed to parse AJAX response.\n\nError: "'+e+'"')}t.emitEvent("submitted",this.element),e.errors.length?t.emitEvent("error",this.element):t.emitEvent("success",this.element),e.message&&(t.addMessage(e.message,e.errors,e.hide_form),t.emitEvent("message",this.element)),e.hide_form&&(t.element.style.display="none"),e.debug&&(t.addDebug(e.debug),console.log(e.debug)),e.redirect_url&&(window.location=e.redirect_url),e.message.errors||t.element.reset()}else console.log(e)}}}reCaptcha(){var e,t;const{recaptcha:n}=this.element.dataset;if(!JSON.parse(n))return;let r="https://www.google.com/recaptcha/api.js";const a=null===(e=formello.settings.reCaptcha)||void 0===e?void 0:e.site_key,i=null===(t=formello.settings.reCaptcha)||void 0===t?void 0:t.version,o=this.element.getElementsByTagName("button");if("1"===i){const e=document.createElement("div");e.classList.add("g-recaptcha"),e.setAttribute("data-sitekey",a),this.element.insertBefore(e,o[0])}else{r+="?render="+a;const e=document.createElement("input");e.type="hidden",e.name="g-recaptcha-response",e.classList.add("formello-g-recaptcha"),this.element.appendChild(e)}if(a&&i){this.enableRecaptcha=!0;const e=document.createElement("script");e.src=r,document.head.appendChild(e)}}reCaptchaToken(){grecaptcha.ready((()=>{grecaptcha.execute(formello.settings.reCaptcha.site_key,{action:"submit"}).then((e=>{this.element.querySelector(".formello-g-recaptcha").value=e,this.submitForm()}))}))}addMessage(e,t,n){const r=this.element.querySelector(".formello-message");if(r.classList.add(e.type),r.innerHTML="<p>"+e.text+"</p>",t.length){const e=document.createElement("ul");r.appendChild(e),t.forEach((function(t){const n=document.createElement("li");e.appendChild(n),n.innerHTML+=t}))}n&&this.element.insertAdjacentElement("afterend",r)}addDebug(e){const t=this.element.querySelector(".formello-message"),n=document.createElement("div");n.classList.add("formello-debug"),n.innerHTML="<p>Debug output:</p>",n.innerHTML+="<pre>"+JSON.stringify(e,void 0,2)+"</pre>",t.insertAdjacentElement("afterend",n)}cleanMessage(){const e=this.element.querySelector(".formello-message");e.innerHTML="",e.setAttribute("class","formello-message"),e.nextSibling&&"formello-debug"===e.nextSibling.className&&e.nextSibling.remove()}showLoading(){const e=this.element.querySelector(".wp-block-formello-button");e.classList.toggle("wp-block-formello-button--loading"),e.toggleAttribute("disabled")}isRtfEnabled(){if(this.element.querySelectorAll(".formello-rtf").length){const e=document.createElement("script");e.onload=function(){tinymce.init({selector:".formello-rtf",menubar:!1,plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste code help wordcount"],toolbar:"formatselect | bold italic underline | bullist numlist  | alignleft aligncenter alignright alignjustify | link unlink | undo redo",content_style:"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"})},e.src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js",document.head.appendChild(e)}}addFlatpickr(){if(this.element.querySelectorAll(".flatpickr").length){const e=document.createElement("script"),t=document.createElement("link");t.setAttribute("type","text/css"),t.setAttribute("href","https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"),t.setAttribute("rel","stylesheet"),e.onload=function(){flatpickr(".flatpickr")},e.src="https://cdn.jsdelivr.net/npm/flatpickr",document.head.appendChild(e),document.head.appendChild(t)}}}var a=n(525);new(n.n(a)())(".wp-block-formello-form",{disableSubmit:!0}),document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelectorAll(".wp-block-formello-form");e.length&&e.forEach((e=>{new r(e)}))}))}()}();