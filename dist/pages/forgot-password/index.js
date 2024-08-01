!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("react-hook-form")):"function"==typeof define&&define.amd?define("firestone",["react","react-hook-form"],r):"object"==typeof exports?exports.firestone=r(require("react"),require("react-hook-form")):e.firestone=r(e.react,e["react-hook-form"])}("undefined"!=typeof self?self:this,((e,r)=>(()=>{"use strict";var t={4429:(e,r,t)=>{t.d(r,{hd:()=>validateEmailField});function validateEmailField(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)}},8810:(e,r,t)=>{t.d(r,{default:()=>n});var o=t(9155),a=t.n(o),s=t(1862),_=t(4429);function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)({}).hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},_extends.apply(null,arguments)}const n=function ForgetPassword(e){let{isFormSubmitSuccess:r=!1,error:t=null,onForgotPasswordSubmit:n=(()=>{}),onBackToLoginClick:i=(()=>{}),onResendEmailClick:l=(()=>{})}=e;const c=(0,o.useId)(),{register:d,handleSubmit:u,formState:{errors:m,isValid:p},getValues:f,setError:b,clearErrors:g}=(0,s.useForm)();return(0,o.useEffect)((()=>{t?b("root",t):g("root")}),[t]),a().createElement("div",null,a().createElement("h1",{className:"forget-password__forgotPasswordTitle___v04xK"},"Reset Your Password"),r?a().createElement("div",{className:"forget-password__submitWrapper___bFvXY"},a().createElement("p",{className:"forget-password__submitSuccessMsg___FlXuF"},"Reset Link has been sent to your primary email address."),a().createElement("button",{className:"forget-password__resendBtn___jBnfg",onClick:()=>l(f())},"RESEND EMAIL")):a().createElement("div",{className:"forget-password__forgotPasswordWrapper___dytr2"},a().createElement("form",{onSubmit:u(n)},a().createElement("div",{className:"forget-password__forgotPasswordInputGroup___XQ61I"},a().createElement("label",{className:"forget-password__loginInputTitle___Eb4Cu",htmlFor:c},"Email"),a().createElement("input",_extends({id:c,type:"text"},d("email",{validate:e=>(0,_.hd)(e)||"Please enter valid email address"}))),m.email&&a().createElement("p",{className:"forget-password__emailErrorMessage___vW0zC"},m.email.message)),m.root&&a().createElement("div",{className:"forget-password__forgotPasswordAlert___tAU9Y"},a().createElement("span",{className:"forget-password__alertMessage___BlRcj"},m.root.message)),a().createElement("button",{className:"forget-password__forgotPasswordSubmitBtn___TjR_i",disabled:!p,type:"submit"},"RESET PASSWORD")),a().createElement("button",{className:"forget-password__loginLink___nbPYK",onClick:i},"Back to login")))}},9155:r=>{r.exports=e},1862:e=>{e.exports=r}},o={};function __webpack_require__(e){var r=o[e];if(void 0!==r)return r.exports;var a=o[e]={exports:{}};return t[e](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{__webpack_require__.r(a),__webpack_require__.d(a,{default:()=>e});const e=__webpack_require__(8810).default})(),a})()));