!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("react-router-dom")):"function"==typeof define&&define.amd?define("firestone",["react","react-router-dom"],r):"object"==typeof exports?exports.firestone=r(require("react"),require("react-router-dom")):e.firestone=r(e.react,e["react-router-dom"])}("undefined"!=typeof self?self:this,((e,r)=>(()=>{"use strict";var t={700:(e,r,t)=>{t.d(r,{default:()=>f});var _={};t.r(_),t.d(_,{w5:()=>c,Jc:()=>i,zH:()=>d,z3:()=>s,q1:()=>l,T4:()=>u,_8:()=>m,oP:()=>p,E1:()=>g,rg:()=>k,RK:()=>b});var a=t(9155),o=t.n(a),n=t(4442),c="order-tracking__commonBtn___Vnni3",i="order-tracking__demoImg___ATvyI",d="order-tracking__details___cghA9",s="order-tracking__error___poQev",l="order-tracking__orderId___rs4Ee",u="order-tracking__orderTitle___IljZo",m="order-tracking__regularxxs___GFnQM",p="order-tracking__trackBtn___uuLMR",g="order-tracking__trackOrder___AYAQT",k="order-tracking__trackOrderCntr___ikuJz",b="order-tracking__visible___m11CP";const f=function OrderTracking(e){let{instMob:r}=e;const[t,f]=(0,a.useState)(!1),[v,y]=(0,a.useState)("/public/assets/pngs/inst_mob.png"),[q,E]=(0,a.useState)(""),[w,x]=(0,a.useState)(!1),$=(0,n.useNavigate)();return o().createElement("div",{className:"basePageContainer margin0auto"},o().createElement("div",{className:`${k}`},o().createElement("div",{className:`${g}`},o().createElement("div",{className:`${u}`},"Where is my order?"),o().createElement("div",{className:`${s} ${m} ${w?b:""} `},"Invalid Order Id"),o().createElement("div",{className:`${l}`},o().createElement("input",{type:"text",className:`${_.commonInput}`,value:q,placeholder:"Enter Order ID",maxlength:"20",onChange:e=>E(e.target.value)})),o().createElement("div",{className:`${p}`},o().createElement("button",{type:"button",className:`${c}`,onClick:()=>{q.length<=10?x(!0):$(`/order-tracking/${q}`)}},"TRACK ORDER")),o().createElement("div",{className:`${d} ${m}`,onClick:()=>f(!t)},"Where is Order Id?"),t&&o().createElement("div",null,o().createElement("img",{src:r,alt:v,className:`${i}`})))))}},9155:r=>{r.exports=e},4442:e=>{e.exports=r}},_={};function __webpack_require__(e){var r=_[e];if(void 0!==r)return r.exports;var a=_[e]={exports:{}};return t[e](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{__webpack_require__.r(a),__webpack_require__.d(a,{default:()=>e});const e=__webpack_require__(700).default})(),a})()));