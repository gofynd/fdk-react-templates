!function webpackUniversalModuleDefinition(e,a){"object"==typeof exports&&"object"==typeof module?module.exports=a(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],a):"object"==typeof exports?exports.firestone=a(require("react")):e.firestone=a(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var a={9155:a=>{a.exports=e}},t={};function __webpack_require__(e){var r=t[e];if(void 0!==r)return r.exports;var l=t[e]={exports:{}};return a[e](l,l.exports,__webpack_require__),l.exports}__webpack_require__.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(a,{a}),a},__webpack_require__.d=(e,a)=>{for(var t in a)__webpack_require__.o(a,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:a[t]})},__webpack_require__.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{__webpack_require__.r(r),__webpack_require__.d(r,{default:()=>checkout_address_form});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{pR:()=>l,iP:()=>s,QD:()=>n,r_:()=>o,KL:()=>m,mB:()=>c,fb:()=>d,Dt:()=>u,KJ:()=>_,gV:()=>i,zc:()=>p,Qk:()=>v,nU:()=>y,zw:()=>E,LR:()=>h,EB:()=>f,Bp:()=>N,NW:()=>b,RK:()=>k});var a=__webpack_require__(9155),t=__webpack_require__.n(a),l="checkout-address-form__addressType___VKO9s",s="checkout-address-form__addressTypeHeader___jBJHL",n="checkout-address-form__addressTypes___oLNWH",o="checkout-address-form__contactInfo___EjWA7",m="checkout-address-form__defaultAddress___oIz86",c="checkout-address-form__deliverBtn___oma1m",d="checkout-address-form__deliverBtnDivEdit___Q2fjl",u="checkout-address-form__deliveryInfo___CJOnM",_="checkout-address-form__formContainer___zrFkK",i="checkout-address-form__formContainer2____61r3",p="checkout-address-form__formError___Slida",v="checkout-address-form__formInputBox___e_A0y",y="checkout-address-form__formItemDiv___oHP45",E="checkout-address-form__formLabel___zhBDs",h="checkout-address-form__formReq___vfbcA",f="checkout-address-form__secondContainer___Qu4hn",N="checkout-address-form__selectedDiv___mUW6L",b="checkout-address-form__type___Xcpne",k="checkout-address-form__visible___yBkHM";const checkout_address_form=r=>{let{isNewAddress:x=!0,showAddressType:q=!0,addressItem:w=(()=>{}),updateAddress:g,addAddress:$}=r;const C=[{label:"Full Name",required:!0,name:"name",type:"text",autofocus:!0,showerror:!1,value:x?"":w?.name,validateFn:()=>{},errortext:"Enter Full Name"},{label:"Mobile Number",required:!0,name:"phone",type:"tel",showerror:!1,validateFn:()=>{},value:x?"":w?.phone,errortext:"Enter Mobile Number",maxlength:10},{label:"Email (optional)",required:!1,name:"email",type:"text",showerror:!1,validateFn:()=>{},value:x?"":w.email?w.email:"",errortext:"Enter Email Id"}],F=[{label:"Flat No/House No",required:!0,name:"address",type:"text",value:x?"":w?.address,showerror:!1,validateFn:()=>{},errortext:"Enter Flat No/House No"},{label:"Building Name/street",required:!0,name:"area",type:"text",showerror:!1,value:x?"":w?.area,validateFn:()=>{},errortext:"Enter Building Name/street"},{label:"Locality/Landmark",required:!0,name:"landmark",type:"text",showerror:!1,value:x?"":w?.landmark,validateFn:()=>{},errortext:"Enter Locality/Landmark"}],S={label:"Pincode",required:!0,name:"pincode",type:"text",showerror:!1,value:x?"":w.area_code,validateFn:()=>{},errortext:"Enter Valid Pincode"},A=[{name:"home",type:"Home",display:"Home",icon:"/path/to/home-icon.svg"},{name:"work",type:"Work",display:"Work",icon:"/path/to/work-icon.svg"},{name:"friends & family",type:"Friends & Family",display:"Friends & Family",icon:"/path/to/work-icon.svg"},{name:"other",type:"Other",display:"Other",icon:"/path/to/work-icon.svg"}],B={label:"City",required:!0,name:"city",type:"text",value:x?"":w.city,errortext:"enter city",showerror:!1},I={label:"State",required:!0,name:"state",type:"text",value:x?"":w.state,errortext:"enter state",showerror:!1},O={label:"Country",required:!0,name:"country",type:"text",value:x?"":w.country,errortext:"enter country",showerror:!1},L={label:"Address Name",type:"text",showerror:!1,value:x?"":w.address_type,errortext:"Enter Address Name"},[j,D]=(0,a.useState)(L.value),[H,M]=(0,a.useState)(F),[P,T]=(0,a.useState)(S),[W,z]=(0,a.useState)(B),[K,Q]=(0,a.useState)(!1),[R,U]=(0,a.useState)(I),[V,J]=(0,a.useState)(O),[X,G]=(0,a.useState)((()=>{if(x)return null;{let e=A.map((e=>e.type)),a=w.address_type;return e.includes(a)?a:"Other"}})()),[Y,Z]=(0,a.useState)(C),handleUserdataChange=(e,a)=>{const{name:t,value:r}=a.target,l=[...Y];l[e].value=r,Z(l)};return t().createElement(t().Fragment,null,t().createElement("div",{className:u},"Delivery Information"),t().createElement("div",{className:_},H.map(((e,a)=>t().createElement("div",{key:e.name+a,className:y},t().createElement("input",{className:v,type:e.type,required:e.required,value:e.value,name:e.name,onChange:e=>((e,a)=>{const{name:t,value:r}=a.target,l=[...H];l[e].value=r,M(l)})(a,e)}),t().createElement("span",{className:E},t().createElement("span",null,e.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${e.showerror?k:""}`},e.errortext)))),t().createElement("div",{className:y},t().createElement("input",{className:v,type:P.type,required:P.required,value:P.value,name:P.name,onChange:e=>(e=>{const{value:a}=e.target;T((e=>({...e,value:a})))})(e)}),t().createElement("span",{className:E},t().createElement("span",null,P.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${P.showerror?k:""}`},P.errortext)),t().createElement("div",{className:y},t().createElement("input",{className:v,type:W.type,required:W.required,value:W.value,name:W.name,onChange:e=>{const{value:a}=e.target;z((e=>({...e,value:a})))}}),t().createElement("span",{className:E},t().createElement("span",null,W.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${W.showerror?k:""}`},W.errortext)),t().createElement("div",{className:y},t().createElement("input",{className:v,type:R.type,required:R.required,value:R.value,name:R.name,onChange:e=>{const{value:a}=e.target;U((e=>({...e,value:a})))}}),t().createElement("span",{className:E},t().createElement("span",null,R.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${R.showerror?k:""}`},R.errortext)),t().createElement("div",{className:y},t().createElement("input",{className:v,type:V.type,required:V.required,value:V.value,name:V.name,onChange:e=>{const{value:a}=e.target;J((e=>({...e,value:a})))}}),t().createElement("span",{className:E},t().createElement("span",null,V.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${V.showerror?k:""}`},V.errortext)),t().createElement("div",{className:f},q&&t().createElement("div",{className:b},t().createElement("span",{className:s},"SAVE AS"),t().createElement("div",{className:`${e.formInput} ${l}`},A.map(((a,r)=>t().createElement("div",{className:b},t().createElement("label",{htmlFor:a.type,className:`${n} ${X===a.type?N:""}`,key:a.name,onClick:()=>(e=>{G(e.type)})(a)},t().createElement("label",{className:e.regularXxxs},t().createElement("span",null,a.display)))))))),"Other"===X&&t().createElement("div",{className:e.formItem},t().createElement("div",{className:y},t().createElement("input",{className:v,type:L.type,value:j,name:"address_name",onChange:e=>{D(e.target.value)}}),t().createElement("span",{className:E},t().createElement("span",null,L.label),t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${L.showerror?k:""}`},L.errortext))),t().createElement("div",{className:o},t().createElement("span",{className:e.nccContactInfo},"Contact Details")),t().createElement("div",{className:i},Y.map(((a,r)=>t().createElement("div",{key:r,className:y},"phone"===a.name?t().createElement("input",{className:`${v} ${e.commonInput} ${e.mobileFormInputBox}`,type:a.type,required:a.required,value:a.value,name:a.name,onChange:e=>handleUserdataChange(r,e)}):t().createElement("input",{className:v,type:a.type,required:a.required,value:a.value,name:a.name,maxLength:a.maxlength,onChange:e=>handleUserdataChange(r,e)}),t().createElement("span",{className:E},t().createElement("span",null,a.label),a.required&&t().createElement("span",{className:h},"*")),t().createElement("div",{className:`${p} ${a.showerror?k:""}`},a.errortext))))),t().createElement("div",{className:m},t().createElement("input",{type:"checkbox",id:"default",name:"default",checked:K,onChange:e=>Q(e.target.checked)}),t().createElement("label",{htmlFor:"default"},"Make this my default address")),x?t().createElement("div",{className:e.deliverBtnDiv},t().createElement("button",{className:`${e.commonBtn} ${c}`,onClick:()=>{let e={is_default_address:K,name:Y[0].value,phone:Y[1].value,email:Y[2].value,address:H[0].value,area:H[1].value,city:W.value,landmark:H[2].value,area_code:P.value.toString(),country:V.value,state:R.value,address_type:"Other"==X?j:X};$(e)}},"Add Address")):t().createElement("div",{className:d},t().createElement("button",{className:`${e.commonBtn} ${c}`,onClick:()=>{let e={...w,is_default_address:K,name:Y[0].value,phone:Y[1].value,email:Y[2].value,address:H[0].value,area:H[1].value,city:W.value,landmark:H[2].value,area_code:P.value.toString(),country:V.value,state:R.value,address_type:"Other"==X?j:X};delete e._id,g(e)}},"Update Address")))))}})(),r})()));