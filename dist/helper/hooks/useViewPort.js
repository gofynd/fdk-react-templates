!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],r):"object"==typeof exports?exports.firestone=r(require("react")):e.firestone=r(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var r={9155:r=>{r.exports=e}},t={};function __webpack_require__(e){var _=t[e];if(void 0!==_)return _.exports;var o=t[e]={exports:{}};return r[e](o,o.exports,__webpack_require__),o.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var _={};return(()=>{__webpack_require__.r(_),__webpack_require__.d(_,{useViewport:()=>useViewport});var e=__webpack_require__(9155);const useViewport=function(){let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0;const[_,o]=(0,e.useState)(!1);return(0,e.useEffect)((()=>{const handleResize=()=>{if("undefined"!=typeof window){const e=window?.innerWidth;o(e>=r&&e<=t)}};return handleResize(),window?.addEventListener("resize",handleResize),()=>{window?.removeEventListener("resize",handleResize)}}),[r,t]),_}})(),_})()));