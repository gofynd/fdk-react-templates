!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],t):"object"==typeof exports?exports.firestone=t(require("react")):e.firestone=t(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{var t={4559:(e,t,r)=>{"use strict";r.d(t,{default:()=>s});var i=r(9155),n=r.n(i),a=r(5556),o=r.n(a);const ImageSkeleton=e=>{let{aspectRatio:t=1,mobileAspectRatio:r=1,width:i=100}=e;const a=Math.floor(i/t),o=Math.floor(i/(r||t));return n().createElement("div",{className:"skeletons__card___njYyO"},n().createElement("canvas",{width:i,height:a}),n().createElement("canvas",{className:"skeletons__mobileCanvas___oe21d",width:i,height:o}))};ImageSkeleton.propTypes={aspectRatio:o().number,mobileAspectRatio:o().number,width:o().number};const s=ImageSkeleton},4429:(e,t,r)=>{"use strict";r.d(t,{ay:()=>transformImage});function isRunningOnClient(){return"undefined"!=typeof window&&globalThis===window}const transformImage=(e,t,r)=>{Math.min(Math.max(Math.round(isRunningOnClient()&&window.devicePixelRatio||1),1),5);let i=e;if(t&&r){const n=`/${t}/`;i=e.replace(new RegExp(n),`/resize-w:${r}/`)}try{const e=new URL(i);return e.searchParams.append("dpr",1),e.toString()}catch(e){return i}}},2694:(e,t,r)=>{"use strict";var i=r(6925);function emptyFunction(){}function emptyFunctionWithReset(){}emptyFunctionWithReset.resetWarningCache=emptyFunction,e.exports=function(){function shim(e,t,r,n,a,o){if(o!==i){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function getShim(){return shim}shim.isRequired=shim;var e={array:shim,bigint:shim,bool:shim,func:shim,number:shim,object:shim,string:shim,symbol:shim,any:shim,arrayOf:getShim,element:shim,elementType:shim,instanceOf:getShim,node:shim,objectOf:getShim,oneOf:getShim,oneOfType:getShim,shape:getShim,exact:getShim,checkPropTypes:emptyFunctionWithReset,resetWarningCache:emptyFunction};return e.PropTypes=e,e}},5556:(e,t,r)=>{e.exports=r(2694)()},6925:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},9155:t=>{"use strict";t.exports=e}},r={};function __webpack_require__(e){var i=r[e];if(void 0!==i)return i.exports;var n=r[e]={exports:{}};return t[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{"use strict";__webpack_require__.r(i),__webpack_require__.d(i,{default:()=>s});var e=__webpack_require__(9155),t=__webpack_require__.n(e),r="fy-image__fyImg___yIv86",n=__webpack_require__(4559),a=__webpack_require__(4429);const o=["original","30x0","44x0","66x0","50x0","75x0","60x60","90x90","100x0","130x200","135x0","270x0","360x0","500x0","400x0","540x0","720x0","312x480","resize-(w|h)?:[0-9]+(,)?(w|h)*(:)?[0-9]*"];function searchStringInArray(e,t){for(let r=0;r<t.length;r++)if(e?.match(new RegExp(`/${t[r]}/`)))return t[r];return""}const FyImage=i=>{let{backgroundColor:s="#ffffff",src:c="",placeholder:_="",alt:p="",isImageFill:l=!1,isFixedAspectRatio:u=!0,aspectRatio:m=1,mobileAspectRatio:d,showSkeleton:f=!1,showOverlay:h=!1,overlayColor:y="#ffffff",sources:b=[{breakpoint:{min:780},width:1280},{breakpoint:{min:600},width:1100},{breakpoint:{min:480},width:1200},{breakpoint:{min:361},width:900},{breakpoint:{max:360},width:640}],isLazyLoaded:g=!0,blurWidth:w=50,customClass:x,globalConfig:k,defer:v=!0}=i;const[S,R]=(0,e.useState)(!1),[O,q]=(0,e.useState)(!0),[E,$]=(0,e.useState)(!1),T=(0,e.useRef)(null);(0,e.useEffect)((()=>{const e=new IntersectionObserver((e=>{e?.[0]?.isIntersecting&&$(!0)}));return g&&e.observe(T.current),()=>{e.disconnect()}}),[g]);const I={"--aspect-ratio-desktop":`${m}`,"--aspect-ratio-mobile":`${d||m}`,"--bg-color":`${k?.img_container_bg||s}`},P={"--overlay-bgcolor":y},j=(0,e.useMemo)((()=>!c.match(/\.(svg|gif)$/i)),[c]),getMedia=e=>{if(e.breakpoint){const t=e.breakpoint.min&&`(min-width: ${e.breakpoint.min}px)`||"",r=e.breakpoint.max&&`(max-width: ${e.breakpoint.max}px)`||"";return t&&r?`${t} and ${r}`:t||r}return""},getUrl=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c;S&&(t=_);const r=searchStringInArray(t,o);return r?(0,a.ay)(t,r,e):(0,a.ay)(t,void 0,void 0)};return t().createElement("div",{className:`fy-image__imageWrapper___wKmP2 ${l?"fy-image__fill___rFWVY":""}\n      ${u?"fy-image__fixedAspRatio___fyXGS":""} ${x}`,style:I,ref:T},h&&t().createElement("div",{className:"fy-image__overlay___Dx1Ju",style:P}),t().createElement("picture",null,(b?.map((e=>(e.media=getMedia(e),e.srcset=getUrl(e.blurWidth??w,e.url),e)))).map((e=>(e.srcset=getUrl(e.width,e.url),e))).map(((e,r)=>t().createElement("source",{key:r,media:e.media,srcSet:e.srcset,type:"image/webp"}))),t().createElement("img",{className:r,style:{display:f&&O?"none":"block"},srcSet:(()=>{let e=c;if(g&&!E||!j)return"";S&&(e=_);const t=searchStringInArray(e,o);return b.map((r=>{let i=e;return t&&(i=(0,a.ay)(e,t,r.width)),`${i} ${r.width}w`})).join(", ")})(),src:(()=>{if(!j)return c;const e=searchStringInArray(c,o);return g&&!E?(0,a.ay)(c,e,w):S?_:(0,a.ay)(c,void 0,void 0)})(),alt:p,onError:()=>{g&&!E||(R(!0),q(!1))},onLoad:e=>{q(!1)},loading:v?"lazy":"eager",fetchpriority:v?"low":"high"}),f&&O&&t().createElement(n.default,{className:r,aspectRatio:m,mobileAspectRatio:d||m})))};FyImage.propTypes={};const s=FyImage})(),i})()));