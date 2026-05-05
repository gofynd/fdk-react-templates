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

  // Use browser's local timezone with fallback to UTC
  const browserTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: browserTimezone,
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
    // console.log("ℹ️ No format provided. Using default format →", format);
  }

  let parsedDate;

  try {
    if (typeof date === "string") {
      // console.log("🔍 Input is a string. Checking for partial format...");

      if (date.match(/^[A-Za-z]{3},\s+\d{1,2}\s+[A-Za-z]{3}$/)) {
        const currentYear = new Date().getFullYear();
        // console.log("📆 Detected partial format. Using current year:", currentYear);
        parsedDate = new Date(`${date} ${currentYear}`);
        // console.log("📆 Parsed partial date →", parsedDate.toISOString());
      } else {
        parsedDate = new Date(date);
        // console.log("📆 Parsed ISO/standard string date →", parsedDate.toISOString());
      }
    } else {
      parsedDate = new Date(date);
      // console.log("📆 Parsed Date object or timestamp →", parsedDate.toISOString());
    }

    if (isNaN(parsedDate.getTime())) {
      // console.error("❌ Invalid date after parsing →", parsedDate);
      return "Invalid date";
    }

    const browserTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    // console.log("🌐 Detected browser time zone →", browserTimezone);

    const options = {
      ...format,
      timeZone: browserTimezone,
    };
    // console.log("🛠️ Formatting options →", options);

    const formattedDate = parsedDate
      .toLocaleString(locale, options)
      .replace(" at ", ", ");

    // console.log("✅ Final formatted date →", formattedDate);
    return formattedDate;
  } catch (error) {
    // console.error("❗ Error formatting date:", error, "Original input →", date);
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

/**
 * Map currency code to appropriate locale for number formatting
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'AED', 'INR')
 * @returns {string} Locale string appropriate for the currency
 */
export const getLocaleFromCurrency = (currencyCode) => {
  if (!currencyCode) return "en-US";

  // Normalize currency code to uppercase for case-insensitive matching
  const normalizedCode = currencyCode.toUpperCase();

  const currencyLocaleMap = {
    USD: "en-US", // United States
    AED: "en-AE", // United Arab Emirates
    SAR: "ar-SA", // Saudi Arabia
    GBP: "en-GB", // United Kingdom
    EUR: "en-US", // Europe (using en-US as standard international format)
    INR: "en-IN", // India
    // Add more currency mappings as needed
  };

  return currencyLocaleMap[normalizedCode] || "en-US"; // Default to en-US for unknown currencies
};

/**
 * Format currency value with locale-aware number formatting
 * Uses native Intl.NumberFormat for optimal performance
 * @param {number|string} value - The numeric value to format
 * @param {string} currencySymbol - Currency symbol (e.g., '₹', 'AED', 'USD')
 * @param {string} locale - Locale string (e.g., 'en-IN' for India, 'en-AE' for UAE)
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'AED', 'INR') - used to override locale if provided
 * @returns {string} Formatted currency string
 */
export const currencyFormat = (
  value,
  currencySymbol,
  locale = "en-IN",
  currencyCode = null
) => {
  if (value == null || value === "") {
    return "";
  }

  // Convert to number if it's a string
  let num = typeof value === "string" ? parseFloat(value) : value;

  // Ensure it's a number, not NaN
  if (Number.isNaN(num)) {
    return "";
  }

  // Convert to number explicitly to handle edge cases
  num = Number(num);
  if (Number.isNaN(num)) {
    return "";
  }

  // If currency code is provided, use it to determine locale
  let finalLocale = locale;
  if (currencyCode) {
    finalLocale = getLocaleFromCurrency(currencyCode);
  }

  // Ensure locale is valid, fallback to en-IN if not
  if (!finalLocale || finalLocale === "en" || finalLocale === "") {
    finalLocale = "en-IN";
  }

  // Determine if we should use Indian numbering system
  const isIndianLocale =
    finalLocale === "en-IN" || finalLocale?.startsWith("en-IN");

  try {
    // Use Intl.NumberFormat for locale-aware formatting
    const numberingSystem = isIndianLocale ? "latn" : undefined;
    const localeString = numberingSystem
      ? `${finalLocale}-u-nu-${numberingSystem}`
      : finalLocale;

    const formatter = new Intl.NumberFormat(localeString, {
      maximumFractionDigits: 20,
      useGrouping: true,
    });

    const formattedValue = formatter.format(num);

    // Handle currency symbol placement
    let finalResult;
    if (currencySymbol) {
      // For alphabetic currency codes (like AED, USD), add space
      if (/^[A-Z]+$/.test(currencySymbol)) {
        finalResult = `${currencySymbol} ${formattedValue}`;
      } else {
        // For symbol currencies (like ₹), no space
        finalResult = `${currencySymbol}${formattedValue}`;
      }
    } else {
      finalResult = formattedValue;
    }

    return finalResult;
  } catch (error) {
    // Fallback to basic formatting if locale is invalid
    console.warn(
      `Invalid locale "${finalLocale}", falling back to default formatting`
    );
    const formattedValue = num.toLocaleString("en-US");
    if (currencySymbol && /^[A-Z]+$/.test(currencySymbol)) {
      return `${currencySymbol} ${formattedValue}`;
    }
    if (currencySymbol) {
      return `${currencySymbol}${formattedValue}`;
    }
    return formattedValue;
  }
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

/**
 * Format price with currency symbol using locale-aware number formatting
 * Uses native Intl.NumberFormat for optimal performance
 * @param {string} symbol - Currency symbol (e.g., '₹', 'AED', 'USD')
 * @param {number|string} price - The price value to format
 * @param {string} locale - Locale string (e.g., 'en-IN' for India, 'en-AE' for UAE)
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'AED', 'INR') - used to override locale if provided
 * @returns {string} Formatted price string with currency symbol
 */
export function priceFormatCurrencySymbol(
  symbol,
  price = 0,
  locale = "en-IN",
  currencyCode = null
) {
  if (price == null || price === "") return "";

  // Convert to number if it's a string
  let num = typeof price === "string" ? parseFloat(price) : price;

  if (Number.isNaN(num)) return "";

  // Round to 2 decimal places
  num = roundToDecimals(num, 2);

  // If currency code is provided, use it to determine locale
  let finalLocale = locale;
  if (currencyCode) {
    finalLocale = getLocaleFromCurrency(currencyCode);
  }

  // Determine if we should use Indian numbering system
  const isIndianLocale =
    finalLocale === "en-IN" || finalLocale?.startsWith("en-IN");

  try {
    // Use Intl.NumberFormat for locale-aware formatting
    const numberingSystem = isIndianLocale ? "latn" : undefined;
    const localeString = numberingSystem
      ? `${finalLocale}-u-nu-${numberingSystem}`
      : finalLocale;

    const formatter = new Intl.NumberFormat(localeString, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    });

    const formattedPrice = formatter.format(num);
    const hasAlphabeticCurrency = /^[A-Za-z]+$/.test(symbol);

    // Handle currency symbol placement
    let finalResult;
    if (hasAlphabeticCurrency) {
      finalResult = `${symbol} ${formattedPrice}`;
    } else {
      finalResult = `${symbol}${formattedPrice}`;
    }

    return finalResult;
  } catch {
    // Fallback to basic formatting if locale is invalid
    console.warn(
      `Invalid locale "${finalLocale}", falling back to default formatting`
    );
    const formattedPrice = num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const hasAlphabeticCurrency = /^[A-Za-z]+$/.test(symbol);
    if (hasAlphabeticCurrency) {
      return `${symbol} ${formattedPrice}`;
    }
    return `${symbol}${formattedPrice}`;
  }
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
  const finalLocale = locale.includes("-")
    ? locale
    : `${locale}${countryCode ? "-" + countryCode : ""}`;

  return isValidLocale(finalLocale) ? finalLocale : DEFAULT_UTC_LOCALE;
};

export const translateValidationMessages = (validationObject, t) => {
  const updatedValidation = { ...validationObject };

  Object.keys(updatedValidation).forEach((key) => {
    const rule = updatedValidation[key];

    if (typeof rule === "object" && rule.message) {
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
      // Handle country as object or string
      const countryStr =
        typeof item.country === "object"
          ? item.country.display_name ||
            item.country.name ||
            item.country.uid ||
            ""
          : item.country;
      if (countryStr) {
        addressStr += `, ${countryStr}`;
      }
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
  // Early return for null, undefined, or non-string types
  if (input == null || typeof input !== "string") {
    return "";
  }

  // Handle empty string
  const trimmedInput = input.trim();
  if (trimmedInput === "") {
    return "";
  }

  try {
    const safeInput = trimmedInput
      .toLowerCase()
      .replace(/\//g, "_") // replace slashes with underscores
      .replace(/[^a-z0-9_\s]/g, "") // remove special characters except underscores and spaces
      .trim()
      .replace(/\s+/g, "_"); // replace spaces with underscores

    if (!safeInput) {
      return trimmedInput;
    }

    const translationKey = `resource.dynamic_label.${safeInput}`;
    const translated = t(translationKey);

    return translated.split(".").pop() === safeInput
      ? trimmedInput
      : translated;
  } catch (error) {
    console.warn("Error in translateDynamicLabel:", error);
    return typeof input === "string" ? input : "";
  }
}

export function getLocaleDirection(fpi) {
  const dir = fpi?.store?.getState()?.custom?.currentLocaleDetails?.direction;
  return dir || "ltr";
}
export function injectScript(script) {
  let scriptObject = {
    src: script,
  };

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptObject.src;

    // Resolve promise when script is loaded
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${script.src}`));
    };

    document.body.appendChild(script);
  });
}

export const getAddressFromComponents = (components, name) => {
  const typeToName = Object.fromEntries(
    components.flatMap(({ long_name, short_name, types }) =>
      types.map((type) => [type, { short_name, long_name }])
    )
  );

  const address = [
    name,
    // Add premise (building name) if present from Google Maps components
    typeToName["premise"]?.long_name || null,
    typeToName["street_number"]?.long_name || null,
    typeToName["route"]?.long_name || null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    address: address || null,
    area: typeToName["sublocality_level_2"]?.long_name || null,
    landmark: typeToName["sublocality_level_1"]?.long_name || null,
    city: typeToName["locality"]?.long_name || null,
    state: typeToName["administrative_area_level_1"]?.long_name || null,
    area_code: typeToName["postal_code"]?.long_name || null,
    country: typeToName["country"]?.long_name || null,
    country_iso_code: typeToName["country"]?.short_name || null,
  };
};

/**
 * Extract user's full name from user object
 * @param {Object} user - User object
 * @returns {string} Full name or empty string
 */
export const getUserFullName = (user) => {
  if (!user) return "";

  const { first_name, last_name } = user;
  if (first_name && last_name) {
    return `${first_name} ${last_name}`.trim();
  }
  return first_name || last_name || "";
};

/**
 * Extract primary phone number from user object
 * @param {Object} user - User object
 * @returns {Object} Phone object with mobile and countryCode or null
 */
export const getUserPrimaryPhone = (user) => {
  if (!user || !user.phone_numbers || !Array.isArray(user.phone_numbers)) {
    return null;
  }

  const primaryPhone = user.phone_numbers.find((phone) => phone.primary);
  if (!primaryPhone) return null;

  const countryCode = primaryPhone.country_code?.toString() || "91";
  const mobile = primaryPhone.phone || "";

  return {
    mobile,
    countryCode,
  };
};

/**
 * Extract primary email from user object
 * @param {Object} user - User object
 * @returns {string} Primary email or empty string
 */
export const getUserPrimaryEmail = (user) => {
  if (!user || !user.emails || !Array.isArray(user.emails)) {
    return "";
  }

  const primaryEmail = user.emails.find((email) => email.primary);
  return primaryEmail?.email || "";
};

/**
 * Extract all user data needed for address form autofill
 * @param {Object} user - User object
 * @param {boolean} isGuestUser - Whether user is guest
 * @returns {Object} Autofill data or empty object
 */
export const getUserAutofillData = (user, isGuestUser = false) => {
  if (!user || isGuestUser) {
    return {};
  }

  return {
    name: getUserFullName(user),
    phone: getUserPrimaryPhone(user),
    email: getUserPrimaryEmail(user),
  };
};

export const getConfigFromProps = (props) => {
  if (!props || typeof props !== "object") {
    return {};
  }

  // Handle array of prop objects with type and value
  if (Array.isArray(props)) {
    const config = {};
    props.forEach((prop) => {
      if (
        prop &&
        typeof prop === "object" &&
        prop.id &&
        prop.value !== undefined
      ) {
        config[prop.id] = prop.value;
      }
    });
    return config;
  }

  // Handle object with nested props structure (like blogConfig)
  if (props && typeof props === "object") {
    const config = {};
    Object.keys(props).forEach((key) => {
      const prop = props[key];
      if (prop && typeof prop === "object" && prop.value !== undefined) {
        config[key] = prop.value;
      } else if (prop && typeof prop === "object" && prop.type !== undefined) {
        // Handle case where prop has type but no value
        config[key] = prop.value || prop;
      } else if (prop !== undefined) {
        config[key] = prop;
      }
    });
    return config;
  }

  // Handle direct object props
  return props;
};

export const formatDeliveryAddress = (d = {}) => {
  const line1 = [d.address, d.area].filter(Boolean).join(" ").trim();
  const line2 = d.landmark?.trim() || "";
  const line3 = [d.city, [d.state, d.pincode].filter(Boolean).join(" ")].filter(Boolean).join(", ").trim();
  const line4 = d.country?.trim() || "";

  return [line1, line2, line3, line4].filter(Boolean).join(",\n");
};

export const truncateName = (name,length) => {
  if (!name) return "";
  return name.length > length ? name.slice(0, length) + "..." : name;
};