!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],t):"object"==typeof exports?exports.firestone=t(require("react")):e.firestone=t(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var t={4429:(e,t,r)=>{r.d(t,{in:()=>priceFormatCurrencySymbol});const numberWithCommas=e=>{let t=e;if(isNaN(e)||(t=function roundToDecimals(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;const r=Math.pow(10,t);return Math.round(e*r)/r}(e)),"-"===t?.toString()[0]&&(t=t.toString().substring(1)),t){let r=t.toString().split(".")[0].length>3?`${t.toString().substring(0,t.toString().split(".")[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g,",")},${t.toString().substring(t.toString().split(".")[0].length-3)}`:t.toString();return"-"===e.toString()[0]&&(r=`-${r}`),r}return 0};function priceFormatCurrencySymbol(e,t){const r=/^[A-Za-z]+$/.test(e);let n="string"==typeof t?t:numberWithCommas(t);return r?`${e} ${n}`:`${e}${n}`}},9155:t=>{t.exports=e}},r={};function __webpack_require__(e){var n=r[e];if(void 0!==n)return n.exports;var _=r[e]={exports:{}};return t[e](_,_.exports,__webpack_require__),_.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{__webpack_require__.r(n),__webpack_require__.d(n,{default:()=>c});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{kh:()=>_,_n:()=>a,RP:()=>i,DD:()=>l,zu:()=>o});var t=__webpack_require__(9155),r=__webpack_require__.n(t),_="shipment-breakup__billing___FTdqB",a="shipment-breakup__boldsm___N65_p",i="shipment-breakup__lightsm___a0yal",l="shipment-breakup__title___MNnnU",o="shipment-breakup__values___Ji3lV",u=__webpack_require__(4429);const c=function ShipmentBreakup(n){let{breakup:c}=n;const getPriceFormat=(e,t)=>(0,u.in)(e,t),p=(0,t.useMemo)((()=>{const e=c?.filter((e=>"total"===e.name))||[];return(c?.filter((e=>"total"!==e.name&&0!==e.value))||[]).concat(e)}),[c]);return r().createElement("div",{className:`${_} ${i}`},r().createElement("div",{className:`${l} ${a}`},"BILLING"),r().createElement(r().Fragment,null,p?.map(((t,n)=>r().createElement("div",{key:n,className:`${e.breakupItem}`},(n!==c.length-1&&"0"!==t.value||n===c.length-1&&"0"!==t.value)&&r().createElement(r().Fragment,null,n!==c.length-1&&r().createElement("span",null,r().createElement("span",null,t.display),r().createElement("span",{className:`${o}`},getPriceFormat(t.currency_symbol,Number(t.value.toString().replace(/,/g,""))))),n===c.length-1&&r().createElement("span",null,r().createElement("span",null,t.display),r().createElement("span",{className:`${o}`},getPriceFormat(t.currency_symbol,Number(t.value.toString().replace(/,/g,"")))))))))))}})(),n})()));