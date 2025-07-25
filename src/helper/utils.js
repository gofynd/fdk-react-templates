import { DEFAULT_CURRENCY_LOCALE, DEFAULT_UTC_LOCALE } from "./constant";

export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export const getGlobalConfigValue = (globalConfig, id) =>
  globalConfig?.props?.[id] ?? "";

export const getSocialIcon = (title) =>
  title && typeof title === "string" ? `footer-${title.toLowerCase()}` : "";

export function replaceQueryPlaceholders(queryFormat, value1, value2) {
  return queryFormat.replace("{}", value1).replace("{}", value2);
}

export const singleValuesFilters = {
  sortOn: true,
};

export function roundToDecimals(number, decimalPlaces = 2) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

export const numberWithCommas = (number = 0) => {
  let num = number;
  if (!isNaN(number)) num = roundToDecimals(number);
  if (num?.toString()[0] === "-") {
    num = num?.toString()?.substring(1);
  }

  if (num) {
    let no =
      num?.toString()?.split?.(".")?.[0]?.length > 3
        ? `${num
            ?.toString()
            ?.substring(0, num?.toString()?.split(".")[0].length - 3)
            ?.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${num
            ?.toString()
            ?.substring(num?.toString()?.split?.(".")?.[0]?.length - 3)}`
        : num?.toString();

    if (number?.toString()[0] === "-") {
      no = `-${no}`;
    }
    return no;
  }
  return 0;
};
export function isRunningOnClient() {
  if (typeof window !== "undefined") {
    return globalThis === window;
  }

  return false;
}

export function convertDate(dateString, locale = "en-US") {
  const date = new Date(dateString);

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };

  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

export function validateName(name) {
  const regexp = /^[a-zA-Z0-9-_'. ]+$/;
  return regexp.test(String(name).toLowerCase().trim());
}

export const convertUTCDateToLocalDate = (date, format, locale = "en-US") => {
  if (!date) {
    return "Invalid date";
  }

  if (!format) {
    format = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  }

  let parsedDate;

  try {
    // Handle different date string formats
    if (typeof date === 'string') {
      // Check if it's a partial date like "Thu, 03 Jul" without year
      if (date.match(/^[A-Za-z]{3},\s+\d{1,2}\s+[A-Za-z]{3}$/)) {
        // Add current year to make it a valid date
        const currentYear = new Date().getFullYear();
        parsedDate = new Date(`${date} ${currentYear}`);
      } 
      // Check if it's an ISO string or other standard format
      else {
        parsedDate = new Date(date);
      }
    } else {
      parsedDate = new Date(date);
    }

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date provided:', date);
      return "Invalid date";
    }

    // Convert the UTC date to the local date using toLocaleString() with specific time zone
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      ...format,
      timeZone: browserTimezone,
    };

    // Convert the UTC date and time to the desired format
    const formattedDate = parsedDate
      .toLocaleString(locale, options)
      .replace(" at ", ", ");
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error, 'Original date:', date);
    return "Invalid date";
  }
};
export function validateEmailField(value) {
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(value);
}

export function validatePhone(phoneNo) {
  const re = /^[0-9]{10}$/;
  return phoneNo && phoneNo.length && re.test(phoneNo.trim());
}

export function validatePasswordField(value) {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±])[A-Za-z\d`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±]{8,}$/;
  return passwordPattern.test(value);
}

export function checkIfNumber(value) {
  const numberPattern = /^[0-9]+$/;
  return numberPattern.test(value);
}

export const transformImage = (url, key, width) => {
  const dpr = Math.min(
    Math.max(
      Math.round(isRunningOnClient() ? window.devicePixelRatio || 1 : 1),
      1
    ),
    5
  );
  let updatedUrl = url;
  if (key && width) {
    const str = `/${key}/`;
    updatedUrl = url.replace(new RegExp(str), `/resize-w:${width}/`);
  }
  try {
    const parsedUrl = new URL(updatedUrl);
    parsedUrl.searchParams.append("dpr", 1);
    return parsedUrl.toString();
  } catch (error) {
    return updatedUrl;
  }
};

export function updateGraphQueryWithValue(mainString, replacements) {
  if (!mainString || !replacements || !Array.isArray(replacements)) {
    console.error(
      "Invalid input. Please provide a valid main string and an array of replacements."
    );
    return mainString;
  }

  // Iterate over the replacements and replace each occurrence in the main string
  replacements.forEach((replacement) => {
    const [search, replaceWith] = replacement;

    if (search && replaceWith) {
      mainString = mainString.split(search).join(replaceWith);
    } else {
      console.error(
        "Invalid replacement format. Each replacement should be an array [$search, replaceWith]."
      );
    }
  });

  return mainString;
}

export function throttle(func, wait) {
  let waiting = false;
  return function () {
    if (waiting) {
      return;
    }

    waiting = true;
    setTimeout(() => {
      func.apply(this, arguments);
      waiting = false;
    }, wait);
  };
}

export const detectMobileWidth = () => {
  if (isRunningOnClient()) {
    if (window && window.screen?.width <= 768) {
      return true;
    }
    return false;
  }
};

export const getProductImgAspectRatio = function (
  global_config,
  defaultAspectRatio = 0.8
) {
  const productImgWidth = global_config?.product_img_width;
  const productImgHeight = global_config?.product_img_height;
  if (productImgWidth && productImgHeight) {
    const aspectRatio = Number(productImgWidth / productImgHeight).toFixed(2);
    return aspectRatio >= 0.6 && aspectRatio <= 1
      ? aspectRatio
      : defaultAspectRatio;
  }

  return defaultAspectRatio;
};

export const currencyFormat = (value, currencySymbol, locale = "en-IN") => {
  const formattingLocale = `${locale}-u-nu-latn`;

  if (value != null) {
    const formattedValue = value.toLocaleString(formattingLocale);

    if (currencySymbol && /^[A-Z]+$/.test(currencySymbol)) {
      return `${currencySymbol} ${formattedValue}`;
    }

    if (currencySymbol) {
      return `${currencySymbol}${formattedValue}`;
    }

    return formattedValue;
  }

  return "";
};


export const getReviewRatingData = function (customMeta) {
  const data = {};

  if (customMeta && customMeta.length) {
    customMeta.forEach((item) => {
      if (item.key) {
        data[item.key] = Number(item?.value || "");
      }
    });

    const avgRating = data.rating_sum / data.rating_count;

    data.avg_ratings = Number(Number(avgRating).toFixed(1)) || 0;
  }

  return data;
};
export function removeCookie(name) {
  if (isRunningOnClient()) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export function getCookie(key) {
  if (isRunningOnClient()) {
    const name = key + "=";
    const decoded = decodeURIComponent(document.cookie);
    const cArr = decoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    if (!res) {
      return "";
    }
    try {
      return JSON.parse(res);
    } catch (e) {
      return res || null;
    }
  } else {
    return null;
  }
}

export function isValidPincode(value) {
  value = value.trim();
  if (value.length === 0) {
    return false;
  } else {
    let re = /^(?=.{2,11}$)[a-z0-9]+([ -]?[a-z0-9]+)*$/i;
    let testPincode = re.test(value);
    if (!testPincode) {
      return false;
    }
  }
  return true;
}

export function deepEqual(obj1, obj2) {
  // Check if both objects are the same reference
  if (obj1 === obj2) {
    return true;
  }

  // Check if both are objects and not null
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  // Get the keys of both objects
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all keys and their values are the same
  for (let key of keys1) {
    // Recursively check for nested objects
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function priceFormatCurrencySymbol(symbol, price = 0) {
  const hasAlphabeticCurrency = /^[A-Za-z]+$/.test(symbol);
  let sanitizedPrice = price;
  if (typeof price !== "string") {
    let num = price;

    if (!isNaN(price)) num = roundToDecimals(price);
    if (num?.toString()[0] === "-") {
      num = num?.toString()?.substring(1);
    }

    if (num) {
      sanitizedPrice =
        num?.toString()?.split(".")?.[0].length > 3
          ? `${num
              ?.toString()
              ?.substring(0, num?.toString()?.split(".")?.[0]?.length - 3)
              ?.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${num
              ?.toString()
              ?.substring(num?.toString()?.split?.(".")?.[0]?.length - 3)}`
          : num?.toString();
    } else {
      sanitizedPrice = 0;
    }
  }

  return `${price.toString()[0] === "-" ? "-" : ""}${
    hasAlphabeticCurrency
      ? `${symbol} ${sanitizedPrice}`
      : `${symbol}${sanitizedPrice}`
  }`;
}

export function isNumberKey(e) {
  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    return false;
  }
  return true;
}

export function isFreeNavigation(e) {
  // Ensure Delete ,Backspace , arrow keys nav.
  if (
    e.keyCode === 46 ||
    e.keyCode === 8 ||
    (e.keyCode >= 37 && e.keyCode <= 40)
  ) {
    return true;
  }

  return false;
}

const isValidLocale = (tag) => {
  try {
    new Intl.Locale(tag);
    return true;
  } catch {
    return false;
  }
};

export const formatLocale = (locale, countryCode, isCurrencyLocale = false) => {
  if ((locale === "en" || !locale) && isCurrencyLocale) {
    return DEFAULT_CURRENCY_LOCALE;
  }
  if (locale === "en" || !locale) {
    return DEFAULT_UTC_LOCALE;
  }
  const finalLocale = locale.includes("-") ? locale : `${locale}${countryCode ? "-" + countryCode : ""}`;

  return isValidLocale(finalLocale) ? finalLocale : DEFAULT_UTC_LOCALE;
};

export const translateValidationMessages = (validationObject, t) => {
  const updatedValidation = { ...validationObject };

  Object.keys(updatedValidation).forEach((key) => {
    const rule = updatedValidation[key];

    if (
      typeof rule === "object" &&
      rule.message
    ) {
      rule.message = translateDynamicLabel(rule.message, t);
    } else if (typeof rule === "string") {
      updatedValidation[key] = translateDynamicLabel(rule, t);
    }
  });

  return updatedValidation;
};
export const getAddressStr = (item, isAddressTypeAvailable) => {
  if (!item || typeof item !== "object") {
    return "";
  }
  try {
    const parts = [
      item.address || "",
      item.area || "",
      item.landmark?.length > 0 ? item.landmark : "",
      item.sector || "",
      item.city || "",
      item.state || "",
    ].filter(Boolean);

    if (isAddressTypeAvailable && item.address_type) {
      parts.unshift(item.address_type);
    }
    let addressStr = parts.join(", ");
    if (item.area_code) {
      addressStr += ` ${item.area_code}`;
    }
    if (item.country) {
      addressStr += `, ${item.country}`;
    }
    return addressStr;
  } catch (error) {
    console.error("Error constructing address string:", error);
    return "";
  }
};

export function isEmptyOrNull(obj) {
  return (
    obj === null ||
    obj === undefined ||
    (typeof obj === "object" && Object.keys(obj).length === 0)
  );
}

export function translateDynamicLabel(input, t) {
  const safeInput = input
    .toLowerCase()
    .replace(/\//g, '_') // replace slashes with underscores
    .replace(/[^a-z0-9_\s]/g, '') // remove special characters except underscores and spaces
    .trim()
    .replace(/\s+/g, '_'); // replace spaces with underscores

  const translationKey = `resource.dynamic_label.${safeInput}`;
  const translated = t(translationKey);

  return translated.split('.').pop() === safeInput ? input : translated;
}

export function getLocaleDirection(fpi) {
  const dir = fpi?.store?.getState()?.custom?.currentLocaleDetails?.direction;
  return dir || "ltr";
}