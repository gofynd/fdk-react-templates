!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):"function"==typeof define&&define.amd?define("firestone",["fdk-core/utils","react","react-hook-form","react-router-dom"],t):"object"==typeof exports?exports.firestone=t(require("fdk-core/utils"),require("react"),require("react-hook-form"),require("react-router-dom")):e.firestone=t(e["fdk-core/utils"],e.react,e["react-hook-form"],e["react-router-dom"])}("undefined"!=typeof self?self:this,((e,t,n,r)=>(()=>{"use strict";var i={9931:(e,t,n)=>{n.d(t,{o:()=>useAccounts});var r=n(9155),i=n(447),o=n(4442),a=n(4429),s=n(1962);const useAccounts=e=>{let{fpi:t}=e;const n=(0,o.useNavigate)(),l=(0,o.useLocation)(),[u,d]=(0,r.useState)(null),c=(0,i.useGlobalStore)(t.getters.USER_DATA),p=(0,i.useGlobalStore)(t.getters.PLATFORM_DATA),m=(0,i.useGlobalStore)(t.getters.LOGGED_IN),_=(0,r.useMemo)((()=>u?.is_signed_in?`Continue as ${u.profile.full_name}`:"Login with Facebook"),[u]),facebookLogin=async()=>{};return{userData:c,platformData:p,isLoggedIn:m,openLogin:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",encodeURIComponent(l.pathname+l.search)),n({pathname:"/auth/login",search:t.toString()})},openRegister:function(){let{redirect:e=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=new URLSearchParams(l.search);e&&t.set("redirectUrl",l.pathname),n({pathname:"/auth/register",search:t.toString()})},openForgotPassword:()=>{n({pathname:"/auth/forgot-password",search:l.search})},openHomePage:()=>{const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)},updateProfile:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:i,lastName:o,gender:l,email:u,phone:{countryCode:d,mobile:c}}=e,p=[["$platform",`${n}`],["$editProfileRequestInput",`${`{\n\t\t\tcountry_code: "${d}",\n    \tfirst_name: "${i}",\n\t\t\tlast_name: "${o}",\n\t\t\tgender: "${l}",\n\t\t\tregister_token: "${r}",\n\t\t\t${u?`email: "${u}",`:""}\n\t\t\t${c&&d?`mobile: {\n\t\t\t\tcountry_code: "${d}",\n\t\t\t\tphone: "${c}"\n\t\t\t}`:""}\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.ab,p),null)},signOut:()=>t.executeGraphQL((0,a.Ll)(s.T_),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(e?.user?.logout?.logout){const t=new URLSearchParams(l.search).get("redirectUrl")||"";return window.location.href=window.location.origin+decodeURIComponent(t),e}return Promise.reject()})),signIn:e=>{const{isRedirection:n,password:r,username:i}=e,o=[["$username",`${i}`],["$password",`${r}`]];return t.executeGraphQL((0,a.Ll)(s.oW,o),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(n){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendOtp:e=>{let{mobile:n,countryCode:r}=e;const i=[["$platform",`${window.APP_DATA.applicationID}`],["$sendOtpRequestInput",`${`{\n\t\t\tmobile: "${n}"\n\t\t\tcountry_code: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.xc,i),null)},resendOtp:e=>{let{mobile:n,countryCode:r,token:i,action:o}=e;const l=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${i}",\n\t\t\taction: ${o},\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.cK,l),null)},signInWithOtp:e=>{let{otp:r,requestId:i,isRedirection:o=!0}=e;const u=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${r}",\n    \trequest_id: "${i}",\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.j1,u),null).then((e=>{if(e?.errors)throw e?.errors?.[0];const{user_exists:t}=e?.verifyMobileOTP||{};if(t){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}else o&&n({pathname:"/auth/edit-profile",search:l.search});return e}))},signUp:e=>{const n=window.APP_DATA.applicationID,{registerToken:r,firstName:i,lastName:o,gender:l,email:u,phone:{countryCode:d,mobile:c},password:p}=e,m=[["$platform",`${n}`],["$formRegisterRequestInput",`${`{\n\t\t\tgender: "${l}",\n\t\t\tfirst_name: "${i}",\n\t\t\tlast_name: "${o}",\n\t\t\tpassword: "${p}",\n\t\t\tregister_token: "${r}",\n\t\t\t${u?`email: "${u}",`:""}\n\t\t\t${d&&c?`phone: { country_code: "${d}", mobile: "${c}" },`:""}\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.IJ,m),null)},setPassword:e=>{let{password:r,code:i}=e;const o=[["$code",`${i}`],["$password",`${r}`]];return t.executeGraphQL((0,a.Ll)(s.s_,o),null).then((e=>{if(e?.errors)throw e?.errors?.[0];return n({pathname:"/"}),e}))},sendOtpMobile:e=>{},sendResetPasswordEmail:e=>{const n=window.APP_DATA.applicationID,{email:r}=e,i=[["$platform",`${n}`],["$email",`${r}`]];return t.executeGraphQL((0,a.Ll)(s.C1,i),null)},sendResetPasswordMobile:e=>{},resendVerifyMobileOtp:e=>{const{mobile:n,countryCode:r,token:i}=e,o=[["$platform",`${window.APP_DATA.applicationID}`],["$sendMobileOtpRequestInput",`${`{\n\t\t\tmobile: "${n}",\n\t\t\tcountry_code: "${r}",\n    \ttoken: "${i}",\n\t\t\taction: resend,\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.cK,o),null)},resendVerifyEmailOtp:e=>{const{email:n,registerToken:r,token:i}=e,o=[["$platform",`${window.APP_DATA.applicationID}`],["$sendEmailOtpRequestInput",`${`{\n\t\t\temail: "${n}",\n\t\t\tregister_token: "${r}",\n    \ttoken: "${i}",\n\t\t\taction: resend,\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.QF,o),null)},verifyMobileOtp:e=>{const{requestId:r="",registerToken:i="",otp:o,isEmailVerified:u,isRedirection:d}=e,c=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyOtpRequestInput",`${`{\n\t\t\totp: "${o}",\n\t\t\tregister_token: "${i}",\n    \trequest_id: "${r}",\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.j1,c),null).then((e=>{if(e?.errors)throw e?.errors?.[0];const{user_exists:t,email:r,verify_email_link:i}=e?.verifyMobileOTP||{};if(t)if(i){if(d){const e=new URLSearchParams(l.search);e.set("email",r),n({pathname:"/auth/verify-email-link",search:e.toString()})}}else if(d){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},verifyEmailOtp:e=>{const{otp:n,email:r,registerToken:i,action:o,isMobileVerified:u,isRedirection:d}=e,c=[["$platform",`${window.APP_DATA.applicationID}`],["$verifyEmailOtpRequestInput",`${`{\n\t\t\tregister_token: "${i}",\n\t\t\totp: "${n}",\n    \temail: "${r}",\n\t\t\taction: "${o}"\n\t\t}`}`]];return t.executeGraphQL((0,a.Ll)(s.$d,c),null).then((e=>{if(e?.errors)throw e?.errors?.[0];if(d){const e=new URLSearchParams(l.search).get("redirectUrl")||"";window.location.href=window.location.origin+decodeURIComponent(e)}return e}))},sendVerificationLinkEmail:e=>{},facebook:(0,r.useMemo)((()=>({display_text:_,login:facebookLogin}))),addEmail:e=>{}}}},4429:(e,t,n)=>{n.d(t,{Ll:()=>updateGraphQueryWithValue,hd:()=>validateEmailField});function validateEmailField(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)}function updateGraphQueryWithValue(e,t){return e&&t&&Array.isArray(t)?(t.forEach((t=>{const[n,r]=t;n&&r?e=e.split(n).join(r):console.error("Invalid replacement format. Each replacement should be an array [$search, replaceWith].")})),e):(console.error("Invalid input. Please provide a valid main string and an array of replacements."),e)}},1962:(e,t,n)=>{n.d(t,{$d:()=>c,C1:()=>l,IJ:()=>u,QF:()=>p,T_:()=>a,ab:()=>s,cK:()=>d,j1:()=>i,oW:()=>o,s_:()=>m,xc:()=>r});const r='mutation LoginWithOTP {\n  loginWithOTP(platform: "$platform", sendOtpRequestSchemaInput: $sendOtpRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',i='mutation VerifyMobileOTP {\n  verifyMobileOTP(platform: "$platform", verifyOtpRequestSchemaInput: $verifyOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',o='mutation LoginWithEmailAndPassword {\n    loginWithEmailAndPassword(passwordLoginRequestSchemaInput: {\n        username: "$username",\n        password: "$password",\n      }) {\n      register_token\n      request_id\n      user {\n        id\n        account_type\n        active\n        application_id\n        created_at\n        dob\n        emails {\n          active\n          email\n          primary\n          verified\n        }\n        first_name\n        gender\n        last_name\n        meta\n        phone_numbers {\n          active\n          country_code\n          phone\n          primary\n          verified\n        }\n        profile_pic_url\n        updated_at\n        user_id\n        username\n        debug {\n          platform\n          source\n        }\n        has_old_password_hash\n        uid\n      }\n    }\n  }',a="query Logout {\n  user {\n    logout {\n      logout\n    }\n  }\n}",s='mutation UpdateProfile {\n  updateProfile(platform: "$platform", editProfileRequestSchemaInput: $editProfileRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n    verify_email_link\n    verify_email_otp\n    verify_mobile_otp\n  }\n}',l='mutation SendResetPasswordEmail {\n  sendResetPasswordEmail(platform: "$platform", sendResetPasswordEmailRequestSchemaInput: {email: "$email"}) {\n    status\n  }\n}',u='mutation RegisterWithForm {\n  registerWithForm(platform: "$platform", formRegisterRequestSchemaInput: $formRegisterRequestInput) {\n    country_code\n    email\n    message\n    mobile\n    register_token\n    request_id\n    resend_email_token\n    resend_timer\n    resend_token\n    success\n    user_exists\n    verify_email_otp\n    verify_mobile_otp\n  }\n}\n',d='mutation SendOTPOnMobile {\n  sendOTPOnMobile(sendMobileOtpRequestSchemaInput: $sendMobileOtpRequestInput, platform: "$platform") {\n    country_code\n    message\n    mobile\n    register_token\n    request_id\n    resend_timer\n    resend_token\n    success\n  }\n}\n',c='mutation VerifyEmailOTP {\n  verifyEmailOTP(platform: "$platform", verifyEmailOtpRequestSchemaInput: $verifyEmailOtpRequestInput) {\n    register_token\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n    user_exists\n  }\n}',p='mutation SendOTPOnEmail {\n  sendOTPOnEmail(platform: "$platform", sendEmailOtpRequestSchemaInput: $sendEmailOtpRequestInput) {\n    success\n  }\n}',m='mutation ForgotPassword {\n  forgotPassword(forgotPasswordRequestSchemaInput: { code: "$code", password: "$password" }) {\n    register_token\n    request_id\n    user {\n      id\n      account_type\n      active\n      application_id\n      created_at\n      dob\n      emails {\n        active\n        email\n        primary\n        verified\n      }\n      first_name\n      gender\n      last_name\n      meta\n      phone_numbers {\n        active\n        country_code\n        phone\n        primary\n        verified\n      }\n      profile_pic_url\n      updated_at\n      user_id\n      username\n      debug {\n        platform\n        source\n      }\n      has_old_password_hash\n      uid\n    }\n  }\n}'},447:t=>{t.exports=e},9155:e=>{e.exports=t},1862:e=>{e.exports=n},4442:e=>{e.exports=r}},o={};function __webpack_require__(e){var t=o[e];if(void 0!==t)return t.exports;var n=o[e]={exports:{}};return i[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{__webpack_require__.r(a),__webpack_require__.d(a,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var e=__webpack_require__(9155),t=__webpack_require__(447),n=__webpack_require__(1862),r=__webpack_require__(4429),i=__webpack_require__(9931),o=__webpack_require__(4442);const __WEBPACK_DEFAULT_EXPORT__=a=>{const s=(0,t.useGlobalStore)(a.getters.PLATFORM_DATA),l=(0,t.useGlobalStore)(a.getters.USER_DATA),u=(0,t.useGlobalStore)(a.getters.LOGGED_IN),[d,c]=(0,e.useState)(!1),[p,m]=(0,e.useState)({}),[_,f]=(0,e.useState)(!0),[h,g]=(0,e.useState)(!0),w=(0,o.useNavigate)(),$=(0,o.useLocation)(),b=s?.required_fields?.email?.is_required,y=(0,e.useMemo)((()=>"soft"===s?.required_fields?.email?.level?"(optional)":"hard"===s?.required_fields?.email?.level?"*":""),[s]),v=s?.required_fields?.mobile?.is_required,q=(0,e.useMemo)((()=>"soft"===s?.required_fields?.mobile?.level?"optional":"hard"===s?.required_fields?.mobile?.level?"required":""),[s]),P=(0,e.useMemo)((()=>!!u&&(!(!s?.required_fields?.email?.is_required||"soft"!==s?.required_fields?.email?.level)||!(!s?.required_fields?.mobile?.is_required||"soft"!==s?.required_fields?.mobile?.level))),[s]),k=(0,e.useMemo)((()=>l?.emails?.find((e=>e.primary))),[l]),R=(0,e.useMemo)((()=>l?.phone_numbers?.find((e=>e.primary))),[l]),I=k?.verified,O=R?.verified,L=(0,n.useForm)({defaultValues:{firstName:l?.first_name||"",lastName:l?.last_name||"",gender:l?.gender||"male",email:k?.email||"",phone:{countryCode:R?.country_code,mobile:R?.phone,isValidNumber:O}}});(0,e.useEffect)((()=>{l&&L.reset({firstName:l?.first_name||"",lastName:l?.last_name||"",gender:l?.gender||"male",email:k?.email||"",phone:{countryCode:R?.country_code||"91",mobile:R?.phone,isValidNumber:O}})}),[l,L.reset]);const{openHomePage:S,updateProfile:A,signOut:T}=(0,i.o)({fpi:a});return{editProfileForm:L,showVerifyBoth:d,verifyBothData:p,showVerifyEmail:_,showVerifyMobile:h,isLoggedIn:u,isEmail:b,isEmailRequired:y,isMobile:v,isMobileRequired:q,isEmailExist:I,isMobileDisabled:O,isCancelButton:P,validateEmail:e=>!(s?.required_fields?.email?.is_required&&"hard"===s?.required_fields?.email?.level||e)||(0,r.hd)(e),handleCancelClick:e=>{e.stopPropagation(),e.preventDefault();localStorage.setItem("isCancelButtonClicked",432e6),S()},handleSignOutClick:e=>{e.stopPropagation(),e.preventDefault(),T()},handleProfileUpdate:e=>{const t={...e,registerToken:l?.register_token||""};console.log({user:t}),A(t).then((e=>{if(e?.errors)throw e?.errors?.[0];const t=e?.updateProfile;let{verify_mobile_otp:n,verify_email_otp:r,verify_email_link:i,email:o}=t;if(i){const e=new URLSearchParams($.search);return e.set("email",o),void w({pathname:"/auth/verify-email-link",search:e.toString()})}if(n||r)return g(!!n),f(!!r),m(t),void c(!0);S()})).catch((e=>{L.setError("root",{message:e?.message||"Something went wrong"})}))}}}})(),a})()));