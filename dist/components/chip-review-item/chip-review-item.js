!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("fdk-core/components"),require("react")):"function"==typeof define&&define.amd?define("firestone",["fdk-core/components","react"],t):"object"==typeof exports?exports.firestone=t(require("fdk-core/components"),require("react")):e.firestone=t(e["fdk-core/components"],e.react)}("undefined"!=typeof self?self:this,((e,t)=>(()=>{"use strict";var r={4429:(e,t,r)=>{r.d(t,{N8:()=>currencyFormat,qC:()=>numberWithCommas});const numberWithCommas=e=>{let t=e;if("-"===e?.toString()[0]&&(t=e.toString().substring(1)),t){let r=t.toString().split(".")[0].length>3?`${t.toString().substring(0,t.toString().split(".")[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g,",")},${t.toString().substring(t.toString().split(".")[0].length-3)}`:t.toString();return"-"===e.toString()[0]&&(r=`-${r}`),r}return 0};const currencyFormat=(e,t)=>t&&(e||0===e)?/^[A-Z]+$/.test(t)?`${t} ${e?.toLocaleString("en-IN")}`:`${t}${e?.toLocaleString("en-IN")}`:`${e?.toLocaleString("en-IN")}`},7438:t=>{t.exports=e},9155:e=>{e.exports=t}},i={};function __webpack_require__(e){var t=i[e];if(void 0!==t)return t.exports;var _=i[e]={exports:{}};return r[e](_,_.exports,__webpack_require__),_.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var _={};return(()=>{__webpack_require__.r(_),__webpack_require__.d(_,{default:()=>ChipReviewItem});var e={};__webpack_require__.r(e),__webpack_require__.d(e,{DH:()=>c,oG:()=>a,Sd:()=>n,Su:()=>s,Ao:()=>o,hU:()=>m,jw:()=>l,Gz:()=>p,I$:()=>u,id:()=>d,ns:()=>v,DB:()=>f,z6:()=>b,Yr:()=>g,oo:()=>w,UK:()=>h,z7:()=>E,qk:()=>y,fz:()=>N,OJ:()=>k,au:()=>q,si:()=>S,vK:()=>$,oi:()=>M});var t=__webpack_require__(9155),r=__webpack_require__.n(t),i=__webpack_require__(7438),c="chip-review-item__bag___EdkMm",a="chip-review-item__bagBrand___gljD7",n="chip-review-item__bagItem___Zi5qJ",s="chip-review-item__bagLeft___UWOTi",o="chip-review-item__bagName____7WDg",m="chip-review-item__bagRight___ALFog",l="chip-review-item__chip___MPqlt",p="chip-review-item__chipMetaDesktop___TuCyf",u="chip-review-item__chipMetaMobile___bx_iw",d="chip-review-item__discount___JPGBO",v="chip-review-item__effectivePrice___yRH5E",f="chip-review-item__itemContainer___yE5kO",b="chip-review-item__itemSize___khtyw",g="chip-review-item__itemTotal___eRZfk",w="chip-review-item__markedPrice___OswIf",h="chip-review-item__offerApplied___QJoCx",E="chip-review-item__offersContainer___y4Eas",y="chip-review-item__outOfStock___VS1jr",N="chip-review-item__priceCntr___o6_FD",k="chip-review-item__productMetas___nU57E",q="chip-review-item__quantity___B_WUz",S="chip-review-item__quantityLabel___nx1c1",$="chip-review-item__rightItems___xD6ri",M="chip-review-item__soldBy___JoZJy",x=__webpack_require__(4429);function ChipReviewItem(e){let{item:_,articles:n}=e;const l=(0,t.useMemo)((()=>`/product/${_.product.slug}`),[_]),d=(0,t.useMemo)((()=>{if(_?.product?.images?.length&&_?.product?.images?.[0]?.url)return _.product.images[0].url.replace("original","resize-h:170,w:110")}),[_]),v=(0,t.useMemo)((()=>n.filter((e=>!0===e?.availability?.out_of_stock)).length===n.length),[n]),b=(0,t.useMemo)((()=>{const e=n.reduce(((e,t)=>e+t.price.converted.effective),0);return(0,x.N8)((0,x.qC)(e),n?.[0]?.price?.converted?.currency_symbol||"₹")}),[n]),w=(0,t.useMemo)((()=>n.reduce(((e,t)=>e+t?.quantity),0)),[n]);return r().createElement("div",{className:`${c} ${v?y:""}`},r().createElement("div",{className:f},r().createElement("div",{className:s},r().createElement(i.FDKLink,{to:l},r().createElement("img",{src:d,alt:_.product.name}))),r().createElement("div",{className:m},r().createElement("div",{className:a},_.product.brand.name),r().createElement("div",{className:o},_.product.name),r().createElement("div",{className:M},"Sold by: ",_.article.store.name+",",_.article.seller.name),r().createElement("div",{className:p},r().createElement(ChipMeta,{item:_})),r().createElement("div",{className:o},r().createElement("span",{className:g}," ",`Total: ${b}`)," ",r().createElement("span",{className:S},`( ${n.length} Size, ${w} ${w>1?"Pieces":"Piece"} )`))),r().createElement("div",{className:u},r().createElement(ChipMeta,{item:_}))))}const ChipMeta=t=>{let{item:i}=t;return r().createElement("div",{className:n},r().createElement("div",{className:l},r().createElement("div",{className:k},r().createElement("div",null,r().createElement("span",{className:b},i.article.size),r().createElement("span",{className:b},"|")),r().createElement("div",{className:N},r().createElement("span",{className:v},i?.is_set&&i?.price_per_unit?.converted?`${(0,x.N8)((0,x.qC)(i?.price_per_unit?.converted?.effective),i?.price_per_unit?.converted?.currency_symbol||"₹")}/Pcs`:i?.price?.converted?(0,x.N8)((0,x.qC)(i?.price?.converted?.effective),i?.price?.converted?.currency_symbol||"₹"):""),i?.price?.converted?.effective!==i?.price?.converted?.marked&&r().createElement("span",{className:w},i.is_set&&i?.price_per_unit?.converted?`${(0,x.N8)((0,x.qC)(i?.price_per_unit?.converted?.marked),i?.price_per_unit?.converted?.currency_symbol||"₹")}/Pcs`:i?.price?.converted?(0,x.N8)((0,x.qC)(i?.price?.converted?.marked),i?.price?.converted?.currency_symbol||"₹"):"")),r().createElement("div",{className:e.discountCntr},r().createElement("span",{className:d},i.article.discount))),r().createElement("div",{className:$},r().createElement("div",{className:q},r().createElement("span",null,`${i?.quantity} ${i.quantity>1?"Pieces":"Piece"}`)))),i?.availability?.out_of_stock&&r().createElement("div",{className:y},i.message),i?.coupon_message&&r().createElement("div",{className:E},r().createElement("span",{className:h},i.coupon_message)),i.bulk_message&&r().createElement("div",{className:E},r().createElement("span",{className:h},i.bulk_message)))}})(),_})()));