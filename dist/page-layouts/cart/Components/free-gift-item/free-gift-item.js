!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define("firestone",["react"],t):"object"==typeof exports?exports.firestone=t(require("react")):e.firestone=t(e.react)}("undefined"!=typeof self?self:this,(e=>(()=>{"use strict";var t={4429:(e,t,r)=>{r.d(t,{N8:()=>currencyFormat,qC:()=>numberWithCommas});const numberWithCommas=e=>{let t=e;if(isNaN(e)||(t=function roundToDecimals(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;const r=Math.pow(10,t);return Math.round(e*r)/r}(e)),"-"===t?.toString()[0]&&(t=t.toString().substring(1)),t){let r=t.toString().split(".")[0].length>3?`${t.toString().substring(0,t.toString().split(".")[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g,",")},${t.toString().substring(t.toString().split(".")[0].length-3)}`:t.toString();return"-"===e.toString()[0]&&(r=`-${r}`),r}return 0};const currencyFormat=(e,t)=>t&&(e||0===e)?/^[A-Z]+$/.test(t)?`${t} ${e?.toLocaleString("en-IN")}`:`${t}${e?.toLocaleString("en-IN")}`:`${e?.toLocaleString("en-IN")}`},9155:t=>{t.exports=e}},r={};function __webpack_require__(e){var _=r[e];if(void 0!==_)return _.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,__webpack_require__),i.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var _={};return(()=>{__webpack_require__.r(_),__webpack_require__.d(_,{default:()=>free_gift_item});var e=__webpack_require__(9155),t=__webpack_require__.n(e),r=__webpack_require__(4429);const free_gift_item=e=>{let{item:_,currencySymbol:i="₹"}=e;return t().createElement(t().Fragment,null,_?.promotions_applied?.map((e=>"free_gift_items"===e?.promotion_type&&t().createElement("div",{className:"free-gift-item__freeArticleContainer___wFbcr "+(1===e?.applied_free_articles.length?"free-gift-item__singleCol___tUj4i":""),key:e.promo_id},t().createElement("h6",{className:"free-gift-item__freeArticleTitle___njjab"},`${e?.applied_free_articles?.length} free gift added`),e?.applied_free_articles.map(((e,_)=>{const{item_images_url:a,item_name:n,item_price_details:o}=e?.free_gift_item_details||{},f=a?.[0]?.replace("original","resize-w:50")||"";return t().createElement("div",{className:"free-gift-item__freeGiftItem___N40YK",key:e?.article_id+_},f&&t().createElement("img",{className:"free-gift-item__freeGiftItemImage___sEzSU",src:f,alt:n}),t().createElement("div",{className:"free-gift-item__freeGiftItemDetails___WWh4P"},t().createElement("div",{className:"free-gift-item__freeGiftItemName___lzgRb"},n),t().createElement("div",{className:"free-gift-item__freeGiftItemPrice___YHjTW"},t().createElement("span",{className:"free-gift-item__freeGiftItemFreeLabel___gzzsm"},"FREE"),o?.effective?.max&&t().createElement("span",{className:"free-gift-item__freeGiftItemFreeEffective___f4PM8"},(0,r.N8)((0,r.qC)(o?.effective?.max),i)))))}))))))}})(),_})()));