!function webpackUniversalModuleDefinition(e,_){"object"==typeof exports&&"object"==typeof module?module.exports=_(require("fdk-core/components"),require("react")):"function"==typeof define&&define.amd?define("firestone",["fdk-core/components","react"],_):"object"==typeof exports?exports.firestone=_(require("fdk-core/components"),require("react")):e.firestone=_(e["fdk-core/components"],e.react)}("undefined"!=typeof self?self:this,((e,_)=>(()=>{"use strict";var r={4429:(e,_,r)=>{r.d(_,{SM:()=>detectMobileWidth});function isRunningOnClient(){return"undefined"!=typeof window&&globalThis===window}const detectMobileWidth=()=>{if(isRunningOnClient())return!!(window&&window.screen?.width<=768)}},7438:_=>{_.exports=e},9155:e=>{e.exports=_}},t={};function __webpack_require__(e){var _=t[e];if(void 0!==_)return _.exports;var n=t[e]={exports:{}};return r[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var _=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(_,{a:_}),_},__webpack_require__.d=(e,_)=>{for(var r in _)__webpack_require__.o(_,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:_[r]})},__webpack_require__.o=(e,_)=>Object.prototype.hasOwnProperty.call(e,_),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{__webpack_require__.r(n),__webpack_require__.d(n,{default:()=>empty_state});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{b1:()=>o,b2:()=>i,x6:()=>a,h_:()=>c,z3:()=>s,R_:()=>u});var _=__webpack_require__(9155),r=__webpack_require__.n(_),t=__webpack_require__(7438),o="empty-state__b1___Eci4c",i="empty-state__b2___sz949",a="empty-state__button___CLusJ",c="empty-state__description___RRtqQ",s="empty-state__error____Qvjg",u="empty-state__heading___fFflJ",p=__webpack_require__(4429);const empty_state=n=>{let{title:d="No Data Found",description:f,btnLink:l="/",btnTitle:b="RETURN TO HOMEPAGE",iconSrc:m}=n;const[w,k]=(0,_.useState)(!0);return(0,_.useEffect)((()=>{k((0,p.SM)())}),[]),r().createElement("div",{className:`${s} fontBody`},m&&r().createElement("img",{src:m,alt:""}),r().createElement("h3",{className:`${u} fontHeader`},d),f&&r().createElement("div",{className:`${c} ${w?i:o}`},r().createElement("p",null,f)),r().createElement(t.FDKLink,{to:l,className:`${a} ${e["btn-secondary"]}`},b))}})(),n})()));