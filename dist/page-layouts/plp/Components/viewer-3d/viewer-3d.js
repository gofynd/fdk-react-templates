!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],r):"object"==typeof exports?exports.firestone=r(require("react")):e.firestone=r(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var r,_,t={4569:(e,r,_)=>{_.d(r,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var t=_(9155),a=_.n(t),i=_(108);const __WEBPACK_DEFAULT_EXPORT__=e=>{let{containerClassName:r,loaderClassName:_,...t}=e;const n=`${i.K4} ${r??""}`,o=`${i.wG} ${_??""}`;return a().createElement("div",{className:n},a().createElement("div",{className:o}))}},4429:(e,r,_)=>{_.d(r,{Wx:()=>isRunningOnClient});function isRunningOnClient(){return"undefined"!=typeof window&&globalThis===window}},108:(e,r,_)=>{_.d(r,{K4:()=>a,wG:()=>t});var t="loader__loader___ytdT3",a="loader__page-loader-container___jJHee"},9155:r=>{r.exports=e}},a={};function __webpack_require__(e){var r=a[e];if(void 0!==r)return r.exports;var _=a[e]={exports:{}};return t[e](_,_.exports,__webpack_require__),_.exports}__webpack_require__.m=t,__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var _ in r)__webpack_require__.o(r,_)&&!__webpack_require__.o(e,_)&&Object.defineProperty(e,_,{enumerable:!0,get:r[_]})},__webpack_require__.f={},__webpack_require__.e=e=>Promise.all(Object.keys(__webpack_require__.f).reduce(((r,_)=>(__webpack_require__.f[_](e,r),r)),[])),__webpack_require__.u=e=>e+".js",__webpack_require__.miniCssF=e=>{},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),r={},_="firestone:",__webpack_require__.l=(e,t,a,i)=>{if(r[e])r[e].push(t);else{var n,o;if(void 0!==a)for(var u=document.getElementsByTagName("script"),c=0;c<u.length;c++){var p=u[c];if(p.getAttribute("src")==e||p.getAttribute("data-webpack")==_+a){n=p;break}}n||(o=!0,(n=document.createElement("script")).charset="utf-8",n.timeout=120,__webpack_require__.nc&&n.setAttribute("nonce",__webpack_require__.nc),n.setAttribute("data-webpack",_+a),n.src=e),r[e]=[t];var onScriptComplete=(_,t)=>{n.onerror=n.onload=null,clearTimeout(l);var a=r[e];if(delete r[e],n.parentNode&&n.parentNode.removeChild(n),a&&a.forEach((e=>e(t))),_)return _(t)},l=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:n}),12e4);n.onerror=onScriptComplete.bind(null,n.onerror),n.onload=onScriptComplete.bind(null,n.onload),o&&document.head.appendChild(n)}},__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.p="./",(()=>{var e={6646:0,9727:0};__webpack_require__.f.j=(r,_)=>{var t=__webpack_require__.o(e,r)?e[r]:void 0;if(0!==t)if(t)_.push(t[2]);else{var a=new Promise(((_,a)=>t=e[r]=[_,a]));_.push(t[2]=a);var i=__webpack_require__.p+__webpack_require__.u(r),n=new Error;__webpack_require__.l(i,(_=>{if(__webpack_require__.o(e,r)&&(0!==(t=e[r])&&(e[r]=void 0),t)){var a=_&&("load"===_.type?"missing":_.type),i=_&&_.target&&_.target.src;n.message="Loading chunk "+r+" failed.\n("+a+": "+i+")",n.name="ChunkLoadError",n.type=a,n.request=i,t[1](n)}}),"chunk-"+r,r)}};var webpackJsonpCallback=(r,_)=>{var t,a,[i,n,o]=_,u=0;if(i.some((r=>0!==e[r]))){for(t in n)__webpack_require__.o(n,t)&&(__webpack_require__.m[t]=n[t]);if(o)o(__webpack_require__)}for(r&&r(_);u<i.length;u++)a=i[u],__webpack_require__.o(e,a)&&e[a]&&e[a][0](),e[a]=0},r=Object("undefined"!=typeof self?self:this).webpackChunkfirestone=Object("undefined"!=typeof self?self:this).webpackChunkfirestone||[];r.forEach(webpackJsonpCallback.bind(null,0)),r.push=webpackJsonpCallback.bind(null,r.push.bind(r))})();var i={};return(()=>{__webpack_require__.r(i),__webpack_require__.d(i,{default:()=>n});var e=__webpack_require__(9155),r=__webpack_require__.n(e),_=__webpack_require__(4569),t=__webpack_require__(4429);let a;const n=function Viewer3D(i){let{src:n,prompt:o,autoRotate:u,children:c}=i;const[p,l]=(0,e.useState)(!1);return(0,e.useEffect)((()=>{t.Wx&&(a||(a=__webpack_require__.e(6021).then(__webpack_require__.bind(__webpack_require__,6021))),a).catch(console.error).finally((()=>{l(!0)})).catch(console.error)}),[]),p?r().createElement("model-viewer",{src:n,"camera-controls":!0,"auto-rotate":!0,"disable-pan":!0,className:"viewer-3d__viewer3d___c8cT8"}):r().createElement(_.default,null)}})(),i})()));