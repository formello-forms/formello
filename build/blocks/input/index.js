(()=>{var e={184:(e,t)=>{var a;!function(){"use strict";var l={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var a=arguments[t];if(a){var n=typeof a;if("string"===n||"number"===n)e.push(a);else if(Array.isArray(a)){if(a.length){var o=r.apply(null,a);o&&e.push(o)}}else if("object"===n)if(a.toString===Object.prototype.toString)for(var i in a)l.call(a,i)&&a[i]&&e.push(i);else e.push(a.toString())}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(a=function(){return r}.apply(t,[]))||(e.exports=a)}()}},t={};function a(l){var r=t[l];if(void 0!==r)return r.exports;var n=t[l]={exports:{}};return e[l](n,n.exports,a),n.exports}a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var l in t)a.o(t,l)&&!a.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:t[l]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=window.wp.blocks,t=window.wp.i18n,l=window.wp.blockEditor,r=window.wp.components;var n=a(184),o=a.n(n);const i=window.React;var s;function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},c.apply(null,arguments)}var u,d,p,m,h,b,g,f,v,x,y,w=function(e){return i.createElement("svg",c({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},e),s||(s=i.createElement("path",{fill:"currentColor",d:"M12.75 6h-1.5v4.19L8.288 7.226l-1.061 1.06 2.962 2.963H6v1.5h4.19l-2.963 2.962 1.06 1.061 2.963-2.962V18h1.5v-4.19l2.962 2.963 1.061-1.06-2.962-2.963H18v-1.5h-4.19l2.963-2.962-1.06-1.061-2.963 2.962V6Z"})))};function _(){return _=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},_.apply(null,arguments)}function j(){return j=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},j.apply(null,arguments)}function C(){return C=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},C.apply(null,arguments)}function k(){return k=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},k.apply(null,arguments)}function T(){return T=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},T.apply(null,arguments)}function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},O.apply(null,arguments)}function M(){return M=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},M.apply(null,arguments)}var B,E=function(e){return i.createElement("svg",M({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 1000 1000"},e),y||(y=i.createElement("path",{fill:"currentColor",d:"M499 270q57 0 104.5 28t75.5 76 28 104q0 39-15 76l122 122q97-81 142-198-36-91-104-162T694 206q-93-40-195-40-86 0-166 29l90 90q38-15 76-15zM83 157l95 94 19 20q-52 40-91.5 93T42 478q36 91 104.5 162T304 750q93 40 195 40 95 0 183-35l139 139 53-53-738-737zm230 230 65 64q-4 15-4 27 0 34 17 62.5t45.5 45.5 62.5 17q14 0 27-3l65 64q-45 22-92 22-56 0-104-28t-76-76-28-104q0-47 22-91zm180-33 131 131v-6q0-34-16.5-63t-45-45.5T500 354h-7z"})))};function q(){return q=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},q.apply(null,arguments)}var P,A,S,z,H,L,I,N,V=function(e){return i.createElement("svg",q({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",width:800,height:800,viewBox:"0 0 48 48"},e),B||(B=i.createElement("path",{d:"M8 9h2v30H8v3h8v-3h-2V9h2V6H8zM4 16h3.021v-4H0v24h7.042v-4H4zM16.979 12v4H44v16H16.958v4H48V12z"})))};function F(){return F=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},F.apply(null,arguments)}function R(){return R=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},R.apply(null,arguments)}function Z(){return Z=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},Z.apply(null,arguments)}function D(){return D=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},D.apply(null,arguments)}function U(){return U=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},U.apply(null,arguments)}function $(){return $=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)({}).hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},$.apply(null,arguments)}const W=window.ReactJSXRuntime;function G({attributes:e,setAttributes:a}){const{labelClass:r,labelAlign:n,labelVAlign:i,hideLabel:s,required:c,multiple:u,type:d,label:p,requiredText:m}=e,h=o()("label-div",r,n,i,{hide:s,required:c,"textarea-label":u||"textarea"===d});return(0,W.jsxs)("div",{className:h,htmlFor:"input",children:[(0,W.jsx)(l.RichText,{tagName:"span",value:p,onChange:e=>a({label:e}),placeholder:(0,t.__)("Enter label…","formello"),allowedFormats:["core/bold","core/italic","core/link"]}),c&&(0,W.jsx)("span",{className:"required",children:m})]})}const Y=window.wp.element,J=window.wp.hooks,X=window.wp.coreData,K=window.wp.data,Q=["formello/input","formello/select","formello/textarea","formello/multichoices"];function ee(e){const t=(0,K.select)(l.store).getBlockParentsByBlockName(e,"formello/form");if(t.length)return t[0];const a=(0,K.select)(l.store).getBlock(e);return"formello/form"===a.name?a:void 0}function te(e){const t=[];return(0,K.select)(l.store).getClientIdsOfDescendants([e]).forEach((e=>{const a=(0,K.select)(l.store).getBlock(e);Q.includes(a.name)&&t.push(a)})),t}function ae(e){let t=[];const a=ee(e);return a&&(t=function(e){const t=[];return te(e).forEach((e=>{t.push({title:e.attributes.name,tag:"{{fields."+e.attributes.name+"}}"})})),t}(a.clientId)),[{title:"All Data",tag:"{{fields.all_data}}"},...t]}function le(){const{postType:e,postId:t}=(0,K.useSelect)((e=>({postType:e("core/editor").getCurrentPostType(),postId:e("core/editor").getCurrentPostId()}))),[a]=(0,X.useEntityProp)("postType",e,"meta",t),l=[];for(const e in a){if(a[e]!==Object(e))continue;const t={title:e,tag:`{{meta.${e}}}`};l.push(t)}return l}function re({tabs:e,onChange:t}){const[a,l]=(0,Y.useState)("");return(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.SearchControl,{value:a,onChange:l}),(0,W.jsx)(r.TabPanel,{tabs:e,children:e=>e.data.filter((e=>(e=>""===a||-1!==e.title.toLowerCase().search(a.toLowerCase()))(e))).map((e=>(0,W.jsx)(r.MenuItem,{onClick:()=>t(e.tag),info:e.description,children:e.title},e.title)))})]})}function ne(e){const{label:t,value:a,placeholder:l,help:n,onChange:o,icon:i="list-view",clientId:s}=e,c=function(e){return[{name:"fields",title:"Fields",data:ae(e)},{name:"wordpress",title:"WordPress",data:[{title:"Post ID",tag:"{{wp.post_id}}"},{title:"Post Title",tag:"{{wp.post_title}}"},{title:"Post URL",tag:"{{wp.post_url}}"},{title:"Post Author",tag:"{{wp.post_author}}"},{title:"Post Author Email",tag:"{{wp.post_author_email}}"},{title:"User ID",tag:"{{wp.user_id}}"},{title:"User First Name",tag:"{{wp.user_first_name}}"},{title:"User Last Name",tag:"{{wp.user_last_name}}"},{title:"User Display Name",tag:"{{wp.user_display_name}}"},{title:"User Username",tag:"{{wp.user_username}}"},{title:"User Email",tag:"{{wp.user_email}}"},{title:"User URL",tag:"{{wp.user_url}}"},{title:"Site Title",tag:"{{wp.site_title}}"},{title:"Site URL",tag:"{{wp.site_url}}"},{title:"Admin Email",tag:"{{wp.admin_email}}"}]},{name:"meta",title:"Meta",data:le()},{name:"other",title:"Other",data:[{title:"Date",tag:"{{other.system_date}}"},{title:"Time",tag:"{{other.system_time}}"},{title:"Referrer URL",tag:"{{other.referrer}}"},{title:"User IP",tag:"{{other.user_ip}}"}]}]}(s);return(0,W.jsx)(r.BaseControl,{children:(0,W.jsx)(r.__experimentalInputControl,{value:a,label:t,onChange:o,placeholder:l,help:n,suffix:(0,W.jsx)(r.DropdownMenu,{icon:i,label:t,toggleProps:{isSmall:!0},children:()=>(0,W.jsx)(re,{tabs:c,onChange:o})})})})}const oe={hidden:["name","id","type","value"],text:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],tel:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],url:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],email:["name","id","type","value","required","readonly","disabled","placeholder","autocomplete"],password:["name","id","type","required","readonly","disabled","pattern","maxlength","minlength","autocomplete"],number:["name","id","type","value","required","readonly","disabled","placeholder","step","min","max"],date:["name","id","type","value","required","readonly","disabled","step","min","max"],time:["name","id","type","value","required","readonly","disabled","step","min","max"],range:["name","id","type","value","required","readonly","disabled","step","min","max"],checkbox:["name","id","type","value","required","readonly","disabled","checked"],radio:["name","id","type","value","required","readonly","disabled","checked"],file:["name","id","type","required","disabled","accept","capture","multiple"],color:["name","id","type","value","required","readonly","disabled"],textarea:["name","id","required","value","type","readonly","disabled","placeholder","maxlength","minlength","cols","rows"],select:["name","id","required","readonly","disabled","multiple"]};function ie(e){const{attributes:a,setAttributes:l,clientId:n,setModalOpen:o,fieldType:i}=e,{type:s,name:c,value:u,placeholder:d,required:p,multiple:m,checked:h,showHelp:b}=a,g=oe[i];return(0,W.jsx)(Y.Fragment,{children:(0,W.jsxs)(r.PanelBody,{title:(0,t.__)("Options","formello"),initialOpen:!0,children:[(0,W.jsx)(r.TextControl,{label:(0,t.__)("Name","formello"),value:c,onChange:e=>{return l({name:(t=e,t.replace(/[^\p{L}\p{N}]+/gu,"_").toLowerCase().replace(/(^-+)|(-+$)/g,""))});var t},help:(0,t.__)('Affects the "name" attribute of the input element, and is used as a name for the form submission results.',"formello")}),g.includes("value")&&(0,W.jsx)(ne,{clientId:n,label:(0,t.__)("Value","formello"),value:u,onChange:e=>{l({value:e})},help:(0,t.__)("The initial value of the control field.","formello")}),g.includes("placeholder")&&(0,W.jsx)(r.TextControl,{label:(0,t.__)("Placeholder","formello"),value:d,onChange:e=>l({placeholder:e}),help:(0,t.__)("Text that appears in the form control when it has no value set.","formello")}),g.includes("required")&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Required","formello"),checked:p,onChange:e=>l({required:e})}),g.includes("multiple")&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Multiple","formello"),checked:m,onChange:e=>l({multiple:e})}),g.includes("checked")&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Checked","formello"),checked:h,onChange:e=>l({checked:e})}),!("hidden"===s)&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Show help message","formello"),checked:b,onChange:e=>l({showHelp:e})}),"select"===i&&(0,W.jsx)(Y.Fragment,{children:(0,W.jsx)(r.Button,{variant:"primary",onClick:()=>{o(!0)},children:(0,t.__)("Manage Options","formello")})})]})})}function se(e){const{attributes:{advanced:a,type:l,dateFormat:n,timeFormat:o,enableTime:i,inlineCalendar:s,mode:c,minDate:u},setAttributes:d}=e;return(0,W.jsx)(Y.Fragment,{children:a&&"date"===l&&(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Minimum date from today","formello"),checked:"today"===u,onChange:e=>{d({minDate:!!e&&"today"})}}),(0,W.jsx)(r.SelectControl,{label:(0,t.__)("Date Format","formello"),value:n,options:[{label:"2022-04-26",value:"Y-m-d"},{label:"04/26/2022",value:"m/d/Y"},{label:"26/04/2022",value:"d/m/Y"}],onChange:e=>{d({dateFormat:e})}}),(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Enable time","formello"),checked:i,onChange:e=>{d({enableTime:e})}}),(0,W.jsx)(r.SelectControl,{label:(0,t.__)("Mode","formello"),value:c,options:[{label:"Single",value:"single"},{label:"Multiple",value:"multiple"},{label:"Range",value:"range"}],onChange:e=>d({mode:e})}),(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Inline calendar","formello"),checked:s,onChange:e=>d({inlineCalendar:e})})]})})}const ce=function(e){const{attributes:{type:a,min:l,max:n,advanced:o,step:i,minlength:s,maxlength:c,validation:u,enableMismatch:d,pattern:p,match:m,mismatchMessage:h},setAttributes:b,clientId:g}=e,f=oe[null!=a?a:"textarea"],v=function(e){const t=[];return te(e).forEach((e=>{t.push({label:e.attributes.name,value:e.attributes.name})})),t}(ee(g).clientId);return(0,W.jsxs)(r.PanelBody,{title:(0,t.__)("Validation","formello"),initialOpen:!1,children:["date"===a&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Advanced Date","formello"),checked:o,onChange:e=>{b({advanced:e})}}),("date"===a||"time"===a)&&(0,W.jsx)(se,{...e}),(0,J.applyFilters)("formello.Validation","",e),f.includes("step")&&!o&&(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.TextControl,{label:(0,t.__)("Min Value","formello"),value:l||"",min:"0",type:"range"===a?"number":a,onChange:e=>{b({min:e})}}),(0,W.jsx)(r.TextControl,{label:(0,t.__)("Max Value","formello"),value:n||"",type:"range"===a?"number":a,min:"0",onChange:e=>{b({max:e})}}),(0,W.jsx)(r.TextControl,{type:"number",label:(0,t.__)("Step Value","formello"),value:i||"",onChange:e=>b({step:Number(e)})})]}),f.includes("minlength")&&(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.TextControl,{type:"number",label:(0,t.__)("Min Characters","formello"),value:s,min:"0",onChange:e=>b({minlength:e}),help:(0,t.__)("Minimum length (number of characters) of value.","formello")}),(0,W.jsx)(r.TextControl,{type:"number",label:(0,t.__)("Max Characters","formello"),value:c,onChange:e=>b({maxlength:e}),help:(0,t.__)("Maximum length (number of characters) of value.","formello")})]}),f.includes("pattern")&&(0,W.jsx)(Y.Fragment,{children:(0,W.jsx)(ne,{label:"Pattern",clientId:g,tabs:[{name:"passwords",title:"Passwords",data:[{title:"Password",tag:"^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",description:"One uppercase, one number, at least 8 chars"},{title:"Password with special characters",tag:"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",description:"One uppercase, one number, one special chars, at least 8 chars"}]},{name:"dates",title:"Dates",data:[{title:"dd/mm/yyyy",tag:"^\\d{2}-\\d{2}-\\d{4}$"},{title:"dd/mm/yy",tag:"^\\d{2}-\\d{2}-\\d{2}$"}]}],value:p,onChange:e=>{b({pattern:e})},help:(0,t.__)("Pattern the value must match to be valid.","formello")})}),f.includes("pattern")&&(0,W.jsx)(r.TextControl,{label:(0,t.__)("Custom Validation Message","formello"),help:(0,t.__)("The message to show if pattern validation fails.","formello"),value:u,onChange:e=>b({validation:e})}),(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Enable match field","formello"),checked:d,onChange:e=>b({enableMismatch:e})}),d&&(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.SelectControl,{label:(0,t.__)("Match","formello"),value:m,options:[{value:"",label:(0,t.__)("Select a field","formello")},...v],onChange:e=>b({match:e}),help:(0,t.__)("Select the field to match.","formello")}),(0,W.jsx)(r.TextControl,{type:"text",label:(0,t.__)("Mismatch message","formello"),value:h||"",onChange:e=>b({mismatchMessage:e})})]})]})},ue=(0,r.withFilters)("formello.advancedOptions")((function(a){const{attributes:{type:n,disabled:o,enableAutoComplete:i,autocomplete:s,readonly:c,advanced:u},setAttributes:d,fieldType:p,clientId:m}=a,h=oe[p],b=(0,K.useSelect)((e=>{const{getBlock:t}=e(l.store),a=t(m);return!(!a||!a.innerBlocks.length)}),[m]),{replaceInnerBlocks:g}=(0,K.useDispatch)(l.store);return(0,W.jsxs)(Y.Fragment,{children:[h.includes("cols")&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Enable Rich Text","formello"),checked:u,onChange:e=>d({advanced:e})}),h.includes("autocomplete")&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Autocomplete","formello"),checked:i,onChange:e=>d({enableAutoComplete:e}),help:(0,t.__)("Hint for form autofill feature.","formello")}),i&&h.includes("autocomplete")&&(0,W.jsx)(r.TextControl,{label:(0,t.__)("Autocomplete attribute","formello"),value:s,onChange:e=>d({autocomplete:e})}),"range"===n&&(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Show output","formello"),checked:b,onChange:t=>{t?(d({withOutput:!0}),(()=>{let t="formello/button";"range"===n&&(t="formello/output"),g(a.clientId,(0,e.createBlocksFromInnerBlocksTemplate)([[t]]),!0)})()):(d({withOutput:!1}),g(m,[],!0))}}),"hidden"!==n&&(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Disabled","formello"),checked:o,onChange:e=>d({disabled:e}),help:(0,t.__)("Make the control not accept clicks.","formello")}),(0,W.jsx)(r.ToggleControl,{label:(0,t.__)("Read only","formello"),checked:c,onChange:e=>d({readonly:e}),help:(0,t.__)("Make value not editable.","formello")})]})]})}));function de(e){const{attributes:a,setAttributes:n,clientId:o}=e,{required:i,showHelp:s,hideLabel:c,type:u}=a,d=(0,W.jsxs)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,W.jsx)(r.Rect,{x:"4.75",y:"17.25",width:"5.5",height:"14.5",transform:"rotate(-90 4.75 17.25)",stroke:"currentColor",fill:"none",strokeWidth:"1.5"}),(0,W.jsx)(r.Rect,{x:"4",y:"7",width:"10",height:"2",fill:"currentColor"})]});return(0,W.jsxs)(Y.Fragment,{children:[(0,W.jsx)(r.ToolbarButton,{label:(0,t.__)("Required","formello"),icon:w,isPressed:i,onClick:()=>{(()=>{const e=(0,K.select)(l.store).getBlockParentsByBlockName(o,"formello/form"),t=(0,K.select)("core/block-editor").getBlockAttributes(e[0]);n({requiredText:t.requiredText})})(),n({required:!i})}}),"checkbox"!==u&&(0,W.jsx)(r.ToolbarButton,{label:(0,t.__)("Toggle label visibility","formello"),icon:d,isPressed:!c,onClick:()=>{n({hideLabel:!c})}}),(0,W.jsx)(r.ToolbarButton,{label:(0,t.__)("Show help message","formello"),icon:"editor-help",isPressed:s,onClick:()=>{n({showHelp:!s})}})]})}const pe=window.wp.compose,me=[{name:"text-field",title:(0,t.__)("Text"),icon:V,description:(0,t.__)("A basic single-line text field.","formello"),attributes:{type:"text"},scope:["transform"]},{name:"hidden",title:(0,t.__)("Hidden"),description:(0,t.__)("Display hidden field.","formello"),icon:E,attributes:{type:"hidden"},scope:["inserter"]},{name:"checkbox",title:(0,t.__)("Checkbox"),description:(0,t.__)("A simple checkbox input."),icon:function(e){return i.createElement("svg",_({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 24 24"},e),u||(u=i.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),d||(d=i.createElement("path",{d:"M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6.003 11L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"})))},attributes:{type:"checkbox"},scope:["inserter"]},{name:"radio",title:(0,t.__)("Radio"),description:(0,t.__)("A simple radio input."),icon:function(e){return i.createElement("svg",D({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,"aria-hidden":"true",viewBox:"0 0 14 14"},e),H||(H=i.createElement("path",{d:"M7 4C5.32 4 4 5.32 4 7s1.32 3 3 3 3-1.32 3-3-1.32-3-3-3Zm0-3C3.7 1 1 3.7 1 7s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Zm0 10.8c-2.64 0-4.8-2.16-4.8-4.8 0-2.64 2.16-4.8 4.8-4.8 2.64 0 4.8 2.16 4.8 4.8 0 2.64-2.16 4.8-4.8 4.8z"})))},attributes:{type:"radio"},scope:["block"]},{name:"gdpr",title:(0,t.__)("GDPR"),icon:function(e){return i.createElement("svg",O({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},e),v||(v=i.createElement("path",{fill:"none",d:"M0 0h20v20H0z"})),x||(x=i.createElement("path",{d:"M10 2s3 2 7 2c0 11-7 14-7 14S3 15 3 4c4 0 7-2 7-2zm0 8h5s1-1 1-5c0 0-5-1-6-2v7H5c1 4 5 7 5 7v-7z"})))},attributes:{name:"checkbox",type:"checkbox",label:(0,t.__)("I agree with the Terms of service and Privacy policy","formello"),required:!0},scope:["inserter"]},{name:"range",title:(0,t.__)("Range"),icon:function(e){return i.createElement("svg",Z({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,"data-name":"Layer 1",viewBox:"0 0 24 24"},e),z||(z=i.createElement("path",{d:"M21 11h-3.184a2.982 2.982 0 0 0-5.632 0H3a1 1 0 0 0 0 2h9.184a2.982 2.982 0 0 0 5.632 0H21a1 1 0 0 0 0-2Zm-6 2a1 1 0 1 1 1-1 1.001 1.001 0 0 1-1 1Z"})))},attributes:{type:"range"},scope:["inserter"]},{name:"email",title:(0,t.__)("Email"),description:(0,t.__)("Used for email addresses."),icon:function(e){return i.createElement("svg",T({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 24 24"},e),f||(f=i.createElement("path",{d:"M12 2c5.43 0 9.848 4.327 9.996 9.72L22 12v1c0 2.173-1.523 4-3.5 4-1.173 0-2.186-.643-2.816-1.62a5 5 0 1 1 1.311-3.597L17 12v1c0 1.14.716 2 1.5 2 .745 0 1.428-.775 1.495-1.831L20 13v-1a8 8 0 1 0-4.677 7.28 1 1 0 1 1 .831 1.819A9.966 9.966 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2Zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"})))},attributes:{type:"email"},scope:["inserter","transform"]},{name:"number",title:(0,t.__)("Number"),icon:function(e){return i.createElement("svg",F({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",width:800,height:800,viewBox:"0 0 52 52"},e),P||(P=i.createElement("path",{d:"M44.8 49.5H7.2c-2.6 0-4.7-2.1-4.7-4.7V7.2c0-2.6 2.1-4.7 4.7-4.7h37.6c2.6 0 4.7 2.1 4.7 4.7v37.6c0 2.6-2.1 4.7-4.7 4.7zm-36-39.2v31.3c0 .9.7 1.6 1.6 1.6h31.3c.9 0 1.6-.7 1.6-1.6V10.3c0-.9-.7-1.6-1.6-1.6H10.4c-.9.1-1.6.8-1.6 1.6z"})),A||(A=i.createElement("path",{d:"M36.2 20.3h-2.9l1.2-4.8v-.1c0-.2-.1-.4-.4-.4h-2.3c-.2 0-.3.1-.4.3l-1.2 4.9h-5.8l1.2-4.8v-.1c0-.2-.1-.4-.4-.4h-2.3c-.2 0-.3.1-.4.3l-1.3 4.9H18c-.2 0-.3.1-.4.3l-.6 2.2v.1c0 .2.1.4.4.4h3L19 28.7h-3.1c-.2 0-.3.1-.4.3l-.6 2.2v.1c0 .2.1.4.4.4h2.9L17 36.5v.1c0 .2.1.4.4.4h2.3c.2 0 .3-.1.4-.3l1.3-5h5.7L26 36.4v.1c0 .2.1.4.4.4h2.3c.2 0 .3-.1.4-.3l1.3-5h3.2c.2 0 .3-.1.4-.3l.6-2.2V29c0-.2-.1-.4-.4-.4h-3l1.4-5.6h3.1c.2 0 .3-.1.4-.3l.6-2.2v-.1c-.1.1-.3-.1-.5-.1zm-8.1 8.5h-5.8l1.4-5.6h5.7l-1.3 5.6z"})))},attributes:{type:"number"},scope:["inserter","transform"]},{name:"color",title:(0,t.__)("Color"),icon:function(e){return i.createElement("svg",k({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 36 36"},e),g||(g=i.createElement("path",{d:"M32.23 14.89c-2.1-.56-4.93 1.8-6.34.3-1.71-1.82 2.27-5.53 1.86-8.92-.33-2.78-3.51-4.08-6.66-4.1A18.5 18.5 0 0 0 7.74 7.59c-6.64 6.59-8.07 16-1.37 22.48 6.21 6 16.61 4.23 22.67-1.4a17.73 17.73 0 0 0 4.22-6.54c1.08-2.9 1.18-6.64-1.03-7.24ZM9.4 10.57a2.23 2.23 0 0 1 2.87 1.21 2.22 2.22 0 0 1-1.81 2.53 2.22 2.22 0 0 1-2.87-1.21 2.23 2.23 0 0 1 1.81-2.53ZM5.07 20.82a2.22 2.22 0 0 1 1.82-2.53 2.22 2.22 0 0 1 2.86 1.21A2.23 2.23 0 0 1 7.94 22a2.24 2.24 0 0 1-2.87-1.18Zm7 8.33a2.22 2.22 0 0 1-2.87-1.21 2.23 2.23 0 0 1 1.8-2.53 2.23 2.23 0 0 1 2.87 1.21A2.22 2.22 0 0 1 12 29.15ZM15 8.26a2.23 2.23 0 0 1 1.81-2.53 2.24 2.24 0 0 1 2.87 1.21 2.22 2.22 0 0 1-1.82 2.53A2.21 2.21 0 0 1 15 8.26Zm5.82 22.19a2.22 2.22 0 0 1-2.87-1.21 2.23 2.23 0 0 1 1.81-2.53 2.24 2.24 0 0 1 2.87 1.21 2.22 2.22 0 0 1-1.85 2.53Zm5-10.46a3.2 3.2 0 0 1-1.69 1.76 3.53 3.53 0 0 1-1.4.3 2.78 2.78 0 0 1-2.56-1.5 2.49 2.49 0 0 1-.07-2 3.2 3.2 0 0 1 1.69-1.76 3 3 0 0 1 4 1.2 2.54 2.54 0 0 1 0 2.01Z","data-name":"Layer 3"})))},attributes:{type:"color"},scope:["inserter"]},{name:"date",title:(0,t.__)("Date"),icon:function(e){return i.createElement("svg",j({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",width:800,height:800,viewBox:"0 0 48 48"},e),p||(p=i.createElement("path",{d:"M38 4V0h-4v4H14V0h-4v4H0v44h48V4H38zm6 40H4V19.9h40V44zM4 15.9V8h6v4h4V8h20v4h4V8h6v7.9H4z"})),m||(m=i.createElement("path",{d:"M7.5 24h6v6h-6zM16.667 24h6v6h-6zM25.583 24h6v6h-6zM34.5 24h6v6h-6zM7.5 33h6v6h-6zM16.667 33h6v6h-6zM25.583 33h6v6h-6zM34.5 33h6v6h-6z"})))},attributes:{type:"date"},scope:["inserter","transform"]},{name:"time",title:(0,t.__)("Time"),icon:function(e){return i.createElement("svg",C({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,"data-name":"Layer 1",viewBox:"0 -8 72 72"},e),h||(h=i.createElement("path",{d:"M36 0a28 28 0 1 0 28 28A28 28 0 0 0 36 0Zm0 50a22 22 0 1 1 22-22 22.07 22.07 0 0 1-22 22Z"})),b||(b=i.createElement("path",{d:"M50.59 27.14H38V12a2.31 2.31 0 1 0-4.61 0v17.44a2.31 2.31 0 0 0 2.3 2.31h14.9a2.31 2.31 0 1 0 0-4.61Z"})))},attributes:{type:"time"},scope:["inserter","transform"]},{name:"tel",title:(0,t.__)("Tel"),icon:function(e){return i.createElement("svg",U({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 56 56"},e),L||(L=i.createElement("path",{d:"M18.156 37.762c6.774 6.773 15.024 12 21.75 12 3.024 0 5.672-1.055 7.805-3.399 1.242-1.383 2.016-3 2.016-4.593 0-1.172-.446-2.297-1.57-3.094l-7.173-5.11c-1.101-.75-2.015-1.125-2.859-1.125-1.078 0-2.016.61-3.094 1.664l-1.664 1.641a1.263 1.263 0 0 1-.89.375c-.375 0-.704-.14-.961-.258-1.43-.773-3.914-2.906-6.235-5.203-2.297-2.297-4.43-4.781-5.18-6.234a1.991 1.991 0 0 1-.257-.938c0-.304.093-.61.351-.867l1.64-1.71c1.056-1.079 1.665-2.017 1.665-3.095 0-.843-.375-1.757-1.148-2.859l-5.04-7.102c-.82-1.125-1.968-1.617-3.234-1.617-1.547 0-3.164.703-4.523 2.04-2.274 2.18-3.282 4.874-3.282 7.85 0 6.727 5.133 14.884 11.883 21.634Z"})))},attributes:{type:"tel"},scope:["inserter","transform"]},{name:"url",title:(0,t.__)("Url"),icon:function(e){return i.createElement("svg",$({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 16 16"},e),I||(I=i.createElement("path",{fill:"none",d:"M0 0h16v16H0z"})),N||(N=i.createElement("path",{d:"M6.794 12.794c-.478.475-1.113.737-1.794.737s-1.316-.262-1.794-.738a2.54 2.54 0 0 1 0-3.584L5.5 6.916 4.084 5.5 1.791 7.794a4.54 4.54 0 0 0 .003 6.413c.853.855 1.99 1.324 3.206 1.324s2.353-.469 3.206-1.325l2.294-2.294L9.084 10.5l-2.29 2.294zm7.412-11C13.353.938 12.216.469 11 .469S8.647.938 7.794 1.794L5.5 4.084 6.916 5.5 9.21 3.206c.474-.475 1.109-.737 1.79-.737s1.316.263 1.794.737a2.537 2.537 0 0 1 0 3.584L10.5 9.084l1.416 1.416 2.294-2.294a4.54 4.54 0 0 0-.004-6.412zm-2.5 3.912L10.29 4.29l-6 6 1.416 1.416 6-6z"})))},attributes:{type:"url"},scope:["inserter","transform"]},{name:"inputbutton",title:(0,t.__)("Input with button"),icon:(0,W.jsxs)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,W.jsx)(r.Rect,{x:"4.75",y:"15.25",width:"6.5",height:"14.5",transform:"rotate(-90 4.75 15.25)",stroke:"currentColor",strokeWidth:"1.5",fill:"none"}),(0,W.jsx)(r.Rect,{x:"14",y:"10",width:"4",height:"4",rx:"1",fill:"currentColor"})]}),attributes:{type:"email",label:"Email",withButton:!0},innerBlocks:[["formello/button",{noWrapper:!0}]],scope:["inserter"]},{name:"password",title:(0,t.__)("Password"),icon:function(e){return i.createElement("svg",R({xmlns:"http://www.w3.org/2000/svg",width:800,height:800,viewBox:"0 0 56 56"},e),S||(S=i.createElement("path",{d:"M27.988 51.297c.375 0 .961-.14 1.57-.445C42.66 43.469 47.185 40.375 47.185 31.96V14.289c0-2.414-1.055-3.187-3-4.008-2.743-1.125-11.532-4.289-14.25-5.25-.633-.187-1.266-.328-1.946-.328-.656 0-1.289.14-1.922.328-2.718.985-11.507 4.149-14.25 5.25-1.945.797-3 1.594-3 4.008v17.672c0 8.414 4.547 11.484 17.625 18.89.61.305 1.172.446 1.547.446Zm-8.226-15.563v-9.093c0-1.524.586-2.32 1.828-2.508V21.32c0-4.312 2.601-7.218 6.398-7.218 3.82 0 6.399 2.906 6.399 7.218v2.79c1.265.187 1.851.984 1.851 2.53v9.094c0 1.758-.773 2.578-2.414 2.578H22.152c-1.617 0-2.39-.82-2.39-2.578Zm4.289-11.648 7.898-.023v-3c0-2.766-1.57-4.594-3.96-4.594-2.368 0-3.938 1.828-3.938 4.593Z"})))},attributes:{type:"password",pattern:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$",validation:"Please choose a password that includes at least 1 uppercase character, 1 lowercase character, and 1 number."},scope:["inserter"]}];me.forEach((e=>{"file"===e.name&&(e.attributes.value=void 0),"radio"===e.name&&"checkbox"===e.name||(e.attributes.checked=void 0),"date"!==e.name&&(e.attributes.advanced=!1),e.isActive=(e,t)=>e.type===t.type}));const he=me,be={attributes:{name:{type:"string"},id:{type:"string"},type:{type:"string",default:"text"},label:{type:"string"},hideLabel:{type:"boolean"},value:{type:"string"},placeholder:{type:"string"},required:{type:"boolean"},requiredText:{type:"string"},validation:{type:"string"},readonly:{type:"boolean"},showHelp:{type:"string"},help:{type:"string"},withButton:{type:"boolean"},withButton:{type:"boolean"},enableMismatch:{type:"boolean"},enableAutoComplete:{type:"boolean"},advanced:{type:"boolean"},noWrapper:{type:"boolean"},grouped:{type:"boolean"}},save({attributes:e,className:t}){const{name:a,id:r,type:n,label:i,hideLabel:s,value:c,placeholder:u,required:d,requiredText:p,readonly:m,showHelp:h,help:b,withButton:g,withOutput:f,grouped:v,validation:x,enableMismatch:y,enableAutoComplete:w,advanced:_,noWrapper:j}=e;t=o()("formello",{"formello-group":g||f,"formello-group grouped":v,"formello-checkbox":"checkbox"===n||"radio"===n});const C=o()({hide:s}),k=o()({flatpickr:_&&"date"===n,filepond:_&&"file"===n}),T=Object.fromEntries(oe[n].map((t=>[t,e[t]])));return x&&(T["data-bouncer-message"]=x),y&&mismatchMessage&&(T["data-bouncer-mismatch-message"]=mismatchMessage),y&&match&&(T["data-bouncer-match"]=match),f&&(T.oninput="this.nextElementSibling.value = this.value"),w||(T.autocomplete=void 0),"file"===n&&(T.name,T.accept=accept?.join(",")),_&&"date"===n&&(T.type="text",Object.entries(flatpickr).forEach((([e,t])=>{T["data-"+e]=t}))),j||"hidden"===n?(0,W.jsx)("input",{...T,className:k}):(0,W.jsxs)("div",{...l.useBlockProps.save(),className:t,children:["hidden"!==n&&(0,W.jsxs)("label",{className:C,htmlFor:r,children:[i,d&&(0,W.jsx)("span",{className:"required",children:p})]}),(0,W.jsx)("input",{...T,className:k}),g&&(0,W.jsx)(l.InnerBlocks.Content,{}),f&&(0,W.jsx)("output",{children:c}),"hidden"!==n&&h&&(0,W.jsx)(RichText.Content,{tagName:"small",value:b})]})}},ge=[be],fe=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"formello/input","title":"Text Input","category":"formello","ancestor":["formello/form"],"textdomain":"formello","attributes":{"type":{"type":"string","source":"attribute","selector":"input","attribute":"type","default":"text"},"id":{"type":"string","source":"attribute","selector":"input","attribute":"id"},"name":{"type":"string","source":"attribute","selector":"input","attribute":"name"},"label":{"type":"string","source":"html","selector":"label span:not(.required)","default":"Label","__experimentalRole":"content"},"hideLabel":{"type":"boolean","selector":"label.hide","default":false},"placeholder":{"type":"string","source":"attribute","selector":"input","attribute":"placeholder","__experimentalRole":"content"},"value":{"type":"string","source":"attribute","selector":"input","attribute":"value"},"validation":{"type":"string","source":"attribute","selector":"input","attribute":"data-bouncer-message","default":""},"enableMismatch":{"type":"boolean","default":false},"mismatchMessage":{"type":"string","source":"attribute","selector":"input","attribute":"data-bouncer-mismatch-message","default":""},"match":{"type":"string","source":"attribute","selector":"input","attribute":"data-bouncer-match"},"required":{"type":"boolean","source":"attribute","selector":"input","attribute":"required","default":false},"requiredText":{"type":"string","source":"text","selector":"label span.required","default":"*"},"enableAutoComplete":{"type":"boolean","default":false},"autocomplete":{"type":"string","source":"attribute","selector":"input","attribute":"autocomplete","default":"off"},"disabled":{"type":"boolean","source":"attribute","selector":"input","attribute":"disabled","default":false},"readonly":{"type":"boolean","source":"attribute","selector":"input","attribute":"readonly","default":false},"checked":{"type":"boolean","source":"attribute","selector":"input","attribute":"checked","default":false},"multiple":{"type":"boolean","source":"attribute","selector":"input","attribute":"multiple","default":false},"showHelp":{"type":"boolean","default":false},"help":{"type":"string","default":""},"minlength":{"type":"string","source":"attribute","selector":"input","attribute":"minlength"},"maxlength":{"type":"string","source":"attribute","selector":"input","attribute":"maxlength"},"pattern":{"type":"string","source":"attribute","selector":"input","attribute":"pattern"},"min":{"type":"string","source":"attribute","selector":"input","attribute":"min"},"max":{"type":"string","source":"attribute","selector":"input","attribute":"max"},"withButton":{"type":"boolean","default":false},"grouped":{"type":"boolean","default":false},"withOutput":{"type":"boolean","default":false},"noWrapper":{"type":"boolean","default":false},"step":{"type":"number","source":"attribute","selector":"input","attribute":"step"},"dateFormat":{"type":"string","source":"attribute","selector":"input","attribute":"data-date-format"},"timeFormat":{"type":"string","source":"attribute","selector":"input","attribute":"data-time-format"},"enableTime":{"type":"string","source":"attribute","attribute":"data-enable-time","default":false},"inlineCalendar":{"type":"string","source":"attribute","attribute":"data-inline","default":false},"mode":{"type":"string","source":"attribute","attribute":"data-mode"},"advanced":{"type":"boolean"}},"supports":{"lock":false,"anchor":false,"html":false,"inserter":true,"reusable":false,"spacing":{"padding":true,"__experimentalSkipSerialization":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}}},"editorScript":"file:./index.js"}');(0,e.registerBlockType)(fe,{variations:he,deprecated:ge,transforms:{from:[{type:"block",blocks:["formello/textarea"],transform:t=>(0,e.createBlock)("formello/input",t)}]},icon:V,edit:function e(a){const{attributes:n,setAttributes:i}=a,{type:s,showHelp:c,name:u,grouped:d,withButton:p,checked:m,value:h,step:b,placeholder:g,autocomplete:f,help:v}=n,x="textarea"===s?"textarea":"input",y=oe[s],w=function(e,t){const{attributes:a,setAttributes:l}=t,{type:r,label:n,name:o,id:i}=a,s=(0,pe.useInstanceId)(e),{postId:c}=(0,K.useSelect)((e=>({postId:e("core/editor").getCurrentPostId()})),[]),u="field_"+c+"-"+r+"-"+s;return(0,Y.useEffect)((()=>{var e;i&&!i!==u||l({id:u}),o||l({name:n.length?(e=n,e.replace(/[^\p{L}\p{N}]+/gu,"_").toLowerCase().replace(/(^-+)|(-+$)/g,"")):u})})),u}(e,a),_=(0,l.__experimentalUseBorderProps)(n),j=(0,l.__experimentalGetSpacingClassesAndStyles)(n),C=o()({formello:!0,"formello-group":p||"range"===s,"formello-group grouped":d,"formello-checkbox":"checkbox"===s||"radio"===s||"hidden"===s}),k={..._.style,...j.style},T=(0,l.useBlockProps)({className:C}),{children:O,...M}=(0,l.useInnerBlocksProps)(T,{allowedBlocks:["formello/button","formello/output"],orientation:"horizontal",renderAppender:!1});return(0,W.jsxs)("div",{...M,children:[(0,W.jsx)(l.BlockControls,{children:y.includes("required")&&(0,W.jsx)(r.ToolbarGroup,{children:(0,W.jsx)(de,{...a})})}),(0,W.jsxs)(l.InspectorControls,{children:[(0,W.jsx)(ie,{...a,fieldType:s}),"hidden"!==s&&(0,W.jsx)(ce,{...a,fieldType:s})]}),(0,W.jsx)(l.InspectorAdvancedControls,{children:(0,W.jsx)(ue,{...a,fieldType:s})}),"hidden"!==s?(0,W.jsx)(G,{...a,htmlFor:"input"}):(0,W.jsxs)("div",{className:"formello-hidden",children:[(0,W.jsx)(E,{width:"30",height:"30"}),(0,W.jsxs)("div",{children:["[",u,"]"]})]}),(0,W.jsx)(x,{className:_.className,style:k,type:"password"!==s?s:"text",value:"password"!==s?h:"",checked:m||!1,step:b||void 0,onChange:e=>{"checkbox"!==s&&"radio"!==s||i({checked:!m}),i({placeholder:e.target.value})},placeholder:g,disabled:"file"===s,autoComplete:f||"new-password",id:w}),O,"hidden"!==s&&c&&(0,W.jsx)(l.RichText,{tagName:"small",value:v,onChange:e=>i({help:e}),placeholder:(0,t.__)("Enter help message…","formello"),allowedFormats:["core/bold","core/italic","core/link"],multiline:!1})]})},save:function({attributes:e}){const{type:t,value:a,id:r,withButton:n,withOutput:i,grouped:s,advanced:c,validation:u,enableMismatch:d,mismatchMessage:p,match:m,enableAutoComplete:h,noWrapper:b,required:g,requiredText:f,label:v,hideLabel:x,showHelp:y,help:w,dateFormat:_,mode:j,inlineCalendar:C,timeFormat:k,enableTime:T,minDate:O}=e,M="textarea"===t?"textarea":"input",B=(0,l.__experimentalGetBorderClassesAndStyles)(e),E=(0,l.__experimentalGetSpacingClassesAndStyles)(e),q=o()("formello",{"formello-group":n||i,"formello-group grouped":s,"formello-checkbox":"checkbox"===t||"radio"===t}),P=o()({hide:x,"textarea-label":"textarea"===t}),A=o()(B.className,{"formello-advanced":c,"formello-rtf":c&&"textarea"===t}),S=Object.fromEntries(oe[t].map((t=>[t,e[t]])));Object.keys(S).forEach((e=>""===S[e]&&delete S[e])),u&&(S["data-bouncer-message"]=u),d&&p&&(S["data-bouncer-mismatch-message"]=p),d&&m&&(S["data-bouncer-match"]=m),i&&(S.oninput="this.nextElementSibling.value = this.value"),h||(S.autocomplete=void 0),c&&"date"===t&&(S["data-date-format"]=_,S["data-time-format"]=k,S["data-enable-time"]=T||void 0,S["data-mode"]=j,S["data-min-date"]=O,S["data-inline"]=C),c&&"time"===t&&(S["data-time-format"]=k,S["data-enable-time"]=T);const z={...B.style,...E.style};return b||"hidden"===t?(0,W.jsx)("input",{...S,className:A,style:z}):(0,W.jsxs)("div",{...l.useBlockProps.save(),className:q,children:["hidden"!==t&&(0,W.jsxs)("label",{className:P,htmlFor:r,children:[(0,W.jsx)(l.RichText.Content,{tagName:"span",value:v}),g&&(0,W.jsx)("span",{className:"required",children:f})]}),(0,W.jsx)(M,{...S,className:A,style:z}),(0,W.jsx)(l.InnerBlocks.Content,{}),"hidden"!==t&&y&&(0,W.jsx)(l.RichText.Content,{tagName:"small",value:w})]})}})})()})();