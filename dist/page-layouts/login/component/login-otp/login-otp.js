!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("react-hook-form")):"function"==typeof define&&define.amd?define("firestone",["react","react-hook-form"],t):"object"==typeof exports?exports.firestone=t(require("react"),require("react-hook-form")):e.firestone=t(e.react,e["react-hook-form"])}("undefined"!=typeof self?self:this,((e,t)=>(()=>{"use strict";var r={4429:(e,t,r)=>{r.d(t,{FY:()=>validatePhone});function validatePhone(e){return e&&e.length&&/^[0-9]{10}$/.test(e.trim())}},7322:(e,t,r)=>{r.d(t,{default:()=>a});var o=r(9155),n=r.n(o),l=r(4429);const a=function MobileNumber(e){let{mobile:t="",countryCode:r="91",disable:a=!1,isShowLabel:_=!0,isRequired:i="required",allowDropdown:u=!0,isFocused:s=!1,placeholder:m="",label:c="",error:p,onChange:b,inputClassName:d,containerClassName:f,labelClassName:g,telInputClassName:E}=e;const v=(0,o.useId)(),O=(0,o.useRef)(null),[h,y]=(0,o.useState)("");return(0,o.useEffect)((()=>{s&&O.current.focus()}),[]),(0,o.useEffect)((()=>{(r||t)&&y(t)}),[r,t]),n().createElement("div",{className:`mobile-number__mobileInputWrapper___Na12n ${p?"mobile-number__errorInput___TKkzT":""} ${f||""}`},_&&n().createElement("label",{className:`mobile-number__inputTitle___QKLCn ${g||""}`,htmlFor:v},c||"Mobile "+("optional"===i?" (optional)":" *")),n().createElement("div",{className:`mobile-number__telInput___odn3B ${E||""}`},n().createElement("span",{className:"mobile-number__dialCode___MycVe"},`+${r}`),n().createElement("input",{ref:O,type:"tel",id:v,value:h,autoComplete:"tel",disabled:a,placeholder:m||"81234 56789",onChange:e=>{const t=e?.target?.value.replace(/\D/g,"")||"";y(t),b({mobile:t,countryCode:"91",isValidNumber:(0,l.FY)(t)})},className:`mobile-number__mobileNumberInput___iRnFG ${d||""}`})),p&&n().createElement("span",{className:"mobile-number__errorText___lRww6"},p.message))}},9155:t=>{t.exports=e},1862:e=>{e.exports=t}},o={};function __webpack_require__(e){var t=o[e];if(void 0!==t)return t.exports;var n=o[e]={exports:{}};return r[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{__webpack_require__.r(n),__webpack_require__.d(n,{default:()=>c});var e=__webpack_require__(9155),t=__webpack_require__.n(e),r=__webpack_require__(1862),o="login-otp__alertError___FvgBm",l="login-otp__loginInputGroup____7Nbd",a="login-otp__loginInputTitle___oQ_Yc",_="login-otp__otpInput___XqbBx",i="login-otp__otpSentMsg___fJ8Ee",u="login-otp__resendOtpBtn___dLIn7",s="login-otp__verifyOtpBtn___UCOSR",m=__webpack_require__(7322);function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)({}).hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},_extends.apply(null,arguments)}const c=function LoginOtp(e){let{mobileInfo:o={countryCode:"91",mobile:"",isValidNumber:!1},submittedMobile:n="",otpResendTime:l=0,otpError:a=null,isFormSubmitSuccess:_=!1,onLoginFormSubmit:i=(()=>{}),onOtpSubmit:u=(()=>{}),onResendOtpClick:s=(()=>{})}=e;const{handleSubmit:c,control:p,getValues:b,formState:{isValid:d}}=(0,r.useForm)({mode:"onChange",defaultValues:{phone:o}});return t().createElement("div",{className:"login-otp__loginOtpWrapper___IDiOX"},_?t().createElement(OtpForm,{submittedMobile:n,mobileInfo:b(),otpResendTime:l,error:a,onOtpSubmit:u,onResendOtpClick:s}):t().createElement("form",{onSubmit:c(i)},t().createElement(r.Controller,{name:"phone",control:p,rules:{validate:e=>e.isValidNumber||"Please enter valid phone number"},render:e=>{let{field:r,fieldState:{error:o}}=e;return t().createElement(m.default,{mobile:r.value.mobile,countryCode:r.value.countryCode,error:o,onChange:e=>{r.onChange(e)}})}}),t().createElement("button",{className:"login-otp__sendOtpBtn___m6A1L",type:"submit",disabled:!d},"GET OTP")))};function OtpForm(n){let{submittedMobile:m="",mobileInfo:c={},otpResendTime:p,error:b,onOtpSubmit:d=(()=>{}),onResendOtpClick:f=(()=>{})}=n;const g=(0,e.useId)(),{handleSubmit:E,register:v,formState:{errors:O},setError:h,clearErrors:y}=(0,r.useForm)(),N=p>0;return(0,e.useEffect)((()=>{b?h("root",b):y("root")}),[b]),t().createElement(t().Fragment,null,t().createElement("form",{className:l,onSubmit:E(d)},t().createElement("p",{className:i},`OTP sent to ${m}`),t().createElement("label",{className:a,htmlFor:g},"Enter OTP"),t().createElement("input",_extends({id:g,type:"number",className:_},v("mobileOtp",{required:!0,maxLength:4}))),O.root&&t().createElement("div",{className:o},t().createElement("span",null,O.root.message)),t().createElement("button",{className:s,type:"submit"},"Continue")),t().createElement("button",{className:u,onClick:()=>f(c),disabled:N},"Resend OTP"+(N?` (${p}S)`:"")))}})(),n})()));