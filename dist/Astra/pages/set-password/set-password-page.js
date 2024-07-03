!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):"function"==typeof define&&define.amd?define("firestone",["fdk-core/utils","react","react-hook-form","react-router-dom"],t):"object"==typeof exports?exports.firestone=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):e.firestone=t(e["fdk-core/utils"],e.react,e["react-hook-form"],e["react-router-dom"])}("undefined"!=typeof self?self:this,((e,t,n,r)=>(()=>{"use strict";var a={345:(e,t,n)=>{n.d(t,{o:()=>useAccounts});var r=n(9155),a=n(447),o=n(4442),s=n(6111),i=n(1948);const useAccounts=e=>{let{fpi:t}=e;const n=(0,o.useNavigate)(),l=(0,o.useLocation)(),[d,c]=(0,r.useState)(null),u=(0,a.useGlobalStore)(t.getters.USER_DATA),p=(0,a.useGlobalStore)(t.getters.PLATFORM_DATA),_=(0,a.useGlobalStore)(t.getters.LOGGED_IN),m=(0,r.useMemo)((()=>d?.is_signed_in?`Continue as ${d.profile.full_name}`:"Login with Facebook"),[d]),facebookLogin=async()=>{};return{userData:u,platformData:p,isLoggedIn:_,openLogin:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",encodeURIComponent(l.pathname+l.search)),n({pathname:"/auth/login",search:t.toString()})},openRegister:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",l.pathname),n({pathname:"/auth/register",search:t.toString()})},openForgotPassword:()=>{n({pathname:"/auth/forgot-password",search:l.search})},openHomePage:()=>{const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)},updateProfile:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:a,lastName:o,gender:l,email:d,phone:{countryCode:c,mobile:u}}=e,p=[["$platform",`${n}`],["$editProfileRequestInput",`${`{\n\t\t\tcountry_code: "${c}",\n    \tfirst_name: "${a}",\n\t\t\tlast_name: "${o}",\n\t\t\tgender: "${l}",\n\t\t\tregister_token: "${r}",\n\t\t\t${d?`email: "${d}",`:""}\n\t\t\t${u&&c?`mobile: {\n\t\t\t\tcountry_code: "${c}",\n\t\t\t\tphone: "${u}"\n\t\t\t}`:""}\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.ab,p),null)},signOut:()=>t.executeGraphQL((0,s.Ll)(i.T_),null).then((e=>{if(e?.user?.logout?.logout){const t=new URLSearchParams(l.search).get("redirectUrl")||"";return window.location.href=window.location.origin+decodeURIComponent(t),e}return Promise.reject()})),signIn:e=>{const{isRedirection:n,password:r,username:a}=e,o=[["$username",`${a}`],["$password",`${r}`]];return t.executeGraphQL((0,s.Ll)(i.oW,o),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(n){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendOtp:e=>{let{mobile:n,countryCode:r}=e;const a=[["$platform",`${window.APP_DATA.applicationID}`],["$sendOtpRequestInput",`${`{\n\t\t\tmobile: "${n}"\n\t\t\tcountry_code: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.xc,a),null)},resendOtp:e=>{let{mobile:n,countryCode:r,token:a,action:o}=e;const l=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${a}",\n\t\t\taction: ${o},\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.cK,l),null)},signInWithOtp:e=>{let{otp:r,requestId:a,isRedirection:o=!0}=e;const d=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${r}",\n    \trequest_id: "${a}",\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.j1,d),null).then((e=>{if(e?.errors)throw e?.errors?.[0];const{user_exists:t}=e?.verifyMobileOTP||{};if(t){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}else o&&n({pathname:"/auth/edit-profile",search:l.search});return e}))},signUp:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:a,lastName:o,gender:l,email:d,phone:{countryCode:c,mobile:u},password:p}=e,_=[["$platform",`${n}`],["$formRegisterRequestInput",`${`{\n\t\t\tgender: "${l}",\n\t\t\tfirst_name: "${a}",\n\t\t\tlast_name: "${o}",\n\t\t\tpassword: "${p}",\n\t\t\tregister_token: "${r}",\n\t\t\t${d?`email: "${d}",`:""}\n\t\t\t${c&&u?`phone: { country_code: "${c}", mobile: "${u}" },`:""}\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.IJ,_),null)},setPassword:e=>{let{password:r,code:a}=e;const o=[["$code",`${a}`],["$password",`${r}`]];return t.executeGraphQL((0,s.Ll)(i.s_,o),null).then((e=>(n({pathname:"/"}),e)))},sendOtpMobile:e=>{},sendResetPasswordEmail:e=>{const n=window.APP_DATA.applicationID,{email:r}=e,a=[["$platform",`${n}`],["$email",`${r}`]];return t.executeGraphQL((0,s.Ll)(i.C1,a),null)},sendResetPasswordMobile:e=>{},resendVerifyMobileOtp:e=>{const{mobile:n,countryCode:r,token:a}=e,o=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${a}",\n\t\t\taction: resend,\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.cK,o),null)},resendVerifyEmailOtp:e=>{const{email:n,registerToken:r,token:a}=e,o=[["$platform",`${window.APP_DATA.applicationID}`],["$sendEmailOtpRequestInput",`${`{\n\t\t\temail: "${n}",\n\t\t\tregister_token: "${r}",\n    \ttoken: "${a}",\n\t\t\taction: "resend",\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.QF,o),null)},verifyMobileOtp:e=>{const{requestId:r="",registerToken:a="",otp:o,isEmailVerified:d,isRedirection:c}=e,u=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${o}",\n\t\t\tregister_token: "${a}",\n    \trequest_id: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.j1,u),null).then((e=>{const{user_exists:t,email:r,verify_email_link:a}=e?.verifyMobileOTP||{};if(t)if(a){if(c){const e=new URLSearchParams(l.search);e.set("email",r),n({pathname:"/auth/verify-email-link",search:e.toString()})}}else if(c){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},verifyEmailOtp:e=>{const{otp:n,email:r,registerToken:a,action:o,isMobileVerified:d,isRedirection:c}=e,u=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyEmailOtpRequestInput",`${`{\n\t\t\tregister_token: "${a}",\n\t\t\totp: "${n}",\n    \temail: "${r}",\n\t\t\taction: "${o}"\n\t\t}`}`]];return t.executeGraphQL((0,s.Ll)(i.$d,u),null).then((e=>{if(c){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendVerificationLinkEmail:e=>{},facebook:(0,r.useMemo)((()=>({display_text:m,login:facebookLogin}))),addEmail:e=>{}}}},6111:(e,t,n)=>{n.d(t,{Ll:()=>updateGraphQueryWithValue,U6:()=>validatePasswordField});function validatePasswordField(e){return/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±])[A-Za-z\d`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±]{8,}$/.test(e)}function updateGraphQueryWithValue(e,t){return e&&t&&Array.isArray(t)?(t.forEach((t=>{const[n,r]=t;n&&r?e=e.split(n).join(r):console.error("Invalid replacement format. Each replacement should be an array [$search, replaceWith].")})),e):(console.error("Invalid input. Please provide a valid main string and an array of replacements."),e)}},716:(e,t,n)=>{n.d(t,{default:()=>o});var r=n(9155),a=n.n(r);const o=function AuthContainer(e){let{children:t}=e;return a().createElement("div",{className:"auth-container__loginWrapper____ssvo"},a().createElement("div",{className:"auth-container__loginCard___P7ouj"},a().createElement("div",{className:"loginContent"},t)))}},1748:(e,t,n)=>{n.d(t,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var r=n(9155),a=(n(447),n(4442)),o=n(1862),s=n(6111),i=n(1948),l=n(345);const __WEBPACK_DEFAULT_EXPORT__=e=>{const{setPassword:t}=(0,l.o)({fpi:e}),n=a.useLocation,d=(0,o.useForm)({defaultValues:{newPassword:"",confirmNewPassword:""}});(0,r.useEffect)((()=>{const t=[["$code",`${new URLSearchParams(n.search).get("code")}`]];e.executeGraphQL((0,s.Ll)(i.nd,t),null).then((e=>e))}),[]);return{setPasswordForm:d,handleSetPassword:e=>{const r=new URLSearchParams(n.search);return t({password:e.newPassword,code:r.get("code")}).then((e=>{console.log({res:e})})).catch((e=>{}))}}}},1948:(e,t,n)=>{n.d(t,{$d:()=>u,C1:()=>l,IJ:()=>d,QF:()=>p,T_:()=>s,ab:()=>i,cK:()=>c,j1:()=>a,nd:()=>m,oW:()=>o,s_:()=>_,xc:()=>r});const r='mutation LoginWithOTP {\n  loginWithOTP(platform: "$platform", sendOtpRequestSchemaInput: $sendOtpRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',a='mutation VerifyMobileOTP {\n  verifyMobileOTP(platform: "$platform", verifyOtpRequestSchemaInput: $verifyOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',o='mutation LoginWithEmailAndPassword {\n    loginWithEmailAndPassword(passwordLoginRequestSchemaInput: {\n        username: "$username",\n        password: "$password",\n      }) {\n      register_token\n      request_id\n      user {\n        id\n        account_type\n        active\n        application_id\n        created_at\n        dob\n        emails {\n          active\n          email\n          primary\n          verified\n        }\n        first_name\n        gender\n        last_name\n        meta\n        phone_numbers {\n          active\n          country_code\n          phone\n          primary\n          verified\n        }\n        profile_pic_url\n        updated_at\n        user_id\n        username\n        debug {\n          platform\n          source\n        }\n        has_old_password_hash\n        uid\n      }\n    }\n  }',s="query Logout {\n  user {\n    logout {\n      logout\n    }\n  }\n}",i='mutation UpdateProfile {\n  updateProfile(platform: "$platform", editProfileRequestSchemaInput: $editProfileRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n    verify_email_link\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',l='mutation SendResetPasswordEmail {\n  sendResetPasswordEmail(platform: "$platform", sendResetPasswordEmailRequestSchemaInput: {email: "$email"}) {\n    status\n  }\n}',d='mutation RegisterWithForm {\n  registerWithForm(platform: "$platform", formRegisterRequestSchemaInput: $formRegisterRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}\n',c='mutation SendOTPOnMobile {\n  sendOTPOnMobile(sendMobileOtpRequestSchemaInput: $sendMobileOtpRequestInput, platform: "$platform") {\n    country_code\n    message\n    mobile\n    register_token\n    request_id\n    resend_timer\n    resend_token\n    success\n  }\n}\n',u='mutation VerifyEmailOTP {\n  verifyEmailOTP(platform: "$platform", verifyEmailOtpRequestSchemaInput: $verifyEmailOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',p='mutation SendOTPOnEmail {\n  sendOTPOnEmail(platform: "$platform", sendEmailOtpRequestSchemaInput: $sendEmailOtpRequestInput) {\n    success\n  }\n}',_='mutation ForgotPassword {\n  forgotPassword(forgotPasswordRequestSchemaInput: { code: "$code", password: "$password" }) {\n    register_token\n    request_id\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n  }\n}',m='mutation SendResetToken {\n  sendResetToken(codeRequestBodySchemaInput: { code: "$code" }) {\n    status\n  }\n}'},447:t=>{t.exports=e},9155:e=>{e.exports=t},1862:e=>{e.exports=n},4442:e=>{e.exports=r}},o={};function __webpack_require__(e){var t=o[e];if(void 0!==t)return t.exports;var n=o[e]={exports:{}};return a[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s={};return(()=>{__webpack_require__.r(s),__webpack_require__.d(s,{default:()=>c});var e=__webpack_require__(9155),t=__webpack_require__.n(e),n=__webpack_require__(1748),r=__webpack_require__(6111),a=__webpack_require__(716),o="set-password-page__errorInput___AsrKH",i="set-password-page__errorText___a_Qex",l="set-password-page__setInputGroup___vbU19",d="set-password-page__setInputTitle___PTTh4";function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_extends.apply(null,arguments)}const c=function SetPasswordPage(e){let{fpi:s}=e;const{setPasswordForm:c,handleSetPassword:u}=(0,n.default)(s),{register:p,handleSubmit:_,formState:{errors:m,isValid:f},getValues:w}=c;return t().createElement(a.default,null,t().createElement("form",{className:"set-password-page__setWrapper___lFE06",onSubmit:_(u)},t().createElement("div",{className:"set-password-page__setContentTitle___y1k5V"},"Create New Password"),t().createElement("div",{className:`${l} ${m.newPassword?`${o}`:""}`},t().createElement("label",{className:d,htmlFor:"newPassword"},"New Password"),t().createElement("input",_extends({type:"password"},p("newPassword",{validate:e=>(0,r.U6)(e)||"Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character."}))),m.newPassword&&t().createElement("p",{className:i},m.newPassword.message)),t().createElement("div",{className:`${l} ${m.confirmNewPassword?`${o}`:""}`},t().createElement("label",{className:d,htmlFor:"confirmNewPassword"},"Confirm New Password"),t().createElement("input",_extends({type:"password"},p("confirmNewPassword",{validate:e=>e===w("newPassword")||"Password does not match"}))),m.confirmNewPassword&&t().createElement("p",{className:i},m.confirmNewPassword.message)),m.root&&t().createElement("div",{className:"set-password-page__loginAlert___aSEw3"},t().createElement("span",null,m.root.message)),t().createElement("button",{className:"set-password-page__setSubmitBtn___fL39e",type:"submit",disabled:!f},"Set Password")))}})(),s})()));