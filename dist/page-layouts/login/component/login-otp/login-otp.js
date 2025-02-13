!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("google-libphonenumber"),require("react"),require("react-hook-form"),require("react-international-phone")):"function"==typeof define&&define.amd?define("firestone",["google-libphonenumber","react","react-hook-form","react-international-phone"],t):"object"==typeof exports?exports.firestone=t(require("google-libphonenumber"),require("react"),require("react-hook-form"),require("react-international-phone")):e.firestone=t(e["google-libphonenumber"],e.react,e["react-hook-form"],e["react-international-phone"])}("undefined"!=typeof self?self:this,((e,t,o,r)=>(()=>{"use strict";var n={4129:(e,t,o)=>{o.d(t,{default:()=>x});var r=o(9155),n=o.n(r),a=o(3215),l=o(5072),c=o.n(l),d=o(7825),p=o.n(d),s=o(7659),u=o.n(s),m=o(5056),b=o.n(m),h=o(540),_=o.n(h),g=o(1113),f=o.n(g),v=o(8384),y={};y.styleTagTransform=f(),y.setAttributes=b(),y.insert=u().bind(null,"head"),y.domAPI=p(),y.insertStyleElement=_();c()(v.A,y);v.A&&v.A.locals&&v.A.locals;var w=o(618);const x=function MobileNumber(e){let{name:t="",mobile:o="",countryCode:l="91",disable:c=!1,isShowLabel:d=!0,isRequired:p="required",allowDropdown:s=!0,isFocused:u=!1,placeholder:m="",label:b="",error:h,onChange:_,inputClassName:g,containerClassName:f,labelClassName:v,inputContainerClassName:y,inputProps:x,height:k="48px",textColor:E="var(--textBody, #3c3131)",backgroundColor:C="var(--pageBackground, #f8f8f8)"}=e;const S=(0,r.useId)(),I=(0,r.useRef)(null),N=w.PhoneNumberUtil.getInstance(),isPhoneValid=(e,t)=>{try{return N.isValidNumber(N.parseAndKeepRawInput(e,t))}catch(e){return!1}};return(0,r.useEffect)((()=>{u&&document.getElementById(S)?.focus()}),[S,u]),n().createElement("div",{className:`mobile-number__mobileInputWrapper___Na12n ${h?"mobile-number__errorInput___TKkzT":""} ${f||""}`},d&&n().createElement("label",{className:`mobile-number__inputTitle___QKLCn ${v||""}`,htmlFor:S},b||"Mobile "+("optional"===p?" (optional)":" *")),n().createElement(a.PhoneInput,{name:t,defaultCountry:"in",value:`+${l}${o}`,onChange:(e,t)=>{let{country:o}=t;var r,n;_?.({mobile:(r=e,n=o?.dialCode,r?.replace(new RegExp(`^\\+${n}`),"")),countryCode:o?.dialCode,isValidNumber:isPhoneValid(e)})},forceDialCode:!0,ref:I,required:p,style:{"--react-international-phone-height":k,"--react-international-phone-text-color":E,"--react-international-phone-border-radius":"4px","--react-international-phone-border-color":""+(h?"var(--errorText, #b24141)":"var(--dividerStokes, #d4d1d1)"),"--react-international-phone-background-color":C,"--react-international-phone-dropdown-item-background-color":"var(--pageBackground)","--react-international-phone-selected-dropdown-item-background-color":"var(--highlightColor)","--react-international-phone-dropdown-top":`calc(${k} + 4px)`},countrySelectorStyleProps:{buttonContentWrapperStyle:{gap:"4px"},buttonStyle:{padding:"0 8px"},dropdownStyleProps:{style:{zIndex:999}}},disabled:c,className:`mobile-number__mobileInputContainer___deIgv ${y||""}`,inputClassName:`mobile-number__mobileNumberInput___iRnFG ${g||""}`,inputProps:{id:S,...x},placeholder:m,hideDropdown:!s}),h&&n().createElement("span",{className:"mobile-number__errorText___lRww6"},h.message))}},8384:(e,t,o)=>{o.d(t,{A:()=>c});var r=o(1601),n=o.n(r),a=o(6314),l=o.n(a)()(n());l.push([e.id,".react-international-phone-country-selector{position:relative}.react-international-phone-country-selector-button{display:flex;height:var(--react-international-phone-height, 36px);box-sizing:border-box;align-items:center;justify-content:center;padding:0;border:1px solid var(--react-international-phone-country-selector-border-color, var(--react-international-phone-border-color, gainsboro));margin:0;appearance:button;-webkit-appearance:button;background-color:var(--react-international-phone-country-selector-background-color, var(--react-international-phone-background-color, white));cursor:pointer;text-transform:none;user-select:none}.react-international-phone-country-selector-button:hover{background-color:var(--react-international-phone-country-selector-background-color-hover, whitesmoke)}.react-international-phone-country-selector-button--hide-dropdown{cursor:auto}.react-international-phone-country-selector-button--hide-dropdown:hover{background-color:transparent}.react-international-phone-country-selector-button__button-content{display:flex;align-items:center;justify-content:center}.react-international-phone-country-selector-button__flag-emoji{margin:0 4px}.react-international-phone-country-selector-button__flag-emoji--disabled{opacity:.75}.react-international-phone-country-selector-button__dropdown-arrow{border-top:var(--react-international-phone-country-selector-arrow-size, 4px) solid var(--react-international-phone-country-selector-arrow-color, #777);border-right:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;border-left:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;margin-right:4px;transition:all .1s ease-out}.react-international-phone-country-selector-button__dropdown-arrow--active{transform:rotateX(180deg)}.react-international-phone-country-selector-button__dropdown-arrow--disabled{border-top-color:var(--react-international-phone-disabled-country-selector-arrow-color, #999)}.react-international-phone-country-selector-button--disabled{background-color:var(--react-international-phone-disabled-country-selector-background-color, var(--react-international-phone-disabled-background-color, whitesmoke));cursor:auto}.react-international-phone-country-selector-button--disabled:hover{background-color:var(--react-international-phone-disabled-country-selector-background-color, var(--react-international-phone-disabled-background-color, whitesmoke))}.react-international-phone-flag-emoji{width:var(--react-international-phone-flag-width, 24px);height:var(--react-international-phone-flag-height, 24px);box-sizing:border-box}.react-international-phone-country-selector-dropdown{position:absolute;z-index:1;top:var(--react-international-phone-dropdown-top, 44px);left:var(--react-international-phone-dropdown-left, 0);display:flex;width:300px;max-height:200px;flex-direction:column;padding:4px 0;margin:0;background-color:var(--react-international-phone-dropdown-item-background-color, var(--react-international-phone-background-color, white));box-shadow:var(--react-international-phone-dropdown-shadow, 2px 2px 16px rgba(0, 0, 0, .25));color:var(--react-international-phone-dropdown-item-text-color, var(--react-international-phone-text-color, #222));list-style:none;overflow-y:scroll}.react-international-phone-country-selector-dropdown__preferred-list-divider{height:1px;border:none;margin:var(--react-international-phone-dropdown-preferred-list-divider-margin, 0);background:var(--react-international-phone-dropdown-preferred-list-divider-color, var(--react-international-phone-border-color, gainsboro))}.react-international-phone-country-selector-dropdown__list-item{display:flex;min-height:var(--react-international-phone-dropdown-item-height, 28px);box-sizing:border-box;align-items:center;padding:2px 8px}.react-international-phone-country-selector-dropdown__list-item-flag-emoji{margin-right:8px}.react-international-phone-country-selector-dropdown__list-item-country-name{overflow:hidden;margin-right:8px;font-size:var(--react-international-phone-dropdown-item-font-size, 14px);text-overflow:ellipsis;white-space:nowrap}.react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-dropdown-item-dial-code-color, gray);font-size:var(--react-international-phone-dropdown-item-font-size, 14px)}.react-international-phone-country-selector-dropdown__list-item:hover{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke));cursor:pointer}.react-international-phone-country-selector-dropdown__list-item--selected,.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke);color:var(--react-international-phone-selected-dropdown-item-text-color, var(--react-international-phone-text-color, #222))}.react-international-phone-country-selector-dropdown__list-item--selected .react-international-phone-country-selector-dropdown__list-item-dial-code,.react-international-phone-country-selector-dropdown__list-item--focused .react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-selected-dropdown-item-dial-code-color, var(--react-international-phone-dropdown-item-dial-code-color, gray))}.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke))}.react-international-phone-dial-code-preview{display:flex;align-items:center;justify-content:center;padding:0 8px;border:1px solid var(--react-international-phone-dial-code-preview-border-color, var(--react-international-phone-border-color, gainsboro));margin-right:-1px;background-color:var(--react-international-phone-dial-code-preview-background-color, var(--react-international-phone-background-color, white));color:var(--react-international-phone-dial-code-preview-text-color, var(--react-international-phone-text-color, #222));font-size:var(--react-international-phone-dial-code-preview-font-size, var(--react-international-phone-font-size, 13px))}.react-international-phone-dial-code-preview--disabled{background-color:var(--react-international-phone-dial-code-preview-disabled-background-color, var(--react-international-phone-disabled-background-color, whitesmoke));color:var(--react-international-phone-dial-code-preview-disabled-text-color, var(--react-international-phone-disabled-text-color, #666))}.react-international-phone-input-container{display:flex}.react-international-phone-input-container .react-international-phone-country-selector-button{border-radius:var(--react-international-phone-border-radius, 4px);margin-right:-1px;border-bottom-right-radius:0;border-top-right-radius:0}.react-international-phone-input-container .react-international-phone-input{overflow:visible;height:var(--react-international-phone-height, 36px);box-sizing:border-box;padding:0 8px;border:1px solid var(--react-international-phone-border-color, gainsboro);border-radius:var(--react-international-phone-border-radius, 4px);margin:0;background-color:var(--react-international-phone-background-color, white);border-bottom-left-radius:0;border-top-left-radius:0;color:var(--react-international-phone-text-color, #222);font-family:inherit;font-size:var(--react-international-phone-font-size, 13px)}.react-international-phone-input-container .react-international-phone-input:focus{outline:none}.react-international-phone-input-container .react-international-phone-input--disabled{background-color:var(--react-international-phone-disabled-background-color, whitesmoke);color:var(--react-international-phone-disabled-text-color, #666)}\n",""]);const c=l},6314:e=>{e.exports=function(e){var t=[];return t.toString=function toString(){return this.map((function(t){var o="",r=void 0!==t[5];return t[4]&&(o+="@supports (".concat(t[4],") {")),t[2]&&(o+="@media ".concat(t[2]," {")),r&&(o+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),o+=e(t),r&&(o+="}"),t[2]&&(o+="}"),t[4]&&(o+="}"),o})).join("")},t.i=function i(e,o,r,n,a){"string"==typeof e&&(e=[[null,e,void 0]]);var l={};if(r)for(var c=0;c<this.length;c++){var d=this[c][0];null!=d&&(l[d]=!0)}for(var p=0;p<e.length;p++){var s=[].concat(e[p]);r&&l[s[0]]||(void 0!==a&&(void 0===s[5]||(s[1]="@layer".concat(s[5].length>0?" ".concat(s[5]):""," {").concat(s[1],"}")),s[5]=a),o&&(s[2]?(s[1]="@media ".concat(s[2]," {").concat(s[1],"}"),s[2]=o):s[2]=o),n&&(s[4]?(s[1]="@supports (".concat(s[4],") {").concat(s[1],"}"),s[4]=n):s[4]="".concat(n)),t.push(s))}},t}},1601:e=>{e.exports=function(e){return e[1]}},5072:e=>{var t=[];function getIndexByIdentifier(e){for(var o=-1,r=0;r<t.length;r++)if(t[r].identifier===e){o=r;break}return o}function modulesToDom(e,o){for(var r={},n=[],a=0;a<e.length;a++){var l=e[a],c=o.base?l[0]+o.base:l[0],d=r[c]||0,p="".concat(c," ").concat(d);r[c]=d+1;var s=getIndexByIdentifier(p),u={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==s)t[s].references++,t[s].updater(u);else{var m=addElementStyle(u,o);o.byIndex=a,t.splice(a,0,{identifier:p,updater:m,references:1})}n.push(p)}return n}function addElementStyle(e,t){var o=t.domAPI(t);o.update(e);return function updater(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;o.update(e=t)}else o.remove()}}e.exports=function(e,o){var r=modulesToDom(e=e||[],o=o||{});return function update(e){e=e||[];for(var n=0;n<r.length;n++){var a=getIndexByIdentifier(r[n]);t[a].references--}for(var l=modulesToDom(e,o),c=0;c<r.length;c++){var d=getIndexByIdentifier(r[c]);0===t[d].references&&(t[d].updater(),t.splice(d,1))}r=l}}},7659:e=>{var t={};e.exports=function insertBySelector(e,o){var r=function getTarget(e){if(void 0===t[e]){var o=document.querySelector(e);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(e){o=null}t[e]=o}return t[e]}(e);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(o)}},540:e=>{e.exports=function insertStyleElement(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},5056:(e,t,o)=>{e.exports=function setAttributesWithoutAttributes(e){var t=o.nc;t&&e.setAttribute("nonce",t)}},7825:e=>{e.exports=function domAPI(e){if("undefined"==typeof document)return{update:function update(){},remove:function remove(){}};var t=e.insertStyleElement(e);return{update:function update(o){!function apply(e,t,o){var r="";o.supports&&(r+="@supports (".concat(o.supports,") {")),o.media&&(r+="@media ".concat(o.media," {"));var n=void 0!==o.layer;n&&(r+="@layer".concat(o.layer.length>0?" ".concat(o.layer):""," {")),r+=o.css,n&&(r+="}"),o.media&&(r+="}"),o.supports&&(r+="}");var a=o.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(r,e,t.options)}(t,e,o)},remove:function remove(){!function removeStyleElement(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},1113:e=>{e.exports=function styleTagTransform(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},618:t=>{t.exports=e},9155:e=>{e.exports=t},1862:e=>{e.exports=o},3215:e=>{e.exports=r}},a={};function __webpack_require__(e){var t=a[e];if(void 0!==t)return t.exports;var o=a[e]={id:e,exports:{}};return n[e](o,o.exports,__webpack_require__),o.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var o in t)__webpack_require__.o(t,o)&&!__webpack_require__.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.nc=void 0;var l={};return(()=>{__webpack_require__.r(l),__webpack_require__.d(l,{default:()=>m});var e=__webpack_require__(9155),t=__webpack_require__.n(e),o=__webpack_require__(1862),r="login-otp__alertError___FvgBm",n="login-otp__loginInputGroup____7Nbd",a="login-otp__loginInputTitle___oQ_Yc",c="login-otp__otpInput___XqbBx",d="login-otp__otpSentMsg___fJ8Ee",p="login-otp__resendOtpBtn___dLIn7",s="login-otp__verifyOtpBtn___UCOSR",u=__webpack_require__(4129);function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var r in o)({}).hasOwnProperty.call(o,r)&&(e[r]=o[r])}return e},_extends.apply(null,arguments)}const m=function LoginOtp(e){let{mobileInfo:r={countryCode:"91",mobile:"",isValidNumber:!1},submittedMobile:n="",otpResendTime:a=0,otpError:l=null,isFormSubmitSuccess:c=!1,onLoginFormSubmit:d=(()=>{}),onOtpSubmit:p=(()=>{}),onResendOtpClick:s=(()=>{})}=e;const{handleSubmit:m,control:b,getValues:h,formState:{isValid:_}}=(0,o.useForm)({mode:"onChange",defaultValues:{phone:r}});return t().createElement("div",{className:"login-otp__loginOtpWrapper___IDiOX"},c?t().createElement(OtpForm,{submittedMobile:n,mobileInfo:h(),otpResendTime:a,error:l,onOtpSubmit:p,onResendOtpClick:s}):t().createElement("form",{onSubmit:m(d)},t().createElement(o.Controller,{name:"phone",control:b,rules:{validate:e=>!(e?.mobile&&!e.isValidNumber)||"Please enter valid phone number"},render:e=>{let{field:o,fieldState:{error:r}}=e;return t().createElement(u.default,{mobile:o.value.mobile,countryCode:o.value.countryCode,error:r,onChange:e=>{o.onChange(e)}})}}),t().createElement("button",{className:"login-otp__sendOtpBtn___m6A1L",type:"submit",disabled:!_},"GET OTP")))};function OtpForm(l){let{submittedMobile:u="",mobileInfo:m={},otpResendTime:b,error:h,onOtpSubmit:_=(()=>{}),onResendOtpClick:g=(()=>{})}=l;const f=(0,e.useId)(),{handleSubmit:v,register:y,formState:{errors:w},setError:x,watch:k,clearErrors:E}=(0,o.useForm)(),C=k("mobileOtp"),S=b>0;return(0,e.useEffect)((()=>{const e=document?.getElementById?.(f);e&&e?.focus()}),[]),(0,e.useEffect)((()=>{C&&C.length<4&&E("root")}),[C]),(0,e.useEffect)((()=>{h?x("root",h):E("root")}),[h]),t().createElement(t().Fragment,null,t().createElement("form",{className:n,onSubmit:v(_)},t().createElement("p",{className:d},`OTP sent to ${u}`),t().createElement("label",{className:a,htmlFor:f},"Enter OTP"),t().createElement("input",_extends({id:f,type:"text",inputMode:"numeric",pattern:"\\d*",maxLength:4,onInput:e=>{e.target.value=e.target.value.replace(/[^0-9]/g,"").slice(0,4)},className:c},y("mobileOtp",{required:!0,maxLength:4}))),w.root&&t().createElement("div",{className:r},t().createElement("span",null,w.root.message)),t().createElement("button",{className:s,type:"submit"},"Continue")),t().createElement("button",{className:p,onClick:()=>g(m),disabled:S},"Resend OTP"+(S?` (${b}S)`:"")))}})(),l})()));