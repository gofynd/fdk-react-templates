!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("react-hook-form")):"function"==typeof define&&define.amd?define("firestone",["react","react-hook-form"],r):"object"==typeof exports?exports.firestone=r(require("react"),require("react-hook-form")):e.firestone=r(e.react,e["react-hook-form"])}("undefined"!=typeof self?self:this,((e,r)=>(()=>{"use strict";var t={4429:(e,r,t)=>{t.d(r,{hd:()=>validateEmailField});function validateEmailField(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)}},9155:r=>{r.exports=e},1862:e=>{e.exports=r}},a={};function __webpack_require__(e){var r=a[e];if(void 0!==r)return r.exports;var o=a[e]={exports:{}};return t[e](o,o.exports,__webpack_require__),o.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{__webpack_require__.r(o),__webpack_require__.d(o,{default:()=>_});var e=__webpack_require__(9155),r=__webpack_require__.n(e),t=__webpack_require__(1862),a=__webpack_require__(4429);function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var a in t)({}).hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},_extends.apply(null,arguments)}const _=function ForgetPassword(o){let{isFormSubmitSuccess:_=!1,error:s=null,onForgotPasswordSubmit:n=(()=>{}),onBackToLoginClick:i=(()=>{}),onResendEmailClick:l=(()=>{})}=o;const c=(0,e.useId)(),{register:u,handleSubmit:d,formState:{errors:p,isValid:m},getValues:f,setError:b,clearErrors:g}=(0,t.useForm)();return(0,e.useEffect)((()=>{s?b("root",s):g("root")}),[s]),r().createElement("div",null,r().createElement("h1",{className:"forget-password__forgotPasswordTitle___v04xK"},"Reset Your Password"),_?r().createElement("div",{className:"forget-password__submitWrapper___bFvXY"},r().createElement("p",{className:"forget-password__submitSuccessMsg___FlXuF"},"Reset Link has been sent to your primary email address."),r().createElement("button",{className:"forget-password__resendBtn___jBnfg",onClick:()=>l(f())},"RESEND EMAIL")):r().createElement("div",{className:"forget-password__forgotPasswordWrapper___dytr2"},r().createElement("form",{onSubmit:d(n)},r().createElement("div",{className:"forget-password__forgotPasswordInputGroup___XQ61I"},r().createElement("label",{className:"forget-password__loginInputTitle___Eb4Cu",htmlFor:c},"Email"),r().createElement("input",_extends({id:c,type:"text"},u("email",{validate:e=>(0,a.hd)(e)||"Please enter valid email address"}))),p.email&&r().createElement("p",{className:"forget-password__emailErrorMessage___vW0zC"},p.email.message)),p.root&&r().createElement("div",{className:"forget-password__forgotPasswordAlert___tAU9Y"},r().createElement("span",{className:"forget-password__alertMessage___BlRcj"},p.root.message)),r().createElement("button",{className:"forget-password__forgotPasswordSubmitBtn___TjR_i",disabled:!m,type:"submit"},"RESET PASSWORD")),r().createElement("button",{className:"forget-password__loginLink___nbPYK",onClick:i},"Back to login")))}})(),o})()));