!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):"function"==typeof define&&define.amd?define("firestone",["fdk-core/utils","react","react-hook-form","react-router-dom"],t):"object"==typeof exports?exports.firestone=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):e.firestone=t(e["fdk-core/utils"],e.react,e["react-hook-form"],e["react-router-dom"])}("undefined"!=typeof self?self:this,((e,t,n,r)=>(()=>{"use strict";var o={9931:(e,t,n)=>{n.d(t,{o:()=>useAccounts});var r=n(9155),o=n(447),a=n(4442),i=n(4429),s=n(1962);const useAccounts=e=>{let{fpi:t}=e;const n=(0,a.useNavigate)(),l=(0,a.useLocation)(),[c,d]=(0,r.useState)(null),u=(0,o.useGlobalStore)(t.getters.USER_DATA),p=(0,o.useGlobalStore)(t.getters.PLATFORM_DATA),_=(0,o.useGlobalStore)(t.getters.LOGGED_IN),m=(0,r.useMemo)((()=>c?.is_signed_in?`Continue as ${c.profile.full_name}`:"Login with Facebook"),[c]),facebookLogin=async()=>{};return{userData:u,platformData:p,isLoggedIn:_,openLogin:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",encodeURIComponent(l.pathname+l.search)),n({pathname:"/auth/login",search:t.toString()})},openRegister:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",l.pathname),n({pathname:"/auth/register",search:t.toString()})},openForgotPassword:()=>{n({pathname:"/auth/forgot-password",search:l.search})},openHomePage:()=>{const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)},updateProfile:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:o,lastName:a,gender:l,email:c,phone:{countryCode:d,mobile:u}}=e,p=[["$platform",`${n}`],["$editProfileRequestInput",`${`{\n\t\t\tcountry_code: "${d}",\n    \tfirst_name: "${o}",\n\t\t\tlast_name: "${a}",\n\t\t\tgender: "${l}",\n\t\t\tregister_token: "${r}",\n\t\t\t${c?`email: "${c}",`:""}\n\t\t\t${u&&d?`mobile: {\n\t\t\t\tcountry_code: "${d}",\n\t\t\t\tphone: "${u}"\n\t\t\t}`:""}\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.ab,p),null)},signOut:()=>t.executeGraphQL((0,i.Ll)(s.T_),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(e?.user?.logout?.logout){const t=new URLSearchParams(l.search).get("redirectUrl")||"";return window.location.href=window.location.origin+decodeURIComponent(t),e}return Promise.reject()})),signIn:e=>{const{isRedirection:n,password:r,username:o}=e,a=[["$username",`${o}`],["$password",`${r}`]];return t.executeGraphQL((0,i.Ll)(s.oW,a),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(n){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendOtp:e=>{let{mobile:n,countryCode:r}=e;const o=[["$platform",`${window.APP_DATA.applicationID}`],["$sendOtpRequestInput",`${`{\n\t\t\tmobile: "${n}"\n\t\t\tcountry_code: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.xc,o),null)},resendOtp:e=>{let{mobile:n,countryCode:r,token:o,action:a}=e;const l=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${o}",\n\t\t\taction: ${a},\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.cK,l),null)},signInWithOtp:e=>{let{otp:r,requestId:o,isRedirection:a=!0}=e;const c=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${r}",\n    \trequest_id: "${o}",\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.j1,c),null).then((e=>{if(e?.errors)throw e?.errors?.[0];const{user_exists:t}=e?.verifyMobileOTP||{};if(t){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}else a&&n({pathname:"/auth/edit-profile",search:l.search});return e}))},signUp:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:o,lastName:a,gender:l,email:c,phone:{countryCode:d,mobile:u},password:p}=e,_=[["$platform",`${n}`],["$formRegisterRequestInput",`${`{\n\t\t\tgender: "${l}",\n\t\t\tfirst_name: "${o}",\n\t\t\tlast_name: "${a}",\n\t\t\tpassword: "${p}",\n\t\t\tregister_token: "${r}",\n\t\t\t${c?`email: "${c}",`:""}\n\t\t\t${d&&u?`phone: { country_code: "${d}", mobile: "${u}" },`:""}\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.IJ,_),null)},setPassword:e=>{let{password:r,code:o}=e;const a=[["$code",`${o}`],["$password",`${r}`]];return t.executeGraphQL((0,i.Ll)(s.s_,a),null).then((e=>{if(e?.errors)throw e?.errors?.[0];return n({pathname:"/"}),e}))},sendOtpMobile:e=>{},sendResetPasswordEmail:e=>{const n=window.APP_DATA.applicationID,{email:r}=e,o=[["$platform",`${n}`],["$email",`${r}`]];return t.executeGraphQL((0,i.Ll)(s.C1,o),null)},sendResetPasswordMobile:e=>{},resendVerifyMobileOtp:e=>{const{mobile:n,countryCode:r,token:o}=e,a=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${o}",\n\t\t\taction: resend,\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.cK,a),null)},resendVerifyEmailOtp:e=>{const{email:n,registerToken:r,token:o}=e,a=[["$platform",`${window.APP_DATA.applicationID}`],["$sendEmailOtpRequestInput",`${`{\n\t\t\temail: "${n}",\n\t\t\tregister_token: "${r}",\n    \ttoken: "${o}",\n\t\t\taction: resend,\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.QF,a),null)},verifyMobileOtp:e=>{const{requestId:r="",registerToken:o="",otp:a,isEmailVerified:c,isRedirection:d}=e,u=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${a}",\n\t\t\tregister_token: "${o}",\n    \trequest_id: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.j1,u),null).then((e=>{if(e?.errors)throw e?.errors?.[0];const{user_exists:t,email:r,verify_email_link:o}=e?.verifyMobileOTP||{};if(t)if(o){if(d){const e=new URLSearchParams(l.search);e.set("email",r),n({pathname:"/auth/verify-email-link",search:e.toString()})}}else if(d){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},verifyEmailOtp:e=>{const{otp:n,email:r,registerToken:o,action:a,isMobileVerified:c,isRedirection:d}=e,u=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyEmailOtpRequestInput",`${`{\n\t\t\tregister_token: "${o}",\n\t\t\totp: "${n}",\n    \temail: "${r}",\n\t\t\taction: "${a}"\n\t\t}`}`]];return t.executeGraphQL((0,i.Ll)(s.$d,u),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(d){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendVerificationLinkEmail:e=>{},facebook:(0,r.useMemo)((()=>({display_text:m,login:facebookLogin}))),addEmail:e=>{}}}},4429:(e,t,n)=>{n.d(t,{Ll:()=>updateGraphQueryWithValue,hd:()=>validateEmailField});function validateEmailField(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)}function updateGraphQueryWithValue(e,t){return e&&t&&Array.isArray(t)?(t.forEach((t=>{const[n,r]=t;n&&r?e=e.split(n).join(r):console.error("Invalid replacement format. Each replacement should be an array [$search, replaceWith].")})),e):(console.error("Invalid input. Please provide a valid main string and an array of replacements."),e)}},1329:(e,t,n)=>{n.d(t,{default:()=>a});var r=n(9155),o=n.n(r);const a=function AuthContainer(e){let{children:t}=e;return o().createElement("div",{className:"auth-container__loginWrapper___JBAQr"},o().createElement("div",{className:"auth-container__loginCard___vNrQp"},o().createElement("div",{className:"loginContent"},t)))}},1962:(e,t,n)=>{n.d(t,{$d:()=>u,C1:()=>l,IJ:()=>c,QF:()=>p,T_:()=>i,ab:()=>s,cK:()=>d,j1:()=>o,oW:()=>a,s_:()=>_,xc:()=>r});const r='mutation LoginWithOTP {\n  loginWithOTP(platform: "$platform", sendOtpRequestSchemaInput: $sendOtpRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',o='mutation VerifyMobileOTP {\n  verifyMobileOTP(platform: "$platform", verifyOtpRequestSchemaInput: $verifyOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',a='mutation LoginWithEmailAndPassword {\n    loginWithEmailAndPassword(passwordLoginRequestSchemaInput: {\n        username: "$username",\n        password: "$password",\n      }) {\n      register_token\n      request_id\n      user {\n        id\n        account_type\n        active\n        application_id\n        created_at\n        dob\n        emails {\n          active\n          email\n          primary\n          verified\n        }\n        first_name\n        gender\n        last_name\n        meta\n        phone_numbers {\n          active\n          country_code\n          phone\n          primary\n          verified\n        }\n        profile_pic_url\n        updated_at\n        user_id\n        username\n        debug {\n          platform\n          source\n        }\n        has_old_password_hash\n        uid\n      }\n    }\n  }',i="query Logout {\n  user {\n    logout {\n      logout\n    }\n  }\n}",s='mutation UpdateProfile {\n  updateProfile(platform: "$platform", editProfileRequestSchemaInput: $editProfileRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n    verify_email_link\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',l='mutation SendResetPasswordEmail {\n  sendResetPasswordEmail(platform: "$platform", sendResetPasswordEmailRequestSchemaInput: {email: "$email"}) {\n    status\n  }\n}',c='mutation RegisterWithForm {\n  registerWithForm(platform: "$platform", formRegisterRequestSchemaInput: $formRegisterRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}\n',d='mutation SendOTPOnMobile {\n  sendOTPOnMobile(sendMobileOtpRequestSchemaInput: $sendMobileOtpRequestInput, platform: "$platform") {\n    country_code\n    message\n    mobile\n    register_token\n    request_id\n    resend_timer\n    resend_token\n    success\n  }\n}\n',u='mutation VerifyEmailOTP {\n  verifyEmailOTP(platform: "$platform", verifyEmailOtpRequestSchemaInput: $verifyEmailOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',p='mutation SendOTPOnEmail {\n  sendOTPOnEmail(platform: "$platform", sendEmailOtpRequestSchemaInput: $sendEmailOtpRequestInput) {\n    success\n  }\n}',_='mutation ForgotPassword {\n  forgotPassword(forgotPasswordRequestSchemaInput: { code: "$code", password: "$password" }) {\n    register_token\n    request_id\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n  }\n}'},447:t=>{t.exports=e},9155:e=>{e.exports=t},1862:e=>{e.exports=n},4442:e=>{e.exports=r}},a={};function __webpack_require__(e){var t=a[e];if(void 0!==t)return t.exports;var n=a[e]={exports:{}};return o[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{__webpack_require__.r(i),__webpack_require__.d(i,{default:()=>s});var e=__webpack_require__(9155),t=__webpack_require__.n(e),n=__webpack_require__(1862),r=__webpack_require__(4429),o=__webpack_require__(9931),a=__webpack_require__(1329);function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_extends.apply(null,arguments)}const s=function ForgetPasswordPage(i){let{fpi:s}=i;const{register:l,handleSubmit:c,formState:{errors:d,isValid:u},getValues:p,setError:_}=(0,n.useForm)({defaultValues:{email:""}}),m=(0,e.useId)(),[f,h]=(0,e.useState)(!1),{openLogin:g,sendResetPasswordEmail:w}=(0,o.o)({fpi:s}),handleForgotPasswordSubmit=e=>{const t={email:e.email};w(t).then((e=>{if(e?.errors)throw e?.errors?.[0];h(!0)})).catch((e=>{h(!1),_("root",{message:e?.details?.error||e?.message})}))};return t().createElement(a.default,null,t().createElement("div",null,t().createElement("h1",{className:"forget-password-page__forgotPasswordTitle___z4YIG"},"Reset Your Password"),f?t().createElement("div",{className:"forget-password-page__submitWrapper___PIZci"},t().createElement("p",{className:"forget-password-page__submitSuccessMsg___JViEx"},"Reset Link has been sent to your primary email address."),t().createElement("button",{className:"forget-password-page__resendBtn___Eogsz",onClick:()=>handleForgotPasswordSubmit(p())},"RESEND EMAIL")):t().createElement("form",{className:"forget-password-page__forgotPasswordWrapper___ftZU2",onSubmit:c(handleForgotPasswordSubmit)},t().createElement("div",{className:"forget-password-page__forgotPasswordInputGroup___kfpmW"},t().createElement("label",{className:"forget-password-page__loginInputTitle___yltOY",htmlFor:m},"Email"),t().createElement("input",_extends({id:m,type:"text"},l("email",{validate:e=>(0,r.hd)(e)||"Please enter valid email address"}))),d.email&&t().createElement("p",{className:"forget-password-page__emailErrorMessage___PHycG"},d.email.message)),d.root&&t().createElement("div",{className:"forget-password-page__forgotPasswordAlert___IjlbM"},t().createElement("span",{className:"forget-password-page__alertMessage___Y09g1"},d.root.message)),t().createElement("button",{className:"forget-password-page__forgotPasswordSubmitBtn___nr5ZN",disabled:!u,type:"submit"},"RESET PASSWORD"),t().createElement("button",{className:"forget-password-page__loginLink___QnuhC",onClick:()=>g({redirect:!1})},"Back to login"))))}})(),i})()));