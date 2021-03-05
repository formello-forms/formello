!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=46)}([function(e,t){e.exports=window.wp.element},function(e,t){e.exports=window.wp.i18n},function(e,t){e.exports=window.wp.components},,,,,function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e},e.exports.default=e.exports,e.exports.__esModule=!0},,,,,,,function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t){function n(t){return e.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},e.exports.default=e.exports,e.exports.__esModule=!0,n(t)}e.exports=n,e.exports.default=e.exports,e.exports.__esModule=!0},,,,function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t){function n(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}e.exports=function(e,t,o){return t&&n(e.prototype,t),o&&n(e,o),e},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){var o=n(40);e.exports=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&o(e,t)},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){var o=n(41).default,r=n(14);e.exports=function(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?r(e):t},e.exports.default=e.exports,e.exports.__esModule=!0},,,,,,,,,,,,,,,,,,function(e,t){function n(t,o){return e.exports=n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e.exports.default=e.exports,e.exports.__esModule=!0,n(t,o)}e.exports=n,e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t){function n(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?(e.exports=n=function(e){return typeof e},e.exports.default=e.exports,e.exports.__esModule=!0):(e.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e.exports.default=e.exports,e.exports.__esModule=!0),n(t)}e.exports=n,e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){},,,,function(e,t,n){"use strict";n.r(t);var o=n(7),r=n.n(o),a=n(19),l=n.n(a),s=n(20),c=n.n(s),i=n(14),u=n.n(i),p=n(21),m=n.n(p),f=n(22),b=n.n(f),g=n(15),d=n.n(g),h=n(0),O=(n(42),n(2)),j=n(1),_=wp.hooks.applyFilters;function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(Object(n),!0).forEach((function(t){r()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}wp.hooks.applyFilters;var __=wp.i18n.__,y=wp.components,w=(y.BaseControl,y.Button),E=(y.PanelBody,y.PanelRow,y.Placeholder),C=y.Spinner,S=(y.TextControl,y.SelectControl,y.RadioControl,y.TabPanel),P=wp.element,M=P.render,R=P.Component,T=P.Fragment,k=wp.apiFetch,L=wp.hooks.applyFilters,N=[{name:"recaptcha",title:"ReCaptcha"},{name:"integrations",title:"Integrations"},{name:"messages",title:"Messages"},{name:"other",title:"Other"}],I={recaptcha:function(e){var t=e.getSetting,n=e.changeSettings;return Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Google ReCaptcha","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,{className:"formello-css-print-method"},Object(h.createElement)(O.RadioControl,{label:Object(j.__)("ReCaptcha type","formello"),selected:t("recaptcha","version"),options:[{label:"ReCaptcha v2 checkbox",value:"1"},{label:"ReCaptcha v3 invisible",value:"3"}],onChange:function(e){n("recaptcha","version",e)}})),Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Site Key","formello"),value:t("recaptcha","site_key"),onChange:function(e){n("recaptcha","site_key",e)}})),Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Secret Key","formello"),value:t("recaptcha","secret_key"),onChange:function(e){n("recaptcha","secret_key",e)}})),3==t("recaptcha","version")&&Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.__experimentalNumberControl,{label:Object(j.__)("Threshold","formello"),value:t("recaptcha","threshold"),onChange:function(e){n("recaptcha","threshold",e)},step:"0.1",min:"0",max:"1"}))))},messages:function(e){var t=e.getSetting,n=e.changeSettings,o=function(e,o,r){var a=Object.assign({},t("messages",e));a[o]=r,n("messages",e,a)};return Object(h.createElement)(h.Fragment,null,Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Missing Value","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Default"),value:t("messages","missingValue").default,onChange:function(e){o("missingValue","default",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Checkbox"),value:t("messages","missingValue").checkbox,onChange:function(e){o("missingValue","checkbox",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Radio"),value:t("messages","missingValue").radio,onChange:function(e){o("missingValue","radio",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Select"),value:t("messages","missingValue").select,onChange:function(e){o("missingValue","select",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Select Multiple"),value:t("messages","missingValue")["select-multiple"],onChange:function(e){o("missingValue",["select-multiple"],e)}})))),Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Pattern Mismatch","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Email"),value:t("messages","patternMismatch").email,onChange:function(e){o("patternMismatch","email",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Url"),value:t("messages","patternMismatch").url,onChange:function(e){o("patternMismatch","url",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Number"),value:t("messages","patternMismatch").number,onChange:function(e){o("patternMismatch","number",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Color"),value:t("messages","patternMismatch").color,onChange:function(e){o("patternMismatch","color",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Date"),value:t("messages","patternMismatch").date,onChange:function(e){o("patternMismatch","date",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Time"),value:t("messages","patternMismatch").time,onChange:function(e){o("patternMismatch","time",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Month"),value:t("messages","patternMismatch").month,onChange:function(e){o("patternMismatch","month",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Default"),value:t("messages","patternMismatch").default,onChange:function(e){o("patternMismatch","default",e)}})))),Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Out of Range","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Over Range"),value:t("messages","outOfRange").over,onChange:function(e){o("outOfRange","over",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Under Range"),value:t("messages","outOfRange").under,onChange:function(e){o("outOfRange","under",e)}})))),Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Wrong Length","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)(O.TextControl,{label:Object(j.__)("Over Length"),value:t("messages","wrongLength").over,onChange:function(e){o("wrongLength","over",e)}}),Object(h.createElement)(O.TextControl,{label:Object(j.__)("Under Length"),value:t("messages","wrongLength").under,onChange:function(e){o("wrongLength","under",e)}})))))},integrations:function(e){return e.getSetting,e.changeSettings,Object(h.createElement)("div",null,Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Integrations","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)("p",null,Object(j.__)("We are working on integrations. They will be available soon.","formello"))))),_("formello.dashboard.integrations","",e))},other:function(e){return e.getSetting,e.changeSettings,Object(h.createElement)("div",null,Object(h.createElement)(O.PanelBody,{initialOpen:!0,title:Object(j.__)("Integrations","formello")},Object(h.createElement)("div",{className:"formello-dashboard-panel-row-wrapper"},Object(h.createElement)(O.PanelRow,null,Object(h.createElement)("p",null,Object(j.__)("Here you can find","formello"),": ",Object(h.createElement)("a",{href:"https://wordpress.org/support/plugin/formello/"},"support"),"."),Object(h.createElement)("p",null,Object(j.__)("If you like the plugin, you can share a review ","formello"),": ",Object(h.createElement)("a",{href:"https://wordpress.org/support/plugin/formello/reviews/#new-post"},"here"),".")))))}},B=function(e){m()(a,e);var t,n,o=(t=a,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,o=d()(t);if(n){var r=d()(this).constructor;e=Reflect.construct(o,arguments,r)}else e=o.apply(this,arguments);return b()(this,e)});function a(){var e;return l()(this,a),(e=o.apply(this,arguments)).state={isAPILoaded:!1,isAPISaving:!1,settings:{}},e.getSetting=e.getSetting.bind(u()(e)),e.updateSettings=e.updateSettings.bind(u()(e)),e}return c()(a,[{key:"componentDidMount",value:function(){var e=this;k({path:"/formello/v1/settings",method:"GET"}).then((function(t){e.state.settings=t.response,e.setState({isAPILoaded:!0})}))}},{key:"getSetting",value:function(e,t,n){var o=n;return void 0!==this.state.settings[e][t]&&(o=this.state.settings[e][t]),o}},{key:"updateSettings",value:function(e){var t=this;this.setState({isAPISaving:!0});var n=e.target.nextElementSibling;k({path:"/formello/v1/settings",method:"POST",data:{settings:this.state.settings}}).then((function(e){t.setState({isAPISaving:!1}),n.classList.add("formello-action-message--show"),n.textContent=e.response,e.success&&e.response?setTimeout((function(){n.classList.remove("formello-action-message--show")}),3e3):n.classList.add("formello-action-message--error")}))}},{key:"showMessage",value:function(e){e.classList.add("formello-action-message--show"),e.textContent=result.response,result.success&&result.response?setTimeout((function(){e.classList.remove("formello-action-message--show")}),3e3):e.classList.add("formello-action-message--error")}},{key:"changeSettings",value:function(e,t,n){this.setState({settings:x(x({},this.state.settings),{},r()({},e,x(x({},this.state.settings[e]),{},r()({},t,n))))})}},{key:"render",value:function(){var e=this;return this.state.isAPILoaded?Object(h.createElement)(T,null,Object(h.createElement)("div",{className:"formello-settings-main"},L("formello.dashboard.beforeSettings","",this),Object(h.createElement)(S,{className:"formello-tablist",tabs:N},(function(t){var n=I[t.name];return Object(h.createElement)(n,{changeSettings:e.changeSettings.bind(e),getSetting:e.getSetting.bind(e)})})),L("formello.dashboard.settings","",this),Object(h.createElement)("div",{className:"formello-action-button"},Object(h.createElement)(w,{isPrimary:!0,disabled:this.state.isAPISaving,onClick:function(t){return e.updateSettings(t)}},this.state.isAPISaving&&Object(h.createElement)(C,null),!this.state.isAPISaving&&__("Save")),Object(h.createElement)("span",{className:"formello-action-message"})),L("formello.dashboard.afterSettings","",this))):Object(h.createElement)(E,{className:"formello-settings-placeholder"},Object(h.createElement)(C,null))}}]),a}(R);window.addEventListener("DOMContentLoaded",(function(){M(Object(h.createElement)(B,null),document.getElementById("formello-block-default-settings"))}))}]);