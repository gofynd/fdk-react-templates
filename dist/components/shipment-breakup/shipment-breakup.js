!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],r):"object"==typeof exports?exports.firestone=r(require("react")):e.firestone=r(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var r={4429:(e,r,t)=>{t.d(r,{in:()=>priceFormatCurrencySymbol});function priceFormatCurrencySymbol(e,r){return/^[A-Za-z]+$/.test(e)?`${e} ${r}`:`${e}${r}`}},9155:r=>{r.exports=e}},t={};function __webpack_require__(e){var _=t[e];if(void 0!==_)return _.exports;var a=t[e]={exports:{}};return r[e](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var _={};return(()=>{__webpack_require__.r(_),__webpack_require__.d(_,{default:()=>c});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{kh:()=>a,_n:()=>n,RP:()=>l,DD:()=>u,zu:()=>i});var r=__webpack_require__(9155),t=__webpack_require__.n(r),a="shipment-breakup__billing___FTdqB",n="shipment-breakup__boldsm___N65_p",l="shipment-breakup__lightsm___a0yal",u="shipment-breakup__title___MNnnU",i="shipment-breakup__values___Ji3lV",p=__webpack_require__(4429);const c=function ShipmentBreakup(_){let{breakup:c,shipmentInfo:o}=_;const[s,m]=(0,r.useState)("my-orders"),getPriceFormat=(e,r)=>(0,p.in)(e,r);return t().createElement("div",{className:`${a} ${l}`},t().createElement("div",{className:`${u} ${n}`},"BILLING"),t().createElement(t().Fragment,null,(()=>{const e=c?.filter((e=>"total"===e.name))||[],r=c?.filter((e=>"total"!==e.name&&0!==e.value))||[];return e.concat(r)})()?.map(((r,_)=>t().createElement("div",{key:_,className:`${e.breakupItem}`},(_!==c.length-1&&"0"!==r.value||_===c.length-1&&"0"!==r.value)&&t().createElement(t().Fragment,null,_!==c.length-1&&t().createElement("span",null,t().createElement("span",null,r.display),t().createElement("span",{className:`${i}`},getPriceFormat(r.currency_symbol,Number(r.value.toString().replace(/,/g,""))))),_===c.length-1&&t().createElement("span",null,t().createElement("span",null,r.display),t().createElement("span",{className:`${i}`},getPriceFormat(r.currency_symbol,Number(r.value.toString().replace(/,/g,"")))))))))))}})(),_})()));