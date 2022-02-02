!function(e){var t={};function l(c){if(t[c])return t[c].exports;var r=t[c]={i:c,l:!1,exports:{}};return e[c].call(r.exports,r,r.exports,l),r.l=!0,r.exports}l.m=e,l.c=t,l.d=function(e,t,c){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:c})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var c=Object.create(null);if(l.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(c,r,function(t){return e[t]}.bind(null,r));return c},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l(l.s=225)}({0:function(e,t){e.exports=window.wp.element},1:function(e,t){e.exports=window.wp.components},12:function(e,t){e.exports=window.wp.hooks},16:function(e,t){e.exports=window.wp.url},18:function(e,t){e.exports=window.wp.notices},2:function(e,t){e.exports=window.wp.i18n},225:function(e,t,l){"use strict";l.r(t);var c=l(5),r=l.n(c),n=l(0),o=l(1),i=l(7),a=l(18),s=l(16),d=l(2),h=l(12),f=l(4),b=wp.apiFetch;function p(e){var t=e.addNotice,l=Object(n.useState)(!1),c=r()(l,2),i=c[0],a=c[1];return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(o.Card,null,Object(n.createElement)(o.CardHeader,null,Object(n.createElement)("h2",null,Object(d.__)("Template library","formello"))),Object(n.createElement)(o.CardBody,null,Object(n.createElement)("p",null,Object(d.__)("If you need to reset template library.","formello")),Object(n.createElement)(o.Button,{isPrimary:!0,"aria-disabled":i,isBusy:i,target:"_blank",onClick:function(){return a(!0),void b({path:"/formello/v1/sync_template_library",method:"POST"}).then((function(e){a(!1),t("info","Template synced")}))}},Object(d.__)("Re-Sync template","formello")))))}var m=l(32);function v(){var e=Object(n.useState)(""),t=r()(e,2),l=(t[0],t[1],Object(n.useState)("")),c=r()(l,2),b=(c[0],c[1],Object(i.useDispatch)(a.store)),v=b.createNotice,u=b.removeNotice;Object(n.useEffect)((function(){Object(s.hasQueryArg)(window.location.href,"tab")||console.log(window.location.href)}),[]);var L=function(e,t){var l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"snackbar";u("tools"),v(e,t,{type:l,id:"tools"})},w=[{name:"general",title:Object(d.__)("General","formello"),className:"setting-tabs__plugin-settings"}];Object(h.applyFilters)("formello.ToolsTabs",w);var g=Object(s.getQueryArg)(window.location.href,"tab");return Object(n.createElement)(o.SlotFillProvider,null,Object(n.createElement)("div",{className:"formello-settings-header"},Object(n.createElement)("div",{className:"formello-container"},Object(n.createElement)("h1",null,Object(f.a)("logo"),Object(d.__)("Tools")))),Object(n.createElement)("div",{className:"formello-settings-main"},Object(h.applyFilters)("formello.dashboard.beforeSettings","",this),Object(n.createElement)(o.TabPanel,{className:"formello-tablist",tabs:w,onSelect:function(e){return function(e){var t=Object(s.addQueryArgs)(window.location.href,{tab:e});window.history.replaceState({path:t},"",t)}(e)},initialTabName:g},(function(e){switch(e.name){case"general":return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(p,{addNotice:L}));default:return Object(n.createElement)(Slot,{name:"ToolsTabs"})}})),Object(n.createElement)(m.a,null),Object(h.applyFilters)("formello.dashboard.settings","",this),Object(h.applyFilters)("formello.dashboard.afterSettings","",this)))}window.addEventListener("DOMContentLoaded",(function(){Object(n.render)(Object(n.createElement)(v,null),document.getElementById("formello-block-tools"))}))},23:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var l=0,c=new Array(t);l<t;l++)c[l]=e[l];return c},e.exports.default=e.exports,e.exports.__esModule=!0},24:function(e,t,l){var c=l(23);e.exports=function(e,t){if(e){if("string"==typeof e)return c(e,t);var l=Object.prototype.toString.call(e).slice(8,-1);return"Object"===l&&e.constructor&&(l=e.constructor.name),"Map"===l||"Set"===l?Array.from(e):"Arguments"===l||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(l)?c(e,t):void 0}},e.exports.default=e.exports,e.exports.__esModule=!0},27:function(e,t){e.exports=function(e){if(Array.isArray(e))return e},e.exports.default=e.exports,e.exports.__esModule=!0},28:function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var l=[],_n=!0,c=!1,r=void 0;try{for(var n,o=e[Symbol.iterator]();!(_n=(n=o.next()).done)&&(l.push(n.value),!t||l.length!==t);_n=!0);}catch(e){c=!0,r=e}finally{try{_n||null==o.return||o.return()}finally{if(c)throw r}}return l}},e.exports.default=e.exports,e.exports.__esModule=!0},29:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.default=e.exports,e.exports.__esModule=!0},32:function(e,t,l){"use strict";l.d(t,"a",(function(){return a}));var c=l(0),r=l(6),n=l(1),o=l(7),i=l(18);function a(){var e=Object(o.useDispatch)(i.store).removeNotice,t=Object(o.useSelect)((function(e){return e(i.store).getNotices()}),[]),l=Object(r.filter)(t,{isDismissible:!0,type:"default"}),a=Object(r.filter)(t,{isDismissible:!1,type:"default"}),s=Object(r.filter)(t,{type:"snackbar"});return Object(c.createElement)(c.Fragment,null,Object(c.createElement)(n.NoticeList,{notices:a,className:"formello-notices__notice-list"}),Object(c.createElement)(n.NoticeList,{notices:l,className:"formello-notices__notice-list",onRemove:e}),Object(c.createElement)(n.SnackbarList,{notices:s,className:"formello-notices__snackbar-list",onRemove:e}))}},4:function(e,t,l){"use strict";l.d(t,"a",(function(){return n}));var c=l(0),r=wp.element.createElement;function n(e){return"form"===e?r("svg",{width:50,height:50,viewBox:"0 0 50 50",style:{padding:"1px"}},r("path",{d:"M 2.8125 2 A 1.0001 1.0001 0 0 0 2 3 L 2 47 A 1.0001 1.0001 0 0 0 3 48 L 47 48 A 1.0001 1.0001 0 0 0 48 47 L 48 3 A 1.0001 1.0001 0 0 0 47 2 L 3 2 A 1.0001 1.0001 0 0 0 2.90625 2 A 1.0001 1.0001 0 0 0 2.8125 2 z M 4 4 L 46 4 L 46 46 L 4 46 L 4 4 z M 18 11 L 18 12 L 18 18 L 18 19 L 19 19 L 41 19 L 42 19 L 42 18 L 42 12 L 42 11 L 41 11 L 19 11 L 18 11 z M 20 13 L 40 13 L 40 17 L 20 17 L 20 13 z M 8 14 L 8 16 L 16 16 L 16 14 L 8 14 z M 18 23 L 18 24 L 18 30 L 18 31 L 19 31 L 41 31 L 42 31 L 42 30 L 42 24 L 42 23 L 41 23 L 19 23 L 18 23 z M 20 25 L 40 25 L 40 29 L 20 29 L 20 25 z M 8 26 L 8 28 L 16 28 L 16 26 L 8 26 z M 18 35 L 18 36 L 18 40 L 18 41 L 19 41 L 23 41 L 24 41 L 24 40 L 24 36 L 24 35 L 23 35 L 19 35 L 18 35 z M 20 37 L 22 37 L 22 39 L 20 39 L 20 37 z M 26 37 L 26 39 L 42 39 L 42 37 L 26 37 z",fill:"#1e72bd"})):"text"===e?r("svg",{width:16,height:16,viewBox:"0 0 16 16",style:{padding:"1px"}},r("path",{d:"M16 5c0-0.6-0.4-1-1-1h-14c-0.6 0-1 0.4-1 1v6c0 0.6 0.4 1 1 1h14c0.6 0 1-0.4 1-1v-6zM15 11h-14v-6h14v6z",fill:"#1e72bd"}),r("path",{d:"M2 6h1v4h-1v-4z",fill:"#1e72bd"})):"textarea"===e?r("svg",{width:16,height:16,viewBox:"0 0 16 16",style:{padding:"1px"}},r("path",{d:"M2 2h1v4h-1v-4z",fill:"#1e72bd"}),r("path",{d:"M1 0c-0.6 0-1 0.4-1 1v14c0 0.6 0.4 1 1 1h15v-16h-15zM13 15h-12v-14h12v14zM15 15v0h-1v-1h1v1zM15 13h-1v-10h1v10zM15 2h-1v-1h1v1z",fill:"#1e72bd"})):"email"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24",style:{padding:"1px"}},r("path",{d:"m11.5 4c-4.692 0-8.5 3.808-8.5 8.5s3.808 8.5 8.5 8.5h4.25v-1.7h-4.25c-3.689 0-6.8-3.111-6.8-6.8s3.111-6.8 6.8-6.8 6.8 3.111 6.8 6.8v1.2155c0 .6715-.6035 1.3345-1.275 1.3345s-1.275-.663-1.275-1.3345v-1.2155c0-2.346-1.904-4.25-4.25-4.25s-4.25 1.904-4.25 4.25 1.904 4.25 4.25 4.25c1.173 0 2.244-.476 3.009-1.2495.5525.7565 1.5045 1.2495 2.516 1.2495 1.6745 0 2.975-1.36 2.975-3.0345v-1.2155c0-4.692-3.808-8.5-8.5-8.5zm0 11.05c-1.411 0-2.55-1.139-2.55-2.55s1.139-2.55 2.55-2.55 2.55 1.139 2.55 2.55-1.139 2.55-2.55 2.55z",fill:"#1e72bd"})):"hidden"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24",style:{padding:"1px"}},r("path",{d:"m12.0041 8.15789c2.2592 0 4.0928 1.76843 4.0928 3.94741 0 .5131-.1065.9947-.2947 1.4447l2.3902 2.3053c1.236-.9948 2.2101-2.2816 2.8076-3.75-1.4161-3.46583-4.9113-5.92109-9.0041-5.92109-1.146 0-2.24283.19737-3.25784.55263l1.76804 1.70527c.4666-.18158.9659-.28422 1.498-.28422zm-8.18555-2.15526 1.86631 1.8.37653.36316c-1.3588 1.01842-2.42292 2.37631-3.06139 3.93951 1.4161 3.4658 4.91132 5.921 9.0041 5.921 1.2688 0 2.4802-.2368 3.5853-.6631l.3438.3315 2.3983 2.3053 1.0396-1.0026-14.51298-13.9974zm4.52661 4.36577 1.26876 1.2237c-.04093.1658-.06549.3395-.06549.5132 0 1.3105 1.09687 2.3684 2.45567 2.3684.1801 0 .3602-.0237.5321-.0632l1.2687 1.2237c-.5484.2605-1.1541.4184-1.8008.4184-2.25922 0-4.09278-1.7684-4.09278-3.9473 0-.6237.16371-1.2079.43384-1.7369zm3.52794-.61577 2.5785 2.48687.0163-.1263c0-1.3106-1.0968-2.36846-2.4556-2.36846z",fill:"#1e72bd"})):"radio"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("circle",{cx:"12",cy:"12",fill:"none",r:"7.25",strokeWidth:"1.5",stroke:"#1e72bd"}),r("circle",{cx:"12",cy:"12",r:"4",fill:"#1e72bd"}),r("circle",{cx:"12",cy:"12",fill:"#1e72bd",r:"4"})):"button"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("path",{d:"m5 7.25h14c.6904 0 1.25.55964 1.25 1.25v7c0 .6904-.5596 1.25-1.25 1.25h-14c-.69036 0-1.25-.5596-1.25-1.25v-7c0-.69036.55964-1.25 1.25-1.25z",stroke:"#1e72bd",strokeWidth:"1.5",fill:"none"}),r("path",{clipRule:"evenodd",d:"m16 12.75h-8v-1.5h8z",fill:"#1e72bd",fillRule:"evenodd"})):"checkbox"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("circle",{cx:"12",cy:"12",fill:"#1e72bd",r:"8"}),r("path",{d:"m14.9586 9.09098-3.9304 5.28592-2.27901-1.6946",stroke:"#ffffff",strokeWidth:"1.5"})):"url"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("circle",{cx:"12",cy:"12",stroke:"#1e72bd",strokeWidth:"1.5",r:"7.25",fill:"none"}),r("path",{d:"m10.5018 11.3502 4.4504-2.98515-1.4486 4.72825-4.45583 2.9533z",fill:"#1e72bd"})):"date2"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("path",{d:"m5 3.75h14c.6904 0 1.25.55964 1.25 1.25v14c0 .6904-.5596 1.25-1.25 1.25h-14c-.69036 0-1.25-.5596-1.25-1.25v-14c0-.69036.55964-1.25 1.25-1.25z",fill:"none",stroke:"#1e72bd",strokeWidth:"1.5"}),r("path",{d:"m11.6959 13.9724c.3563-.5469.599-.9586.7281-1.2351.1351-.2765.2027-.5376.2027-.7834 0-.2642-.0768-.47-.2304-.6175-.1475-.1536-.3533-.2304-.6175-.2304-.2949 0-.5684.0707-.8203.212s-.4977.3318-.7373.5714l-.1475-1.1889c.2888-.2335.5899-.4086.9033-.5254.3133-.1167.6605-.1751 1.0414-.1751.3748 0 .6943.0799.9586.2396.2642.1536.4608.3626.5898.6268.1352.2642.2028.556.2028.8755 0 .3626-.0799.7343-.2396 1.1152-.1537.381-.4271.8695-.8203 1.4655l-.7558 1.1521h2.0461v1.1059h-4z",fill:"#1e72bd"}),r("path",{d:"m3 5c0-1.10457.89543-2 2-2h14c1.1046 0 2 .89543 2 2v2h-18z",fill:"#1e72bd"})):"range"===e?r("svg",{width:24,height:24,viewBox:"0 0 100 125"},r("path",{d:"M92.5,55h-35v-2.5c0-0.663-0.263-1.299-0.732-1.768l-5-5c-0.976-0.977-2.56-0.977-3.535,0l-5,5  C42.763,51.201,42.5,51.837,42.5,52.5V55h-35C6.119,55,5,56.119,5,57.5S6.119,60,7.5,60h35v5c0,1.381,1.119,2.5,2.5,2.5h10  c1.381,0,2.5-1.119,2.5-2.5v-5h35c1.381,0,2.5-1.119,2.5-2.5S93.881,55,92.5,55z M52.5,62.5h-5v-8.964l2.5-2.5l2.5,2.5V62.5z",fill:"#1e72bd"})):"date"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24"},r("rect",{fill:"none"}),r("path",{d:"M7.658955651261607,13.044688809734232 C7.977041603545274,12.738836932539332 8.074914204247236,12.543091731134908 8.074914204247236,12.543091731134908 L8.099382354424876,12.543091731134908 C8.099382354424876,12.543091731134908 8.087148279333377,12.812241383065864 8.087148279333377,13.081391034997498 L8.087148279333377,18.657070756258598 L6.179652071895973,18.657070756258598 L6.179652071895973,19.708181707551397 L11.144647545025876,19.708181707551397 L11.144647545025876,18.657070756258598 L9.26161948776327,18.657070756258598 L9.26161948776327,11.07602222685669 L8.186040386294607,11.07602222685669 L6.119501202716748,13.081391034997498 L6.852526201724231,13.839903690440682 L7.658955651261607,13.044688809734232 zM12.149880714739453,19.048561159068107 C12.149880714739453,19.257559941817817 12.174348864914407,19.476753787140524 12.211051090178003,19.708181707551397 L17.774496736349533,19.708181707551397 L17.774496736349533,18.657070756258598 L13.495628974398741,18.657070756258598 C13.519077618314284,16.68840417338144 17.63992191038666,16.248996976478388 17.63992191038666,13.410691556110702 C17.63992191038666,11.91915390165735 16.50419193973603,10.92717431328861 14.913762178323168,10.92717431328861 C12.969563745622182,10.92717431328861 12.186582940003177,12.565520868795744 12.186582940003177,12.565520868795744 L13.078650915153801,13.163971041840252 C13.078650915153801,13.163971041840252 13.690354669543611,12.06290428393891 14.828123652709905,12.06290428393891 C15.732425702946557,12.06290428393891 16.379812176340693,12.636886306807579 16.379812176340693,13.493271562953517 C16.379812176340693,15.528206052555962 12.149880714739453,15.96863275571652 12.149880714739453,19.048561159068107 zM7.90567616553372,1.1021925115345663 L5.866663650900151,1.1021925115345663 L5.866663650900151,4.502245879683507 L7.90567616553372,4.502245879683507 L7.90567616553372,1.1021925115345663 zM19.120244996008708,2.290936807565238 L19.120244996008708,5.522771643256753 L15.042219966744426,5.522771643256753 L15.042219966744426,2.290936807565238 L8.925182422849176,2.290936807565238 L8.925182422849176,5.520732630742085 L4.849196406100532,5.520732630742085 L4.849196406100532,2.290936807565238 L2.3830107696517473,2.290936807565238 L2.3830107696517473,24.382617897345305 L21.583372113685343,24.382617897345305 L21.583372113685343,2.290936807565238 L19.120244996008708,2.290936807565238 zM20.564885362626427,23.362092133772002 L3.4035365332263297,23.362092133772002 L3.4035365332263297,8.155136799646591 L20.564885362626427,8.155136799646591 L20.564885362626427,23.362092133772002 zM18.10073873869338,1.1021925115345663 L16.061726224059797,1.1021925115345663 L16.061726224059797,4.502245879683507 L18.10073873869338,4.502245879683507 L18.10073873869338,1.1021925115345663 z",fill:"#1e72bd"})):"radios"===e?r("svg",{width:24,height:24,viewBox:"0 0 100 125"},r("rect",{fill:"none"}),r("path",{d:"M20,32.5c6.893,0,12.5-5.607,12.5-12.5S26.893,7.5,20,7.5S7.5,13.107,7.5,20S13.107,32.5,20,32.5z M20,12.5  c4.136,0,7.5,3.364,7.5,7.5s-3.364,7.5-7.5,7.5s-7.5-3.364-7.5-7.5S15.864,12.5,20,12.5z",fill:"#1e72bd"}),r("path",{d:"M20,25c2.757,0,5-2.243,5-5s-2.243-5-5-5s-5,2.243-5,5S17.243,25,20,25z",fill:"#1e72bd"}),r("path",{d:"M20,62.5c6.893,0,12.5-5.607,12.5-12.5S26.893,37.5,20,37.5S7.5,43.107,7.5,50S13.107,62.5,20,62.5z M20,42.5  c4.136,0,7.5,3.364,7.5,7.5s-3.364,7.5-7.5,7.5s-7.5-3.364-7.5-7.5S15.864,42.5,20,42.5z",fill:"#1e72bd"}),r("path",{d:"M20,92.5c6.893,0,12.5-5.607,12.5-12.5S26.893,67.5,20,67.5S7.5,73.107,7.5,80S13.107,92.5,20,92.5z M20,72.5  c4.136,0,7.5,3.364,7.5,7.5s-3.364,7.5-7.5,7.5s-7.5-3.364-7.5-7.5S15.864,72.5,20,72.5z",fill:"#1e72bd"}),r("path",{d:"M92.5,17.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,17.5,92.5,17.5z",fill:"#1e72bd"}),r("path",{d:"M92.5,47.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,47.5,92.5,47.5z",fill:"#1e72bd"}),r("path",{d:"M92.5,77.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,77.5,92.5,77.5z",fill:"#1e72bd"})):"checkboxes"===e?r("svg",{width:24,height:24,viewBox:"0 0 100 125"},r("rect",{fill:"none"}),r("path",{d:"M92.5,17.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,17.5,92.5,17.5z",fill:"#1e72bd"}),r("path",{d:"M92.5,47.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,47.5,92.5,47.5z",fill:"#1e72bd"}),r("path",{d:"M92.5,77.5H45c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h47.5c1.381,0,2.5-1.119,2.5-2.5S93.881,77.5,92.5,77.5z",fill:"#1e72bd"}),r("path",{d:"M10,32.5h20c1.381,0,2.5-1.119,2.5-2.5V10c0-1.381-1.119-2.5-2.5-2.5H10c-1.381,0-2.5,1.119-2.5,2.5v20  C7.5,31.381,8.619,32.5,10,32.5z M12.5,12.5h15v15h-15V12.5z",fill:"#1e72bd"}),r("path",{d:"M7.5,60c0,1.381,1.119,2.5,2.5,2.5h20c1.381,0,2.5-1.119,2.5-2.5V40c0-1.381-1.119-2.5-2.5-2.5H10  c-1.381,0-2.5,1.119-2.5,2.5V60z M12.5,42.5h15v3.232l-6.25,6.25l-4.116-4.116c-0.488-0.488-1.279-0.488-1.768,0  s-0.488,1.279,0,1.768l5,5C20.61,54.878,20.93,55,21.25,55s0.64-0.122,0.884-0.366l5.366-5.366V57.5h-15V42.5z",fill:"#1e72bd"}),r("path",{d:"M7.5,90c0,1.381,1.119,2.5,2.5,2.5h20c1.381,0,2.5-1.119,2.5-2.5V70c0-1.381-1.119-2.5-2.5-2.5H10  c-1.381,0-2.5,1.119-2.5,2.5V90z M12.5,72.5h15v15h-15V72.5z",fill:"#1e72bd"})):"number"===e?r("svg",{width:24,height:24,viewBox:"0 0 100 125"},r("rect",{fill:"none"}),r("path",{d:"M62.21,22l-1.5,13h-18l1.5-13h-6l-1.5,13H22v6H36L33.94,59H22v6H33.25l-1.5,13h6l1.5-13h18l-1.5,13h6l1.5-13H78V59H64l2.08-18H78V35H66.75l1.5-13ZM57.94,59H40l2.08-18H60Z",fill:"#1e72bd"})):"fieldset"===e?r("svg",{width:24,height:24,viewBox:"0 0 100 125"},r("rect",{fill:"none"}),r("path",{d:"M0,0v100h100V0H0z M94.444,94.444H5.556V5.556h88.889L94.444,94.444L94.444,94.444z",fill:"#1e72bd"}),r("path",{d:"M81.333,27H19.556v16.5h61.778L81.333,27L81.333,27z M75.778,37.945H25.111v-5.389h50.667V37.945z",fill:"#1e72bd"}),r("path",{d:"M81.333,71.111H19.556v16.556h61.778L81.333,71.111L81.333,71.111z M75.778,82.111H25.111v-5.445h50.667V82.111z",fill:"#1e72bd"}),r("rect",{fill:"#1e72bd",x:"20.444",y:"13.278",width:"36.667",height:"5.556"}),r("rect",{fill:"#1e72bd",x:"20.444",y:"58.278",width:"36.667",height:"5.556"})):"color"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0",y:"0",viewBox:"0 0 100 100"},Object(c.createElement)("path",{d:"M55 959.362c-26.753 0-39 22-39 42 0 19 10.745 43.494 29 44 6.095 0 15-3 18-29 3-24 21-17 21-34 0-12-12-23-29-23zm0 9a7 7 0 110 14 7 7 0 010-14zm-19 12a7 7 0 110 14 7 7 0 010-14zm-3.5 24a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm10.5 19a6 6 0 110 12 6 6 0 010-12z",color:"#1e72bd",enableBackground:"accumulate",overflow:"visible",transform:"translate(0 -952.362)"})):"tel"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0",y:"0",viewBox:"0 0 100 100"},Object(c.createElement)("path",{color:"#1e72bd",d:"M94.077 80.619C88.979 92.841 77.026 94.983 73.12 94.983c-1.147 0-19.01.947-44.688-23.41C7.767 51.971 5.242 30.892 5.022 26.887c-.214-3.901.903-13.687 14.365-20.958 1.668-.901 4.975-1.3 5.829-.446.379.379 11.678 18.972 11.975 19.588.297.615.446 1.221.446 1.815 0 .849-.605 1.911-1.816 3.185a30.947 30.947 0 01-3.949 3.503 38.454 38.454 0 00-3.95 3.376c-1.21 1.188-1.815 2.166-1.815 2.93.082 1.983 1.707 9.086 14.086 19.963C52.574 70.723 58.538 73.788 59.111 74c.574.212 1.051.317 1.433.317.765 0 1.742-.604 2.931-1.814 1.188-1.211 5.185-6.689 6.459-7.9 1.274-1.209 2.336-1.814 3.186-1.814.594 0 1.199.148 1.814.445.616.297 19.233 11.191 19.589 11.555.966.99.284 4.08-.446 5.83"})):"select"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 64 64"},Object(c.createElement)("g",null,Object(c.createElement)("path",{d:"M61,43.5H3c-0.829,0-1.5-0.672-1.5-1.5V22c0-0.828,0.671-1.5,1.5-1.5h58c0.829,0,1.5,0.672,1.5,1.5v20   C62.5,42.828,61.829,43.5,61,43.5z M4.5,40.5h55v-17h-55V40.5z",fill:"#1e72bd"}),Object(c.createElement)("path",{d:"M39.864,43.5c-0.829,0-1.5-0.672-1.5-1.5V22c0-0.828,0.671-1.5,1.5-1.5s1.5,0.672,1.5,1.5v20   C41.364,42.828,40.693,43.5,39.864,43.5z",fill:"#1e72bd"}),Object(c.createElement)("path",{d:"M50.433,35.131c-0.421,0-0.823-0.177-1.107-0.488l-2.98-3.262c-0.559-0.611-0.516-1.561,0.096-2.119   c0.611-0.558,1.561-0.517,2.119,0.096l1.873,2.05l1.873-2.05c0.559-0.611,1.509-0.653,2.119-0.096   c0.612,0.559,0.654,1.508,0.096,2.119l-2.98,3.262C51.256,34.954,50.854,35.131,50.433,35.131z",fill:"#1e72bd"}))):"actions"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",version:"1.1",viewBox:"0 0 215 310",x:"0px",y:"0px"},Object(c.createElement)("g",null,Object(c.createElement)("polygon",{points:"215,124 0,0 0,248 ",color:"#1e72bd"}))):"time"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",version:"1.1",x:"0px",y:"0px",viewBox:"0 0 100 100"},Object(c.createElement)("g",{transform:"translate(0,-952.36218)"},Object(c.createElement)("path",{d:"m 50,961.36216 c -22.6081,0 -40.9999999,18.39194 -40.9999999,41.00004 0,22.608 18.3918999,41 40.9999999,41 22.6081,0 41,-18.392 41,-41 0,-22.6081 -18.3919,-41.00004 -41,-41.00004 z m 0,6 c 19.3654,0 35,15.63462 35,35.00004 0,19.3654 -15.6346,35 -35,35 -19.3654,0 -35,-15.6346 -35,-35 0,-19.36542 15.6346,-35.00004 35,-35.00004 z m 0,5 c -1.6568,0 -3,1.3432 -3,3 l 0,27.00004 c 0,1.1094 0.6046,2.0747 1.5,2.5937 l 21.6562,12.5 c 1.4348,0.8284 3.2654,0.3412 4.0938,-1.0937 0.8284,-1.4348 0.3412,-3.2654 -1.0938,-4.0938 L 53,1000.6434 53,975.36216 c 0,-1.6568 -1.3431,-3 -3,-3 z",fillOpacity:"1",stroke:"none",fill:"#1e72bd"}))):"input-button"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 64 64"},Object(c.createElement)("g",null,Object(c.createElement)("path",{d:"M61,43.5H3c-0.829,0-1.5-0.672-1.5-1.5V22c0-0.828,0.671-1.5,1.5-1.5h58c0.829,0,1.5,0.672,1.5,1.5v20   C62.5,42.828,61.829,43.5,61,43.5z M4.5,40.5h55v-17h-55V40.5z",fill:"#1e72bd"}),Object(c.createElement)("path",{d:"M39.864,43.5c-0.829,0-1.5-0.672-1.5-1.5V22c0-0.828,0.671-1.5,1.5-1.5s1.5,0.672,1.5,1.5v20   C41.364,42.828,40.693,43.5,39.864,43.5z",fill:"#1e72bd"}))):"gradient"===e?r("svg",{width:24,height:24,viewBox:"0 0 24 24",fillRule:"evenodd"},r("path",{d:"M17.66 8L12 2.35L6.34 8A8.02 8.02 0 0 0 4 13.64c0 2 .78 4.11 2.34 5.67a7.99 7.99 0 0 0 11.32 0c1.56-1.56 2.34-3.67 2.34-5.67S19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"})):"mailchimp"===e?Object(c.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",version:"1",viewBox:"0 0 200 200"},Object(c.createElement)("path",{d:"M784 1976c-89-29-165-72-262-149-231-183-430-458-477-659-17-71-17-77-1-126 13-38 29-62 61-87l42-35-5-88c-4-74-1-96 16-134 41-93 150-178 228-178 30 0 36-5 66-62 20-40 65-95 118-149 73-73 100-94 180-132 113-54 195-75 321-83 358-23 670 184 744 493 24 98 16 149-27 188-47 42-60 85-41 135 37 94-22 174-162 215l-40 12-6 104c-6 109-31 190-70 225-18 16-17 18 26 73 70 90 98 160 93 237-5 73-26 104-93 135-76 35-232 21-358-33l-47-21-55 52c-55 52-123 91-160 90-11 0-52-10-91-23zm181-97c25-23 45-47 45-53-1-6-40-36-88-66-255-161-424-344-533-580-22-47-43-91-47-98-4-8-25-20-46-27-21-8-55-29-75-49l-36-35-32 25c-43 33-57 85-42 155 65 308 518 765 762 768 42 1 52-4 92-40zm160-239c-18-19-17-20 1-20 26 0 137-29 146-38 4-4-59-7-140-7-135 0-154-2-228-28-45-15-107-43-138-62-31-18-56-30-56-25 0 19 208 189 233 190 4 0 3-9-3-19-19-36-10-42 33-20 51 27 114 47 146 48 23 1 24 0 6-19zm302-250c29-27 40-69 47-184 4-55 12-106 18-113s32-19 58-27c65-19 126-52 134-71 23-60-29-128-138-179-109-52-199-70-353-68l-132 1-26-30c-32-39-34-104-4-143 38-48 94-69 196-74 154-7 311 41 402 123 50 46 47 55-7 21-158-99-404-135-514-74-24 13-44 31-46 41-3 14 2 16 30 9 56-12 246-9 260 5 10 10-8 13-87 13-86 0-137 7-192 25-7 2-10 11-7 20 5 12 29 15 139 15 188 0 311 29 428 101 26 16 49 29 52 29s10-21 16-46c9-34 18-48 37-55 23-9 24-13 20-68-15-211-264-394-518-378-161 9-273 75-332 194-30 61-33 76-33 153 1 91 20 150 70 216 14 18 25 39 25 46s-20 38-45 68c-90 109-96 227-16 313 49 54 75 61 207 58l120-2 60 40c66 45 100 51 131 21zM471 977c117-78 131-303 24-373-35-23-112-21-161 4-79 41-124 111-124 196 0 66 12 101 48 140 56 59 152 75 213 33z",transform:"matrix(.1 0 0 -.1 0 200)"}),Object(c.createElement)("path",{d:"M1360 1220c-11-21 1-95 19-113 17-17 42-17 48-1 9 23-7 102-23 119-20 20-31 19-44-5zM1013 1086c-33-28-27-41 11-26 36 13 99 13 131-2 37-17 44 0 12 28-39 34-115 34-154 0zM1397 1044c-12-12-8-41 7-53 17-14 39 9 34 36-3 18-29 29-41 17zM1091 1027c-34-17-42-42-10-31 13 5 41 9 62 8 41 0 48 10 18 26-25 13-40 13-70-3zM1294 995c-7-18 13-45 33-45 23 0 28 31 8 46-24 18-34 18-41-1zM325 908c-30-27-47-79-33-99 5-8 11-10 14-4 22 50 32 60 61 63 45 4 67-29 51-80-20-66 17-121 65-96 20 10 23 30 5 27-35-4-40 1-33 34 3 17 9 53 12 78 4 42 2 48-27 72-39 33-80 35-115 5z",transform:"matrix(.1 0 0 -.1 0 200)"})):"webhooks"===e?"admin-links":"asterisk"===e?Object(c.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Object(c.createElement)("path",{d:"M10.5999 2.50002C10.5999 2.16865 10.3313 1.90002 9.9999 1.90002C9.66853 1.90002 9.3999 2.16865 9.3999 2.50002V8.55136L5.12094 4.27239C4.88662 4.03808 4.50672 4.03808 4.27241 4.27239C4.03809 4.50671 4.03809 4.8866 4.27241 5.12092L8.55146 9.39997H2.4999C2.16853 9.39997 1.8999 9.6686 1.8999 9.99998C1.8999 10.3313 2.16853 10.6 2.4999 10.6H8.5516L4.27251 14.8791C4.0382 15.1134 4.0382 15.4933 4.27251 15.7276C4.50683 15.9619 4.88673 15.9619 5.12104 15.7276L9.3999 11.4487V17.5C9.3999 17.8314 9.66853 18.1 9.9999 18.1C10.3313 18.1 10.5999 17.8314 10.5999 17.5V11.4484L14.879 15.7275C15.1133 15.9618 15.4932 15.9618 15.7275 15.7275C15.9619 15.4932 15.9619 15.1133 15.7275 14.879L11.4485 10.6H17.4999C17.8313 10.6 18.0999 10.3313 18.0999 9.99998C18.0999 9.6686 17.8313 9.39997 17.4999 9.39997H11.4487L15.7276 5.12099C15.962 4.88667 15.962 4.50677 15.7276 4.27246C15.4933 4.03815 15.1134 4.03815 14.8791 4.27246L10.5999 8.55167V2.50002Z",fill:"#212121",stroke:"currentColor"})):"logo"===e?Object(c.createElement)("svg",{version:"1.0",xmlns:"http://www.w3.org/2000/svg",width:"256.000000pt",height:"256.000000pt",viewBox:"0 0 256.000000 256.000000",preserveAspectRatio:"xMidYMid meet"},Object(c.createElement)("g",{transform:"translate(0.000000,256.000000) scale(0.100000,-0.100000)",fill:"#9b51e0",stroke:"none"},Object(c.createElement)("path",{d:"M0 1280 l0 -1280 1280 0 1280 0 0 1280 0 1280 -1280 0 -1280 0 0\r -1280z m1456 666 c29 -7 78 -28 111 -45 67 -36 183 -146 168 -160 -26 -23\r -319 -231 -326 -231 -5 0 -9 5 -9 10 0 6 -11 22 -25 35 -30 31 -83 33 -116 6\r -22 -18 -24 -27 -27 -140 l-4 -121 66 0 66 0 0 -185 0 -185 -65 0 -65 0 0\r -170 0 -170 -205 0 -205 0 0 448 c0 355 3 461 15 517 39 186 182 342 356 389\r 69 19 199 20 265 2z"}))):void 0}},5:function(e,t,l){var c=l(27),r=l(28),n=l(24),o=l(29);e.exports=function(e,t){return c(e)||r(e,t)||n(e,t)||o()},e.exports.default=e.exports,e.exports.__esModule=!0},6:function(e,t){e.exports=window.lodash},7:function(e,t){e.exports=window.wp.data}});