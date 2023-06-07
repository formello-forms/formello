(()=>{var e,t={240:(e,t,n)=>{"use strict";const r=window.wp.element,l=window.wp.i18n,a=window.React;function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}var s;!function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"}(s||(s={}));const i="popstate";function c(e,t){if(!1===e||null==e)throw new Error(t)}function u(e){return{usr:e.state,key:e.key}}function m(e,t,n,r){return void 0===n&&(n=null),o({pathname:"string"==typeof e?e:e.pathname,search:"",hash:""},"string"==typeof t?p(t):t,{state:n,key:t&&t.key||r||Math.random().toString(36).substr(2,8)})}function d(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&"?"!==n&&(t+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(t+="#"===r.charAt(0)?r:"#"+r),t}function p(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function h(e){let t="undefined"!=typeof window&&void 0!==window.location&&"null"!==window.location.origin?window.location.origin:window.location.href,n="string"==typeof e?e:d(e);return c(t,"No window.location.(origin|href) available to create URL for href: "+n),new URL(n,t)}var f;function g(e,t,n){void 0===n&&(n="/");let r=j(("string"==typeof t?p(t):t).pathname||"/",n);if(null==r)return null;let l=v(e);!function(e){e.sort(((e,t)=>e.score!==t.score?t.score-e.score:function(e,t){return e.length===t.length&&e.slice(0,-1).every(((e,n)=>e===t[n]))?e[e.length-1]-t[t.length-1]:0}(e.routesMeta.map((e=>e.childrenIndex)),t.routesMeta.map((e=>e.childrenIndex)))))}(l);let a=null;for(let e=0;null==a&&e<l.length;++e)a=k(l[e],R(r));return a}function v(e,t,n,r){void 0===t&&(t=[]),void 0===n&&(n=[]),void 0===r&&(r="");let l=(e,l,a)=>{let o={relativePath:void 0===a?e.path||"":a,caseSensitive:!0===e.caseSensitive,childrenIndex:l,route:e};o.relativePath.startsWith("/")&&(c(o.relativePath.startsWith(r),'Absolute route path "'+o.relativePath+'" nested under path "'+r+'" is not valid. An absolute child route path must start with the combined path of all its parent routes.'),o.relativePath=o.relativePath.slice(r.length));let s=F([r,o.relativePath]),i=n.concat(o);e.children&&e.children.length>0&&(c(!0!==e.index,'Index routes must not have child routes. Please remove all child routes from route path "'+s+'".'),v(e.children,t,i,s)),(null!=e.path||e.index)&&t.push({path:s,score:O(s,e.index),routesMeta:i})};return e.forEach(((e,t)=>{var n;if(""!==e.path&&null!=(n=e.path)&&n.includes("?"))for(let n of E(e.path))l(e,t,n);else l(e,t)})),t}function E(e){let t=e.split("/");if(0===t.length)return[];let[n,...r]=t,l=n.endsWith("?"),a=n.replace(/\?$/,"");if(0===r.length)return l?[a,""]:[a];let o=E(r.join("/")),s=[];return s.push(...o.map((e=>""===e?a:[a,e].join("/")))),l&&s.push(...o),s.map((t=>e.startsWith("/")&&""===t?"/":t))}!function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"}(f||(f={}));const y=/^:\w+$/,w=3,b=2,_=1,C=10,x=-2,S=e=>"*"===e;function O(e,t){let n=e.split("/"),r=n.length;return n.some(S)&&(r+=x),t&&(r+=b),n.filter((e=>!S(e))).reduce(((e,t)=>e+(y.test(t)?w:""===t?_:C)),r)}function k(e,t){let{routesMeta:n}=e,r={},l="/",a=[];for(let e=0;e<n.length;++e){let o=n[e],s=e===n.length-1,i="/"===l?t:t.slice(l.length)||"/",c=P({path:o.relativePath,caseSensitive:o.caseSensitive,end:s},i);if(!c)return null;Object.assign(r,c.params);let u=o.route;a.push({params:r,pathname:F([l,c.pathname]),pathnameBase:B(F([l,c.pathnameBase])),route:u}),"/"!==c.pathnameBase&&(l=F([l,c.pathnameBase]))}return a}function P(e,t){"string"==typeof e&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=function(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=!0),T("*"===e||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were "'+e.replace(/\*$/,"/*")+'" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "'+e.replace(/\*$/,"/*")+'".');let r=[],l="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^$?{}|()[\]]/g,"\\$&").replace(/\/:(\w+)/g,((e,t)=>(r.push(t),"/([^\\/]+)")));return e.endsWith("*")?(r.push("*"),l+="*"===e||"/*"===e?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?l+="\\/*$":""!==e&&"/"!==e&&(l+="(?:(?=\\/|$))"),[new RegExp(l,t?void 0:"i"),r]}(e.path,e.caseSensitive,e.end),l=t.match(n);if(!l)return null;let a=l[0],o=a.replace(/(.)\/+$/,"$1"),s=l.slice(1);return{params:r.reduce(((e,t,n)=>{if("*"===t){let e=s[n]||"";o=a.slice(0,a.length-e.length).replace(/(.)\/+$/,"$1")}return e[t]=function(e,t){try{return decodeURIComponent(e)}catch(n){return T(!1,'The value for the URL param "'+t+'" will not be decoded because the string "'+e+'" is a malformed URL segment. This is probably due to a bad percent encoding ('+n+")."),e}}(s[n]||"",t),e}),{}),pathname:a,pathnameBase:o,pattern:e}}function R(e){try{return decodeURI(e)}catch(t){return T(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding ('+t+")."),e}}function j(e,t){if("/"===t)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&"/"!==r?null:e.slice(n)||"/"}function T(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}function L(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified `to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the `to."+n+'` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'}const F=e=>e.join("/").replace(/\/\/+/g,"/"),B=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),N=e=>e&&"?"!==e?e.startsWith("?")?e:"?"+e:"",D=e=>e&&"#"!==e?e.startsWith("#")?e:"#"+e:"";class U extends Error{}class H{constructor(e,t,n,r){void 0===r&&(r=!1),this.status=e,this.statusText=t||"",this.internal=r,n instanceof Error?(this.data=n.toString(),this.error=n):this.data=n}}function A(e){return e instanceof H}const I=["post","put","patch","delete"],M=(new Set(I),["get",...I]);function W(){return W=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},W.apply(this,arguments)}new Set(M),new Set([301,302,303,307,308]),new Set([307,308]),"undefined"!=typeof window&&void 0!==window.document&&window.document.createElement;const $="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},{useState:q,useEffect:G,useLayoutEffect:V,useDebugValue:J}=a;function K(e){const t=e.getSnapshot,n=e.value;try{const e=t();return!$(n,e)}catch(e){return!0}}"undefined"==typeof window||void 0===window.document||window.document.createElement;"useSyncExternalStore"in a&&a.useSyncExternalStore;const Y=a.createContext(null),z=a.createContext(null),Q=a.createContext(null),X=a.createContext(null),Z=a.createContext(null),ee=a.createContext({outlet:null,matches:[]}),te=a.createContext(null);function ne(){return null!=a.useContext(Z)}function re(){return ne()||c(!1),a.useContext(Z).location}function le(){ne()||c(!1);let{basename:e,navigator:t}=a.useContext(X),{matches:n}=a.useContext(ee),{pathname:r}=re(),l=JSON.stringify(function(e){return e.filter(((e,t)=>0===t||e.route.path&&e.route.path.length>0))}(n).map((e=>e.pathnameBase))),s=a.useRef(!1);return a.useEffect((()=>{s.current=!0})),a.useCallback((function(n,a){if(void 0===a&&(a={}),!s.current)return;if("number"==typeof n)return void t.go(n);let i=function(e,t,n,r){let l;void 0===r&&(r=!1),"string"==typeof e?l=p(e):(l=o({},e),c(!l.pathname||!l.pathname.includes("?"),L("?","pathname","search",l)),c(!l.pathname||!l.pathname.includes("#"),L("#","pathname","hash",l)),c(!l.search||!l.search.includes("#"),L("#","search","hash",l)));let a,s=""===e||""===l.pathname,i=s?"/":l.pathname;if(r||null==i)a=n;else{let e=t.length-1;if(i.startsWith("..")){let t=i.split("/");for(;".."===t[0];)t.shift(),e-=1;l.pathname=t.join("/")}a=e>=0?t[e]:"/"}let u=function(e,t){void 0===t&&(t="/");let{pathname:n,search:r="",hash:l=""}="string"==typeof e?p(e):e,a=n?n.startsWith("/")?n:function(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach((e=>{".."===e?n.length>1&&n.pop():"."!==e&&n.push(e)})),n.length>1?n.join("/"):"/"}(n,t):t;return{pathname:a,search:N(r),hash:D(l)}}(l,a),m=i&&"/"!==i&&i.endsWith("/"),d=(s||"."===i)&&n.endsWith("/");return u.pathname.endsWith("/")||!m&&!d||(u.pathname+="/"),u}(n,JSON.parse(l),r,"path"===a.relative);"/"!==e&&(i.pathname="/"===i.pathname?e:F([e,i.pathname])),(a.replace?t.replace:t.push)(i,a.state,a)}),[e,t,l,r])}function ae(){let{matches:e}=a.useContext(ee),t=e[e.length-1];return t?t.params:{}}function oe(){let e=function(){var e;let t=a.useContext(te),n=function(e){let t=a.useContext(Q);return t||c(!1),t}(ue.UseRouteError),r=function(e){let t=function(e){let t=a.useContext(ee);return t||c(!1),t}(),n=t.matches[t.matches.length-1];return n.route.id||c(!1),n.route.id}(ue.UseRouteError);return t||(null==(e=n.errors)?void 0:e[r])}(),t=A(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,r="rgba(200,200,200, 0.5)",l={padding:"0.5rem",backgroundColor:r},o={padding:"2px 4px",backgroundColor:r};return a.createElement(a.Fragment,null,a.createElement("h2",null,"Unhandled Thrown Error!"),a.createElement("h3",{style:{fontStyle:"italic"}},t),n?a.createElement("pre",{style:l},n):null,a.createElement("p",null,"💿 Hey developer 👋"),a.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",a.createElement("code",{style:o},"errorElement")," props on ",a.createElement("code",{style:o},"<Route>")))}class se extends a.Component{constructor(e){super(e),this.state={location:e.location,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location?{error:e.error,location:e.location}:{error:e.error||t.error,location:t.location}}componentDidCatch(e,t){console.error("React Router caught the following error during render",e,t)}render(){return this.state.error?a.createElement(ee.Provider,{value:this.props.routeContext},a.createElement(te.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function ie(e){let{routeContext:t,match:n,children:r}=e,l=a.useContext(Y);return l&&n.route.errorElement&&(l._deepestRenderedBoundaryId=n.route.id),a.createElement(ee.Provider,{value:t},r)}var ce,ue,me,de,pe;function he(e){c(!1)}function fe(e){let{basename:t="/",children:n=null,location:r,navigationType:l=s.Pop,navigator:o,static:i=!1}=e;ne()&&c(!1);let u=t.replace(/^\/*/,"/"),m=a.useMemo((()=>({basename:u,navigator:o,static:i})),[u,o,i]);"string"==typeof r&&(r=p(r));let{pathname:d="/",search:h="",hash:f="",state:g=null,key:v="default"}=r,E=a.useMemo((()=>{let e=j(d,u);return null==e?null:{pathname:e,search:h,hash:f,state:g,key:v}}),[u,d,h,f,g,v]);return null==E?null:a.createElement(X.Provider,{value:m},a.createElement(Z.Provider,{children:n,value:{location:E,navigationType:l}}))}function ge(e){let{children:t,location:n}=e,r=a.useContext(z);return function(e,t){ne()||c(!1);let{navigator:n}=a.useContext(X),r=a.useContext(Q),{matches:l}=a.useContext(ee),o=l[l.length-1],i=o?o.params:{},u=(o&&o.pathname,o?o.pathnameBase:"/");o&&o.route;let m,d=re();if(t){var h;let e="string"==typeof t?p(t):t;"/"===u||(null==(h=e.pathname)?void 0:h.startsWith(u))||c(!1),m=e}else m=d;let f=m.pathname||"/",v=g(e,{pathname:"/"===u?f:f.slice(u.length)||"/"}),E=function(e,t,n){if(void 0===t&&(t=[]),null==e){if(null==n||!n.errors)return null;e=n.matches}let r=e,l=null==n?void 0:n.errors;if(null!=l){let e=r.findIndex((e=>e.route.id&&(null==l?void 0:l[e.route.id])));e>=0||c(!1),r=r.slice(0,Math.min(r.length,e+1))}return r.reduceRight(((e,o,s)=>{let i=o.route.id?null==l?void 0:l[o.route.id]:null,c=n?o.route.errorElement||a.createElement(oe,null):null,u=t.concat(r.slice(0,s+1)),m=()=>a.createElement(ie,{match:o,routeContext:{outlet:e,matches:u}},i?c:void 0!==o.route.element?o.route.element:e);return n&&(o.route.errorElement||0===s)?a.createElement(se,{location:n.location,component:c,error:i,children:m(),routeContext:{outlet:null,matches:u}}):m()}),null)}(v&&v.map((e=>Object.assign({},e,{params:Object.assign({},i,e.params),pathname:F([u,n.encodeLocation?n.encodeLocation(e.pathname).pathname:e.pathname]),pathnameBase:"/"===e.pathnameBase?u:F([u,n.encodeLocation?n.encodeLocation(e.pathnameBase).pathname:e.pathnameBase])}))),l,r||void 0);return t&&E?a.createElement(Z.Provider,{value:{location:W({pathname:"/",search:"",hash:"",state:null,key:"default"},m),navigationType:s.Pop}},E):E}(r&&!t?r.router.routes:Ee(t),n)}!function(e){e.UseRevalidator="useRevalidator"}(ce||(ce={})),function(e){e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator"}(ue||(ue={})),function(e){e[e.pending=0]="pending",e[e.success=1]="success",e[e.error=2]="error"}(me||(me={})),new Promise((()=>{}));class ve extends a.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}componentDidCatch(e,t){console.error("<Await> caught the following error during render",e,t)}render(){let{children:e,errorElement:t,resolve:n}=this.props,r=null,l=me.pending;if(n instanceof Promise)if(this.state.error){me.error;let e=this.state.error;Promise.reject().catch((()=>{})),Object.defineProperty(r,"_tracked",{get:()=>!0}),Object.defineProperty(r,"_error",{get:()=>e})}else n._tracked?void 0!==r._error?me.error:void 0!==r._data?me.success:me.pending:(me.pending,Object.defineProperty(n,"_tracked",{get:()=>!0}),n.then((e=>Object.defineProperty(n,"_data",{get:()=>e})),(e=>Object.defineProperty(n,"_error",{get:()=>e}))));else me.success,Promise.resolve(),Object.defineProperty(r,"_tracked",{get:()=>!0}),Object.defineProperty(r,"_data",{get:()=>n});if(l===me.error&&r._error instanceof AbortedDeferredError)throw neverSettledPromise;if(l===me.error&&!t)throw r._error;if(l===me.error)return React.createElement(AwaitContext.Provider,{value:r,children:t});if(l===me.success)return React.createElement(AwaitContext.Provider,{value:r,children:e});throw r}}function Ee(e,t){void 0===t&&(t=[]);let n=[];return a.Children.forEach(e,((e,r)=>{if(!a.isValidElement(e))return;if(e.type===a.Fragment)return void n.push.apply(n,Ee(e.props.children,t));e.type!==he&&c(!1),e.props.index&&e.props.children&&c(!1);let l=[...t,r],o={id:e.props.id||l.join("-"),caseSensitive:e.props.caseSensitive,element:e.props.element,index:e.props.index,path:e.props.path,loader:e.props.loader,action:e.props.action,errorElement:e.props.errorElement,hasErrorBoundary:null!=e.props.errorElement,shouldRevalidate:e.props.shouldRevalidate,handle:e.props.handle};e.props.children&&(o.children=Ee(e.props.children,l)),n.push(o)})),n}function ye(e){let{basename:t,children:n,window:r}=e,l=a.useRef();var o;null==l.current&&(l.current=(void 0===(o={window:r,v5Compat:!0})&&(o={}),function(e,t,n,r){void 0===r&&(r={});let{window:l=document.defaultView,v5Compat:a=!1}=r,o=l.history,c=s.Pop,p=null;function f(){c=s.Pop,p&&p({action:c,location:g.location})}let g={get action(){return c},get location(){return e(l,o)},listen(e){if(p)throw new Error("A history only accepts one active listener");return l.addEventListener(i,f),p=e,()=>{l.removeEventListener(i,f),p=null}},createHref:e=>t(l,e),encodeLocation(e){let t=h("string"==typeof e?e:d(e));return{pathname:t.pathname,search:t.search,hash:t.hash}},push:function(e,t){c=s.Push;let r=m(g.location,e,t);n&&n(r,e);let i=u(r),d=g.createHref(r);try{o.pushState(i,"",d)}catch(e){l.location.assign(d)}a&&p&&p({action:c,location:g.location})},replace:function(e,t){c=s.Replace;let r=m(g.location,e,t);n&&n(r,e);let l=u(r),i=g.createHref(r);o.replaceState(l,"",i),a&&p&&p({action:c,location:g.location})},go:e=>o.go(e)};return g}((function(e,t){let{pathname:n="/",search:r="",hash:l=""}=p(e.location.hash.substr(1));return m("",{pathname:n,search:r,hash:l},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}),(function(e,t){let n=e.document.querySelector("base"),r="";if(n&&n.getAttribute("href")){let t=e.location.href,n=t.indexOf("#");r=-1===n?t:t.slice(0,n)}return r+"#"+("string"==typeof t?t:d(t))}),(function(e,t){!function(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}("/"===e.pathname.charAt(0),"relative pathnames are not supported in hash history.push("+JSON.stringify(t)+")")}),o)));let c=l.current,[f,g]=a.useState({action:c.action,location:c.location});return a.useLayoutEffect((()=>c.listen(g)),[c]),a.createElement(fe,{basename:t,children:n,location:f.location,navigationType:f.action,navigator:c})}(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmitImpl="useSubmitImpl",e.UseFetcher="useFetcher"})(de||(de={})),function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"}(pe||(pe={}));const we=window.wp.components;function be(e){let{text:t}=e;return(0,r.createElement)("div",{className:"loading-settings"},(0,r.createElement)(we.Spinner,null),(0,r.createElement)("span",{className:"description"},t))}const _e=window.wp.data,Ce=window.wp.coreData,xe=window.wp.hooks;function Se(){return(0,r.createElement)("div",{className:"ads-container"},(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Need help?","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)("p",null,(0,l.__)("Detailed documentation is available on the plugin website.","formello")),(0,r.createElement)(we.ExternalLink,{href:"https://docs.formello.net"},(0,l.__)("Documentation","formello")),(0,r.createElement)("p",null,(0,l.__)("We would love to help you out if you need any help.","formello")),(0,r.createElement)(we.ExternalLink,{href:"https://wordpress.org/support/plugin/formello/"},(0,l.__)("Ask a question","formello")))),(0,r.createElement)(we.Card,{className:"ads-container__reviews"},(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Do you like the plugin?","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)("p",null,(0,l.__)("If you like Formello plugin you can share a review to help us and spread some love!","formello")),(0,r.createElement)(we.ExternalLink,{href:"https://wordpress.org/support/plugin/formello/reviews/#new-post"},(0,l.__)("Rate 5 stars!","formello")))))}const Oe=window.wp.apiFetch;var ke=n.n(Oe),Pe=n(184),Re=n.n(Pe);function je(e){const{license:t,license_status:n,req:a,onChange:o}=e,[s,i]=(0,r.useState)(!1),[c,u]=(0,r.useState)(!1);return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(we.__experimentalInputControl,{type:"text",autoComplete:"new-password",label:(0,l.__)("License Key","formello"),value:t,onChange:o,readOnly:"valid"===n,suffix:(0,r.createElement)(we.Button,{onClick:()=>{u(!0),a().then((e=>{"object"==typeof e.response?i({type:e.response.success?"success":"error",text:e.response.license}):i({type:"error",text:e.response})})).catch((e=>{i({type:"error",text:e.message})})).finally((()=>{u(!1)}))},isPrimary:"valid"!==n,isSecondary:"valid"===n,"aria-disabled":c,isBusy:c,disabled:""===t},"valid"!==n?"Activate":"Deactivate")}),s&&(0,r.createElement)(we.Notice,{onRemove:()=>i(!1),isDismissible:!0,status:s.type},s.text),""!==t&&n&&(0,r.createElement)(we.Notice,{onRemove:()=>i(!1),isDismissible:!1,className:Re()("message",{"is-success":"valid"===n,"is-warning":"valid"!==n})},(0,r.createElement)(r.RawHTML,null,(0,l.sprintf)(
/* translators: %s: License status. */
(0,l.__)('License status: <strong class="license-%s">%s</strong>',"formello"),`${"valid"===n||"error"}`,`${n}`))))}function Te(e){const{settings:t,setSettings:n,saveSettings:a}=e,o=t.formello.license,s=t.formello.license_status;function i(e,r){const l=Object.assign({},t.formello);l[e]=r,n({...t,formello:l})}return(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("License","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)(we.ExternalLink,{href:"https://formello.net"},(0,l.__)("Get a FREE API Key")),(0,r.createElement)(r.RawHTML,null,(0,l.sprintf)(
/* translators: Addon license. */
(0,l.__)("<p>Your %s key provides access to addons. You can still using Formello without a license key.</p>","formello"),"<strong>free license</strong>")),(0,r.createElement)(je,{req:()=>{const e="valid"!==s?"activate":"deactivate";return ke()({path:"/formello/v1/license/"+e,method:"POST",data:{license:o}}).then((e=>{var t;return null!==(t=e.response)&&void 0!==t&&t.success&&i("license_status",e.response.license),e.success||i("license_status",e.response),Promise.resolve(e)}))},license:o,license_status:s,onChange:e=>i("license",e),saveSettings:a})))}function Le(e){var t;const{settings:n,setSettings:a}=e,o=null!==(t=n.formello.reCaptcha)&&void 0!==t?t:{};function s(e,t){const r=Object.assign({},n.formello);r.reCaptcha[e]=t,a({...n,formello:r})}return(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Google reCaptcha","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)(we.RadioControl,{selected:o.version,options:[{label:"reCaptcha v2 checkbox",value:"1"},{label:"reCaptcha v3 invisible",value:"3"}],onChange:e=>{s("version",e)}}),(0,r.createElement)(we.TextControl,{label:(0,l.__)("Site Key","formello"),value:o.site_key,onChange:e=>{s("site_key",e)}}),(0,r.createElement)(we.TextControl,{label:(0,l.__)("Secret Key","formello"),value:o.secret_key,onChange:e=>{s("secret_key",e)}}),3===Number(o.version)&&(0,r.createElement)(we.TextControl,{label:(0,l.__)("Threshold","formello"),value:o.threshold,onChange:e=>{s("threshold",e)},type:"number",step:"0.1",min:"0",max:"1"})))}function Fe(e){var t;const{settings:n,setSettings:a}=e,o=null!==(t=n.formello.messages)&&void 0!==t?t:{};function s(e,t,r){const l=Object.assign({},n.formello);l.messages[e][t]=r,a({...n,formello:l})}const i=Object.keys(o.form),c=Object.keys(o.missingValue),u=Object.keys(o.patternMismatch),m=Object.keys(o.outOfRange),d=Object.keys(o.wrongLength);return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Form messages","formello"))),(0,r.createElement)(we.CardBody,null,i.map(((e,t)=>(0,r.createElement)(r.Fragment,{key:t},(0,r.createElement)(we.TextControl,{label:e,value:o.form[e],onChange:t=>{s("form",e,t)}})))))),(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Missing value","formello"))),(0,r.createElement)(we.CardBody,null,c.map(((e,t)=>(0,r.createElement)(r.Fragment,{key:t},(0,r.createElement)(we.TextControl,{label:e,value:o.missingValue[e],onChange:t=>{s("missingValue",e,t)}})))))),(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Pattern mismatch","formello"))),(0,r.createElement)(we.CardBody,null,u.map(((e,t)=>(0,r.createElement)(we.TextControl,{key:t,label:e,value:o.patternMismatch[e],onChange:t=>{s("patternMismatch",e,t)}}))))),(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Out of range","formello"))),(0,r.createElement)(we.CardBody,null,m.map(((e,t)=>(0,r.createElement)(we.TextControl,{key:t,label:e,value:o.outOfRange[e],onChange:t=>{s("outOfRange",e,t)}}))))),(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Wrong length","formello"))),(0,r.createElement)(we.CardBody,null,d.map(((e,t)=>(0,r.createElement)(we.TextControl,{key:t,label:e,value:o.wrongLength[e],onChange:t=>{s("wrongLength",e,t)}}))))))}const Be=(0,we.withFilters)("formello.settings.integrations")((e=>(0,r.createElement)(r.Fragment,null,(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Integrations","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)(r.RawHTML,null,(0,l.sprintf)(
/* translators: Link to addons. */
(0,l.__)("<p>Go to %s to download your preferred integrations. We are working on other integrations.</p>","formello"),'<a href="https://formello.net/addons/" target="_blank">addons page</a>'))))))),Ne=e=>{const{settings:t,setSettings:n}=e,a=t.formello.log;return(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Logging","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)("p",null,(0,l.__)("To enable logging, please set this as checked.","formello")),(0,r.createElement)(we.ToggleControl,{label:(0,l.__)("Enable log","formello"),checked:a,onChange:e=>{!function(e){const r=Object.assign({},t.formello);r.log=e,n({...t,formello:r})}(e)}}),a&&(0,r.createElement)(we.ExternalLink,{href:t.url+"/wp-content/uploads/formello/logs/"+t.formello.log_file},(0,l.__)("View log","formello"))))};function De(e){const{handleClose:t,message:n,messageType:l}=e;return(0,r.useEffect)((()=>{let e;return n&&(e=setTimeout((()=>{t(!1)}),3e3)),()=>{clearTimeout(e)}}),[n]),(0,r.createElement)(we.Animate,{type:"slide-in",options:{origin:"top"}},(e=>{let{animateClassName:t}=e;return(0,r.createElement)("span",{className:Re()("formello-message",t,l,{show:n})},n)}))}function Ue(e){const{req:t,withNotice:n,text:a,disabled:o,variant:s,isDestructive:i=!1}=e,[c,u]=(0,r.useState)(!1),[m,d]=(0,r.useState)(!1);return(0,r.createElement)(r.Fragment,null,(0,r.createElement)("div",{className:"setting-controls__save-settings"},(0,r.createElement)(we.Button,{onClick:()=>{d(!0),t().then((e=>{null!=e&&e.success?u({type:e.success?"success":"error",message:e.response}):u({type:"success",message:(0,l.__)("Settings saved.","formello")})})).catch((e=>{u({type:"error",message:e.message})})).finally((()=>d(!1)))},isBusy:m,disabled:o||m,"aria-disabled":o||m,variant:s,isDestructive:i},a),c&&!n&&(0,r.createElement)(De,{message:c.message,messageType:c.type,handleClose:u,key:"message"})),c&&n&&(0,r.createElement)(we.Animate,{type:"slide-in",options:{origin:"top"},key:"loading"},(e=>{let{className:t}=e;return(0,r.createElement)(we.Notice,{status:c.type,onRemove:()=>u(!1),isDismissible:!0,className:Re()("message",t)},(0,r.createElement)(r.RawHTML,null,c.message))})))}var He;function Ae(){return Ae=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ae.apply(this,arguments)}var Ie=function(e){return a.createElement("svg",Ae({xmlns:"http://www.w3.org/2000/svg",width:341.333,height:341.333,viewBox:"0 0 256 256"},e),He||(He=a.createElement("path",{d:"M0 128v128h256V0H0v128zm145.6-66.6c2.9.7 7.8 2.8 11.1 4.5 6.7 3.6 18.3 14.6 16.8 16-2.6 2.3-31.9 23.1-32.6 23.1-.5 0-.9-.5-.9-1 0-.6-1.1-2.2-2.5-3.5-3-3.1-8.3-3.3-11.6-.6-2.2 1.8-2.4 2.7-2.7 14l-.4 12.1H136v37h-13v34H82v-44.8c0-35.5.3-46.1 1.5-51.7 3.9-18.6 18.2-34.2 35.6-38.9 6.9-1.9 19.9-2 26.5-.2z",fill:"#9b51e0"})))};function Me(e){let{title:t}=e;return(0,r.createElement)("div",{className:"masthead"},(0,r.createElement)("div",{className:"inner-container"},(0,r.createElement)("div",{className:"masthead__branding"},(0,r.createElement)("h1",null,(0,r.createElement)(Ie,null),t))))}function We(e){const{savedSettings:t}=e,[n,a]=(0,r.useState)(t),[o,s]=(0,r.useState)(!1),{saveEntityRecord:i}=(0,_e.useDispatch)(Ce.store),c=ae().tab,u=le(),m=[{name:"general",title:"General",component:Te},{name:"recaptcha",title:"reCaptcha",component:Le},{name:"messages",title:"Messages",component:Fe},{name:"integrations",title:"Integrations",component:Be},{name:"logging",title:"Logging",component:Ne}];function d(e){s(!0),a(e)}async function p(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"formello",t="";t={[e]:n[e]};let r="";return r=await i("root","site",t),r&&s(!1),r}return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(Me,{title:(0,l.__)("Settings","formello")}),(0,r.createElement)("div",{className:"setting-tabs"},(0,xe.applyFilters)("formello.dashboard.beforeSettings","",this),(0,r.createElement)(we.TabPanel,{tabs:m,initialTabName:c,onSelect:e=>(e=>{u("/"+e)})(e)},(e=>{const a=e.component;return(0,r.createElement)(we.__experimentalGrid,{columns:4,templateColumns:"3fr 1fr",gap:"4"},(0,r.createElement)("div",null,(0,r.createElement)(a,{settings:null!=n?n:t,setSettings:d,saveSettings:p}),("general"===e.name||"recaptcha"===e.name||"messages"===e.name||"logging"===e.name)&&(0,r.createElement)(Ue,{req:p,text:(0,l.__)("Save options","formello"),disabled:!o,variant:"primary"})),(0,r.createElement)(Se,null))})),(0,xe.applyFilters)("formello.dashboard.settings","",this),(0,xe.applyFilters)("formello.dashboard.afterSettings","",this)))}function $e(){return(0,r.createElement)(r.Fragment,null,(0,r.createElement)("p",null,(0,l.__)("If you need to reset template library.","formello")),(0,r.createElement)(Ue,{req:()=>ke()({path:"/formello/v1/sync_template_library",method:"POST",data:{type:"formello_form",categories:"form"}}),text:(0,l.__)("Re-Sync template","formello"),variant:"primary"}))}function qe(){return(0,r.createElement)(r.Fragment,null,(0,r.createElement)("p",null,(0,l.__)("If you need to reset settings.","formello")),(0,r.createElement)(Ue,{req:()=>confirm((0,l.__)("This will reset all your settings. Are you sure?","formello"))?ke()({path:"/formello/v1/settings/reset",method:"POST"}):Promise.reject(!1),text:(0,l.__)("Reset settings","formello"),isDestructive:!0}))}function Ge(){return(0,r.createElement)("div",null,(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("General","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)($e,null),(0,r.createElement)(we.CardDivider,null),(0,r.createElement)(qe,null))))}const Ve=window.wp.date;function Je(){const[e,t]=(0,r.useState)(!1),n=(0,Ve.dateI18n)("",new Date);return(0,r.createElement)(we.Button,{onClick:()=>(t(!0),ke()({path:"/formello/v1/templates/export",method:"POST",parse:!1}).then((e=>e.blob())).then((e=>{t(!1);const r=window.URL.createObjectURL(e),l=document.createElement("a");l.href=r,l.download=`forms-exported-${n}.json`,document.body.appendChild(l),l.click(),l.remove()})).catch((()=>t(!1)))),text:(0,l.__)("Export forms","formello"),variant:"primary",isBusy:e,disabled:e})}function Ke(){return(0,r.createElement)("div",null,(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Export Forms","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)("p",null,(0,l.__)("When you click the \n\t\t\t\t\tdownload button below, Formello will create a JSON file for you to save \n\t\t\t\t\tto your computer.Once you've saved the downloaded file, you can use the Import \n\t\t\t\t\ttool to import the forms.","formello")),(0,r.createElement)(Je,null))),(0,xe.applyFilters)("formello.Exporter","",this))}function Ye(){var e;const[t,n]=(0,r.useState)(!1);return(0,r.createElement)(r.Fragment,null,(0,r.createElement)("div",{className:"setting-controls__save-settings"},(0,r.createElement)(we.FormFileUpload,{accept:"application/json",onChange:e=>n(e.target.files),variant:"secondary"},(0,l.__)("Choose file","formello")),t&&(null===(e=t[0])||void 0===e?void 0:e.name)),(0,r.createElement)(Ue,{req:()=>{const e=new FormData;return e.append("file",t[0]),ke()({path:"/formello/v1/templates/import",method:"POST",body:e}).finally((()=>n(!1)))},text:(0,l.__)("Import forms","formello"),variant:"primary",disabled:!t}))}function ze(){return(0,r.createElement)("div",null,(0,r.createElement)(we.Card,null,(0,r.createElement)(we.CardHeader,null,(0,r.createElement)("h2",null,(0,l.__)("Importers","formello"))),(0,r.createElement)(we.CardBody,null,(0,r.createElement)("p",null,(0,l.__)("Select the Formello export file(.json) you would like to import.\n\t\t\t\t\t\t \tWhen you click the import button below, Formello will import the forms.","formello")),(0,r.createElement)(Ye,null))),(0,xe.applyFilters)("formello.Importer","",this))}function Qe(){const e=[{name:"general",title:(0,l.__)("General","formello"),component:Ge},{name:"exporters",title:(0,l.__)("Exporters","formello"),component:Ke},{name:"importers",title:(0,l.__)("Importers","formello"),component:ze}];(0,xe.applyFilters)("formello.ToolsTabs","",e);const t=ae().tab,n=le();return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(Me,{title:(0,l.__)("Tools","formello")}),(0,r.createElement)("div",{className:"setting-tabs"},(0,xe.applyFilters)("formello.dashboard.beforeSettings","",this),(0,r.createElement)(we.TabPanel,{tabs:e,onSelect:e=>(e=>{n("/tools/"+e)})(e),initialTabName:t},(e=>{const t=e.component;return(0,r.createElement)(we.__experimentalGrid,{columns:4,templateColumns:"3fr 1fr",gap:"4"},(0,r.createElement)(t,null),(0,r.createElement)(Se,null))})),(0,xe.applyFilters)("formello.dashboard.settings","",this),(0,xe.applyFilters)("formello.dashboard.afterSettings","",this)))}const Xe=()=>{const{savedSettings:e}=(0,_e.useSelect)((e=>{var t;const{getEntityRecord:n}=e(Ce.store);return{savedSettings:null!==(t=n("root","site"))&&void 0!==t?t:null}}));return e?(0,r.createElement)(React.StrictMode,null,(0,r.createElement)(ye,{basename:"/"},(0,r.createElement)(ge,null,(0,r.createElement)(he,{path:"/:tab?",element:(0,r.createElement)(We,{savedSettings:e})}),(0,r.createElement)(he,{path:"/tools/:tab?",element:(0,r.createElement)(Qe,{savedSettings:e})})))):(0,r.createElement)(be,{text:(0,l.__)("Loading settings…","formello")})};window.addEventListener("DOMContentLoaded",(()=>{(0,r.render)((0,r.createElement)(Xe,null),document.getElementById("formello-plugin-settings"))})),function(e){const t=jQuery,n=t("#menu-posts-"+e),r=window.location.href,l=window.location.hash.slice(0);let a="#/";const o=l.split("/");"tools"!==o[1]&&"addons"!==o[1]||(a+=o[1]);const s=r.substr(r.indexOf("edit.php")).replace(l,a);n.on("click","a",(function(){const e=t(this);t("ul.wp-submenu li",n).removeClass("current"),e.hasClass("wp-has-submenu")?t("li.wp-first-item",n).addClass("current"):e.parents("li").addClass("current")})),t("ul.wp-submenu a",n).each((function(e,n){t(n).attr("href")===s&&t(n).parent().addClass("current")}))}("formello_form")},184:(e,t)=>{var n;!function(){"use strict";var r={}.hasOwnProperty;function l(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var a=typeof n;if("string"===a||"number"===a)e.push(n);else if(Array.isArray(n)){if(n.length){var o=l.apply(null,n);o&&e.push(o)}}else if("object"===a)if(n.toString===Object.prototype.toString)for(var s in n)r.call(n,s)&&n[s]&&e.push(s);else e.push(n.toString())}}return e.join(" ")}e.exports?(l.default=l,e.exports=l):void 0===(n=function(){return l}.apply(t,[]))||(e.exports=n)}()}},n={};function r(e){var l=n[e];if(void 0!==l)return l.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,n,l,a)=>{if(!n){var o=1/0;for(u=0;u<e.length;u++){for(var[n,l,a]=e[u],s=!0,i=0;i<n.length;i++)(!1&a||o>=a)&&Object.keys(r.O).every((e=>r.O[e](n[i])))?n.splice(i--,1):(s=!1,a<o&&(o=a));if(s){e.splice(u--,1);var c=l();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,l,a]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={571:0,679:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var l,a,[o,s,i]=n,c=0;if(o.some((t=>0!==e[t]))){for(l in s)r.o(s,l)&&(r.m[l]=s[l]);if(i)var u=i(r)}for(t&&t(n);c<o.length;c++)a=o[c],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(u)},n=globalThis.webpackChunkformello=globalThis.webpackChunkformello||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var l=r.O(void 0,[679],(()=>r(240)));l=r.O(l)})();