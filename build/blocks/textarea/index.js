!function(){var e={184:function(e,t){var l;!function(){"use strict";var a={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var l=arguments[t];if(l){var o=typeof l;if("string"===o||"number"===o)e.push(l);else if(Array.isArray(l)){if(l.length){var n=r.apply(null,l);n&&e.push(n)}}else if("object"===o)if(l.toString===Object.prototype.toString)for(var i in l)a.call(l,i)&&l[i]&&e.push(i);else e.push(l.toString())}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(l=function(){return r}.apply(t,[]))||(e.exports=l)}()}},t={};function l(a){var r=t[a];if(void 0!==r)return r.exports;var o=t[a]={exports:{}};return e[a](o,o.exports,l),o.exports}l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,{a:t}),t},l.d=function(e,t){for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";var e=window.React,t=window.wp.i18n,a=window.wp.blockEditor,r=window.wp.components,o=l(184),n=l.n(o);function i({attributes:l,setAttributes:r}){const{labelClass:o,labelAlign:i,labelVAlign:s,hideLabel:c,required:u,multiple:m,type:d,label:p,requiredText:h}=l,f=n()("label-div",o,i,s,{hide:c,required:u,"textarea-label":m||"textarea"===d});return(0,e.createElement)("div",{className:f,htmlFor:"input"},(0,e.createElement)(a.RichText,{tagName:"span",value:p,onChange:e=>r({label:e}),placeholder:(0,t.__)("Enter label…","formello"),allowedFormats:["core/bold","core/italic","core/link"]}),u&&(0,e.createElement)("span",{className:"required"},h))}var s=window.wp.element,c=window.wp.hooks,u=window.wp.coreData,m=window.wp.data;const d=["formello/input","formello/select","formello/textarea","formello/multichoices"];function p(e){const t=(0,m.select)(a.store).getBlockParentsByBlockName(e,"formello/form");if(t.length)return t[0];const l=(0,m.select)(a.store).getBlock(e);return"formello/form"===l.name?l:void 0}function h(e){const t=[];return(0,m.select)(a.store).getClientIdsOfDescendants([e]).forEach((e=>{const l=(0,m.select)(a.store).getBlock(e);d.includes(l.name)&&t.push(l)})),t}function f(e){let t=[];const l=p(e);return l&&(t=function(e){const t=[];return h(e).forEach((e=>{t.push({title:e.attributes.name,tag:"{{fields."+e.attributes.name+"}}"})})),t}(l.clientId)),[{title:"All Data",tag:"{{fields.all_data}}"},...t]}function g(){const{postType:e,postId:t}=(0,m.useSelect)((e=>({postType:e("core/editor").getCurrentPostType(),postId:e("core/editor").getCurrentPostId()}))),[l]=(0,u.useEntityProp)("postType",e,"meta",t),a=[];for(const e in l){if(l[e]!==Object(e))continue;const t={title:e,tag:`{{meta.${e}}}`};a.push(t)}return a}function b(e){return[{name:"fields",title:"Fields",data:f(e)},{name:"wordpress",title:"WordPress",data:[{title:"Post ID",tag:"{{wp.post_id}}"},{title:"Post Title",tag:"{{wp.post_title}}"},{title:"Post URL",tag:"{{wp.post_url}}"},{title:"Post Author",tag:"{{wp.post_author}}"},{title:"Post Author Email",tag:"{{wp.post_author_email}}"},{title:"User ID",tag:"{{wp.user_id}}"},{title:"User First Name",tag:"{{wp.user_first_name}}"},{title:"User Last Name",tag:"{{wp.user_last_name}}"},{title:"User Display Name",tag:"{{wp.user_display_name}}"},{title:"User Username",tag:"{{wp.user_username}}"},{title:"User Email",tag:"{{wp.user_email}}"},{title:"User URL",tag:"{{wp.user_url}}"},{title:"Site Title",tag:"{{wp.site_title}}"},{title:"Site URL",tag:"{{wp.site_url}}"},{title:"Admin Email",tag:"{{wp.admin_email}}"}]},{name:"meta",title:"Meta",data:g()},{name:"other",title:"Other",data:[{title:"Date",tag:"{{other.system_date}}"},{title:"Time",tag:"{{other.system_time}}"},{title:"Referrer URL",tag:"{{other.referrer}}"},{title:"User IP",tag:"{{other.user_ip}}"}]}]}function _({tabs:t,onChange:l}){const[a,o]=(0,s.useState)("");return(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.SearchControl,{value:a,onChange:o}),(0,e.createElement)(r.TabPanel,{tabs:t},(t=>t.data.filter((e=>(e=>""===a||-1!==e.title.toLowerCase().search(a.toLowerCase()))(e))).map((t=>(0,e.createElement)(r.MenuItem,{key:t.title,onClick:()=>l(t.tag),info:t.description},t.title))))))}function v(t){const{label:l,value:a,placeholder:o,help:n,onChange:i,icon:s="list-view",clientId:c,tabs:u=b(c)}=t;return(0,e.createElement)(r.BaseControl,null,(0,e.createElement)(r.__experimentalInputControl,{value:a,label:l,onChange:i,placeholder:o,help:n,suffix:(0,e.createElement)(r.DropdownMenu,{icon:s,label:l,toggleProps:{isSmall:!0}},(()=>(0,e.createElement)(_,{tabs:u,onChange:i})))}))}const y={hidden:["name","id","type","value"],text:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],tel:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],url:["name","id","type","value","required","readonly","disabled","placeholder","maxlength","minlength","pattern","autocomplete"],email:["name","id","type","value","required","readonly","disabled","placeholder","autocomplete"],password:["name","id","type","required","readonly","disabled","pattern","maxlength","minlength","autocomplete"],number:["name","id","type","value","required","readonly","disabled","placeholder","step","min","max"],date:["name","id","type","value","required","readonly","disabled","step","min","max"],time:["name","id","type","value","required","readonly","disabled","step","min","max"],range:["name","id","type","value","required","readonly","disabled","step","min","max"],checkbox:["name","id","type","value","required","readonly","disabled","checked"],radio:["name","id","type","value","required","readonly","disabled","checked"],file:["name","id","type","required","disabled","accept","capture","multiple"],color:["name","id","type","value","required","readonly","disabled"],textarea:["name","id","required","value","type","readonly","disabled","placeholder","maxlength","minlength","cols","rows"],select:["name","id","required","readonly","disabled","multiple"]};function x(l){const{attributes:a,setAttributes:o,clientId:n,setModalOpen:i,fieldType:c}=l,{type:u,name:m,value:d,placeholder:p,required:h,multiple:f,checked:g,showHelp:b}=a,_=y[c];return(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.PanelBody,{title:(0,t.__)("Options","formello"),initialOpen:!0},(0,e.createElement)(r.TextControl,{label:(0,t.__)("Name","formello"),value:m,onChange:e=>{return o({name:(t=e,t.replace(/[^\p{L}\p{N}]+/gu,"_").toLowerCase().replace(/(^-+)|(-+$)/g,""))});var t},help:(0,t.__)('Affects the "name" attribute of the input element, and is used as a name for the form submission results.',"formello")}),_.includes("value")&&(0,e.createElement)(v,{clientId:n,label:(0,t.__)("Value","formello"),value:d,onChange:e=>{o({value:e})},help:(0,t.__)("The initial value of the control field.","formello")}),_.includes("placeholder")&&(0,e.createElement)(r.TextControl,{label:(0,t.__)("Placeholder","formello"),value:p,onChange:e=>o({placeholder:e}),help:(0,t.__)("Text that appears in the form control when it has no value set.","formello")}),_.includes("required")&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Required","formello"),checked:h,onChange:e=>o({required:e})}),_.includes("multiple")&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Multiple","formello"),checked:f,onChange:e=>o({multiple:e})}),_.includes("checked")&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Checked","formello"),checked:g,onChange:e=>o({checked:e})}),!("hidden"===u)&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Show help message","formello"),checked:b,onChange:e=>o({showHelp:e})}),"select"===c&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.Button,{variant:"primary",onClick:()=>{i(!0)}},(0,t.__)("Manage Options","formello")))))}function w(l){const{attributes:{advanced:a,type:o,dateFormat:n,timeFormat:i,enableTime:c,inlineCalendar:u,mode:m,minDate:d},setAttributes:p}=l;return(0,e.createElement)(s.Fragment,null,a&&"date"===o&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Minimum date from today","formello"),checked:"today"===d,onChange:e=>{p({minDate:!!e&&"today"})}}),(0,e.createElement)(r.SelectControl,{label:(0,t.__)("Date Format","formello"),value:n,options:[{label:"2022-04-26",value:"Y-m-d"},{label:"04/26/2022",value:"m/d/Y"},{label:"26/04/2022",value:"d/m/Y"}],onChange:e=>{p({dateFormat:e})}}),(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Enable time","formello"),checked:c,onChange:e=>{p({enableTime:e})}}),(0,e.createElement)(r.SelectControl,{label:(0,t.__)("Mode","formello"),value:m,options:[{label:"Single",value:"single"},{label:"Multiple",value:"multiple"},{label:"Range",value:"range"}],onChange:e=>p({mode:e})}),(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Inline calendar","formello"),checked:u,onChange:e=>p({inlineCalendar:e})})))}var C,E=function(l){const{attributes:{type:a,min:o,max:n,advanced:i,step:u,minlength:m,maxlength:d,validation:f,enableMismatch:g,pattern:b,match:_,mismatchMessage:x},setAttributes:C,clientId:E}=l,k=y[null!=a?a:"textarea"],T=function(e){const t=[];return h(e).forEach((e=>{t.push({label:e.attributes.name,value:e.attributes.name})})),t}(p(E).clientId);return(0,e.createElement)(r.PanelBody,{title:(0,t.__)("Validation","formello"),initialOpen:!1},"date"===a&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Advanced Date","formello"),checked:i,onChange:e=>{C({advanced:e})}}),("date"===a||"time"===a)&&(0,e.createElement)(w,{...l}),(0,c.applyFilters)("formello.Validation","",l),k.includes("step")&&!i&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.TextControl,{label:(0,t.__)("Min Value","formello"),value:o||"",min:"0",type:"range"===a?"number":a,onChange:e=>{C({min:e})}}),(0,e.createElement)(r.TextControl,{label:(0,t.__)("Max Value","formello"),value:n||"",type:"range"===a?"number":a,min:"0",onChange:e=>{C({max:e})}}),(0,e.createElement)(r.TextControl,{type:"number",label:(0,t.__)("Step Value","formello"),value:u||"",onChange:e=>C({step:Number(e)})})),k.includes("minlength")&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.TextControl,{type:"number",label:(0,t.__)("Min Characters","formello"),value:m,min:"0",onChange:e=>C({minlength:e}),help:(0,t.__)("Minimum length (number of characters) of value.","formello")}),(0,e.createElement)(r.TextControl,{type:"number",label:(0,t.__)("Max Characters","formello"),value:d,onChange:e=>C({maxlength:e}),help:(0,t.__)("Maximum length (number of characters) of value.","formello")})),k.includes("pattern")&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(v,{label:"Pattern",clientId:E,tabs:[{name:"passwords",title:"Passwords",data:[{title:"Password",tag:"^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",description:"One uppercase, one number, at least 8 chars"},{title:"Password with special characters",tag:"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",description:"One uppercase, one number, one special chars, at least 8 chars"}]},{name:"dates",title:"Dates",data:[{title:"dd/mm/yyyy",tag:"^\\d{2}-\\d{2}-\\d{4}$"},{title:"dd/mm/yy",tag:"^\\d{2}-\\d{2}-\\d{2}$"}]}],value:b,onChange:e=>{C({pattern:e})},help:(0,t.__)("Pattern the value must match to be valid.","formello")})),k.includes("pattern")&&(0,e.createElement)(r.TextControl,{label:(0,t.__)("Custom Validation Message","formello"),help:(0,t.__)("The message to show if pattern validation fails.","formello"),value:f,onChange:e=>C({validation:e})}),(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Enable match field","formello"),checked:g,onChange:e=>C({enableMismatch:e})}),g&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.SelectControl,{label:(0,t.__)("Match","formello"),value:_,options:[{value:"",label:(0,t.__)("Select a field","formello")},...T],onChange:e=>C({match:e}),help:(0,t.__)("Select the field to match.","formello")}),(0,e.createElement)(r.TextControl,{type:"text",label:(0,t.__)("Mismatch message","formello"),value:x||"",onChange:e=>C({mismatchMessage:e})})))},k=window.wp.blocks,T=(0,r.withFilters)("formello.advancedOptions")((function(l){const{attributes:{type:o,disabled:n,enableAutoComplete:i,autocomplete:c,readonly:u,advanced:d},setAttributes:p,fieldType:h,clientId:f}=l,g=y[h],b=(0,m.useSelect)((e=>{const{getBlock:t}=e(a.store),l=t(f);return!(!l||!l.innerBlocks.length)}),[f]),{replaceInnerBlocks:_}=(0,m.useDispatch)(a.store);return(0,e.createElement)(s.Fragment,null,g.includes("cols")&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Enable Rich Text","formello"),checked:d,onChange:e=>p({advanced:e})}),g.includes("autocomplete")&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Autocomplete","formello"),checked:i,onChange:e=>p({enableAutoComplete:e}),help:(0,t.__)("Hint for form autofill feature.","formello")}),i&&g.includes("autocomplete")&&(0,e.createElement)(r.TextControl,{label:(0,t.__)("Autocomplete attribute","formello"),value:c,onChange:e=>p({autocomplete:e})}),"range"===o&&(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Show output","formello"),checked:b,onChange:e=>{e?(p({withOutput:!0}),(()=>{let e="formello/button";"range"===o&&(e="formello/output"),_(l.clientId,(0,k.createBlocksFromInnerBlocksTemplate)([[e]]),!0)})()):(p({withOutput:!1}),_(f,[],!0))}}),"hidden"!==o&&(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Disabled","formello"),checked:n,onChange:e=>p({disabled:e}),help:(0,t.__)("Make the control not accept clicks.","formello")}),(0,e.createElement)(r.ToggleControl,{label:(0,t.__)("Read only","formello"),checked:u,onChange:e=>p({readonly:e}),help:(0,t.__)("Make value not editable.","formello")})))}));function q(){return q=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var l=arguments[t];for(var a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a])}return e},q.apply(this,arguments)}var P,M,B=function(t){return e.createElement("svg",q({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},t),C||(C=e.createElement("path",{fill:"currentColor",d:"M12.75 6h-1.5v4.19L8.288 7.226l-1.061 1.06 2.962 2.963H6v1.5h4.19l-2.963 2.962 1.06 1.061 2.963-2.962V18h1.5v-4.19l2.962 2.963 1.061-1.06-2.962-2.963H18v-1.5h-4.19l2.963-2.962-1.06-1.061-2.963 2.962V6Z"})))};function A(){return A=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var l=arguments[t];for(var a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a])}return e},A.apply(this,arguments)}function I(l){const{attributes:a,setAttributes:o,clientId:n}=l,{required:i,showHelp:c,hideLabel:u,type:d}=a,p=(0,e.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(r.Rect,{x:"4.75",y:"17.25",width:"5.5",height:"14.5",transform:"rotate(-90 4.75 17.25)",stroke:"currentColor",fill:"none",strokeWidth:"1.5"}),(0,e.createElement)(r.Rect,{x:"4",y:"7",width:"10",height:"2",fill:"currentColor"}));return(0,e.createElement)(s.Fragment,null,(0,e.createElement)(r.ToolbarButton,{label:(0,t.__)("Required","formello"),icon:B,isPressed:i,onClick:()=>{(()=>{const e=(0,m.select)("core/block-editor").getBlockParents(n),t=(0,m.select)("core/block-editor").getBlockAttributes(e[0]);o({requiredText:t.requiredText})})(),o({required:!i})}}),"checkbox"!==d&&(0,e.createElement)(r.ToolbarButton,{label:(0,t.__)("Toggle label visibility","formello"),icon:p,isPressed:!u,onClick:()=>{o({hideLabel:!u})}}),(0,e.createElement)(r.ToolbarButton,{label:(0,t.__)("Show help message","formello"),icon:"editor-help",isPressed:c,onClick:()=>{o({showHelp:!c})}}))}var O=window.wp.compose;var S=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"formello/textarea","title":"Textarea","description":"Textarea field.","category":"formello","ancestor":["formello/form"],"textdomain":"formello","attributes":{"id":{"type":"string","source":"attribute","selector":"textarea","attribute":"id","default":""},"name":{"type":"string","source":"attribute","selector":"textarea","attribute":"name"},"label":{"type":"string","source":"html","selector":"label span:not(.required)","default":"My textarea"},"hideLabel":{"type":"boolean","selector":"label.hide","default":false},"placeholder":{"type":"string","source":"attribute","selector":"textarea","attribute":"placeholder","default":""},"value":{"type":"string","source":"text","selector":"textarea","default":""},"validation":{"type":"string","source":"attribute","selector":"textarea","attribute":"data-bouncer-message","default":""},"enableMismatch":{"type":"boolean","default":false},"mismatchMessage":{"type":"string","source":"attribute","selector":"textarea","attribute":"data-bouncer-mismatch-message","default":""},"match":{"type":"string","source":"attribute","selector":"textarea","attribute":"data-bouncer-match","default":""},"required":{"type":"boolean","source":"attribute","selector":"textarea","attribute":"required","default":false},"autocomplete":{"enum":["on","off"],"source":"attribute","selector":"textarea","attribute":"autocomplete","default":"off"},"requiredText":{"type":"string","source":"text","selector":"label span.required","default":"*"},"disabled":{"type":"boolean","source":"attribute","selector":"textarea","attribute":"disabled","default":false},"readonly":{"type":"boolean","source":"attribute","selector":"textarea","attribute":"readonly","default":false},"showHelp":{"type":"boolean","default":false},"help":{"type":"string","source":"html","selector":"small","default":""},"cols":{"type":"string","source":"attribute","selector":"textarea","attribute":"cols"},"rows":{"type":"string","source":"attribute","selector":"textarea","attribute":"rows"},"minlength":{"type":"string","source":"attribute","selector":"textarea","attribute":"minlength"},"maxlength":{"type":"string","source":"attribute","selector":"textarea","attribute":"maxlength"},"pattern":{"type":"string","source":"attribute","selector":"textarea","attribute":"pattern"},"advanced":{"type":"boolean","selector":"textarea.formello-rft"}},"supports":{"html":false,"inserter":true,"className":false,"reusable":false,"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}}},"editorScript":"file:./index.js"}');(0,k.registerBlockType)(S,{transforms:{from:[{type:"block",blocks:["formello/input"],transform:e=>(0,k.createBlock)("formello/textarea",e)}]},icon:function(t){return e.createElement("svg",A({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",width:800,height:800,viewBox:"0 0 48 48"},t),P||(P=e.createElement("path",{d:"M16 33h-2V3h2V0H8v3h2v30H8v3h8z"})),M||(M=e.createElement("path",{d:"M17.031 6v4H44v34H4V10h2.938V6H0v42h48V6z"})))},edit:function l(o){const{attributes:c,setAttributes:u}=o,{cols:d,rows:p,value:h,placeholder:f,showHelp:g,help:b,advanced:_}=c,v=y.textarea,w=function(e,t){const{attributes:l,setAttributes:a}=t,{type:r,label:o,name:n,id:i}=l,c=(0,O.useInstanceId)(e),{postId:u}=(0,m.useSelect)((e=>({postId:e("core/editor").getCurrentPostId()})),[]),d="field_"+r+"-"+u+"-"+c;return(0,s.useEffect)((()=>{var e;!i===d&&a({id:d}),n||a({name:o.length?(e=o,e.replace(/[^\p{L}\p{N}]+/gu,"_").toLowerCase().replace(/(^-+)|(-+$)/g,"")):d})})),d}(l,o),C=(0,a.__experimentalUseBorderProps)(c),k=n()("formello","formello-textarea"),q=n()(C.className,{"formello-rtf":_}),P=(0,a.useBlockProps)({className:k});return(0,e.createElement)("div",{...P},(0,e.createElement)(a.BlockControls,null,v.includes("required")&&(0,e.createElement)(r.ToolbarGroup,null,(0,e.createElement)(I,{...o}))),(0,e.createElement)(a.InspectorControls,null,(0,e.createElement)(x,{...o,fieldType:"textarea"}),(0,e.createElement)(E,{...o,fieldType:"textarea"})),(0,e.createElement)(a.InspectorAdvancedControls,null,(0,e.createElement)(T,{...o,fieldType:"textarea"})),(0,e.createElement)(i,{...o,htmlFor:"textarea"}),(0,e.createElement)("textarea",{cols:d,rows:p,value:h,onChange:e=>u({value:e.target.value}),placeholder:f,className:q,style:C.style,id:w}),g&&(0,e.createElement)(a.RichText,{tagName:"small",value:b,onChange:e=>u({help:e}),placeholder:(0,t.__)("Enter help message…","formello"),allowedFormats:["core/bold","core/italic","core/link"],multiline:!1}))},save:function({attributes:t}){const{id:l,hideLabel:r,advanced:o,validation:i,help:s,value:c,label:u,required:m,requiredText:d}=t,p=(0,a.__experimentalGetBorderClassesAndStyles)(t),h=n()("formello"),f=n()("textarea-label",{hide:r}),g=n()(p.className,{"formello-rtf":o}),b=Object.fromEntries(y.textarea.map((e=>[e,t[e]])));return i&&(b["data-bouncer-message"]=i),(0,e.createElement)("div",{...a.useBlockProps.save(),className:h},(0,e.createElement)("label",{className:f,htmlFor:l},(0,e.createElement)(a.RichText.Content,{tagName:"span",value:u}),m&&(0,e.createElement)("span",{className:"required"},d)),(0,e.createElement)("textarea",{...b,className:g,style:p.style},c),s.length>0&&(0,e.createElement)(a.RichText.Content,{tagName:"small",value:s}))}})}()}();