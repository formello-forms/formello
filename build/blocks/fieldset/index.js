!function(){"use strict";var e=window.wp.blocks,t=window.React,o=window.wp.i18n,l=window.wp.components,r=window.wp.blockEditor;const n=["core/paragraph","core/heading","core/columns","core/group","formello/input","formello/email","formello/select"];var a,s,i=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"formello/fieldset","title":"Fieldset","description":"A block to display form fieldset.","category":"formello","ancestor":["formello/form"],"textdomain":"formello","attributes":{"showLegend":{"type":"boolean","default":true},"legend":{"type":"string","source":"text","selector":"legend","default":"Legend"}},"supports":{"anchor":true,"html":false,"color":true,"spacing":true,"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"__experimentalLayout":{"allowSwitching":false,"allowInheriting":false,"allowSizingOnChildren":true,"default":{"type":"flex","justifyContent":"stretch","orientation":"vertical","flexWrap":"nowrap"}}},"editorScript":"file:./index.js"}');function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var l in o)Object.prototype.hasOwnProperty.call(o,l)&&(e[l]=o[l])}return e},c.apply(this,arguments)}(0,e.registerBlockType)(i,{icon:function(e){return t.createElement("svg",c({xmlns:"http://www.w3.org/2000/svg",width:80,height:80,viewBox:"0 0 24 24"},e),a||(a=t.createElement("path",{d:"M2 20h1v1H1v-2h1zm20 0h-1v1h2v-2h-1zM1 5h1V4h1V3H1zm1 2H1v2h1zm0 4H1v2h1zm20-2h1V7h-1zm0 4h1v-2h-1zM2 15H1v2h1zm20 2h1v-2h-1zM5 4h2V3H5zm6 0V3H9v1zm2 0h2V3h-2zm6-1h-2v1h2zM5 21h2v-1H5zm4 0h2v-1H9zm4 0h2v-1h-2zm4 0h2v-1h-2zm4-17h1v1h1V3h-2zm-1 4v2a1.001 1.001 0 0 1-1 1H5a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h14a1.001 1.001 0 0 1 1 1zm-.999 2H19V8H5v2h14m1 4v2a1.001 1.001 0 0 1-1 1H5a1.001 1.001 0 0 1-1-1v-2a1.001 1.001 0 0 1 1-1h14a1.001 1.001 0 0 1 1 1zm-.999 2H19v-2H5v2h14"})),s||(s=t.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})))},edit:function({attributes:e,className:a,setAttributes:s}){const i=(0,r.useBlockProps)(),{children:c,...h}=(0,r.useInnerBlocksProps)(i,{allowedBlocks:n,templateLock:!1});return(0,t.createElement)("fieldset",{...h},(0,t.createElement)(r.InspectorControls,null,(0,t.createElement)(l.PanelBody,{title:(0,o.__)("Options","formello"),initialOpen:!0},(0,t.createElement)(l.ToggleControl,{label:(0,o.__)("Show Legend","formello"),checked:e.showLegend,onChange:e=>s({showLegend:e})}))),e.showLegend&&(0,t.createElement)(r.RichText,{tagName:"legend",className:a,value:e.legend,onChange:e=>s({legend:e}),placeholder:(0,o.__)("Enter legend…","formello"),allowedFormats:[]}),c)},save:function({attributes:e}){const o=e.hideBorder?"no-border":void 0,l=r.useBlockProps.save({className:o});return(0,t.createElement)("fieldset",{...l},e.showLegend&&(0,t.createElement)("legend",null,e.legend),(0,t.createElement)(r.InnerBlocks.Content,null))}})}();