!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("react-range-slider-input")):"function"==typeof define&&define.amd?define("firestone",["react","react-range-slider-input"],r):"object"==typeof exports?exports.firestone=r(require("react"),require("react-range-slider-input")):e.firestone=r(e.react,e["react-range-slider-input"])}("undefined"!=typeof self?self:this,((e,r)=>(()=>{"use strict";var _={9155:r=>{r.exports=e},4122:e=>{e.exports=r}},t={};function __webpack_require__(e){var r=t[e];if(void 0!==r)return r.exports;var a=t[e]={exports:{}};return _[e](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var _ in r)__webpack_require__.o(r,_)&&!__webpack_require__.o(e,_)&&Object.defineProperty(e,_,{enumerable:!0,get:r[_]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{__webpack_require__.r(a),__webpack_require__.d(a,{default:()=>s});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{UW:()=>i,gJ:()=>u,oR:()=>o,fC:()=>c});var r=__webpack_require__(9155),_=__webpack_require__.n(r),t=__webpack_require__(4122),n=__webpack_require__.n(t),i="range-slider__CustomRangeSlider___Uo_rw",u="range-slider__errorMessage___rABCa",o="range-slider__price-Container--title___i8SYy",c="range-slider__rangeSlider___fC17Q";const s=function CustomRangeSlider(t){let{min:a,max:s,heading:l=null,selectedMin:p,selectedMax:d,prefix:f=null,postfix:b=null,count:m,onSliderUpdate:q=(()=>{})}=t;const[g,w]=(0,r.useState)(p),[k,v]=(0,r.useState)(d),[x,y]=(0,r.useState)("");return(0,r.useEffect)((()=>{w(p)}),[p]),(0,r.useEffect)((()=>{v(d)}),[d]),_().createElement("div",{className:i},l&&_().createElement("div",{className:o},l),_().createElement(n(),{className:c,min:a,max:s,value:[g,k],onInput:e=>{const[r,_]=e;w(r),v(_)},onThumbDragEnd:()=>{q({minValue:g,maxValue:k})}}),m&&_().createElement("div",{className:e.entityCount},m," Products Found"),x&&_().createElement("p",{className:u},x))}})(),a})()));