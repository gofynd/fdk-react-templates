!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],r):"object"==typeof exports?exports.firestone=r(require("react")):e.firestone=r(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var r={9155:r=>{r.exports=e}},t={};function __webpack_require__(e){var o=t[e];if(void 0!==o)return o.exports;var n=t[e]={exports:{}};return r[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{__webpack_require__.r(o),__webpack_require__.d(o,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var e=__webpack_require__(9155),r=__webpack_require__.n(e);const __WEBPACK_DEFAULT_EXPORT__=t=>{let{sdks:o,setsdkLoaded:n,paymentConfig:s}=t;const _=(0,e.useRef)(0),c=(0,e.useRef)(null);(0,e.useEffect)((()=>{appendScripts()}),[]);const appendScripts=()=>{const e=loadScripts();for(let r=0;r<e.length;r++){const t=document.createElement("script");t.src=e[r].src,t.onload=function(){_.current++,_.current===e.length&&handleEvent("sdks-loaded",!0)},t.onerror=function(){_.current++,_.current===e.length&&handleEvent("sdks-loaded",!0)};for(let o in e[r].attrs)t.setAttribute(o,e[r].attrs[o]);c.current.appendChild(t)}0===e.length&&handleEvent("sdks-loaded",!0)},loadScripts=()=>{const e={Razorpay:[{src:"https://checkout.razorpay.com/v1/razorpay.js"}],Potlee:[{src:"https://cdn.pixelbin.io/v2/potlee/original/public/sdk/potlee.js"}],Simpl:[{src:"https://cdn.getsimpl.com/simpl-custom-v1.min.js",attrs:{id:"getsimpl","data-env":"live"===s.env?"production":"sandbox","data-merchant-id":s.simpl?.key}}],Stripe:[{src:"https://js.stripe.com/v3/"}],Juspay:[]};let r=[];for(let t in o)if(o[t].loadSdk){const o=e[t];o&&(r=r.concat(o))}return r},handleEvent=(e,r)=>{n(r)};return r().createElement("div",{ref:c})}})(),o})()));