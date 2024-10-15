export const getGlobalConfigValue = (globalConfig, id) => {
  return globalConfig?.props?.[id] ?? "";
};

export const getSocialIcon = (title) =>
  title && typeof title === "string" ? `footer-${title.toLowerCase()}` : "";

export function replaceQueryPlaceholders(queryFormat, value1, value2) {
  return queryFormat.replace("{}", value1).replace("{}", value2);
}

export const singleValuesFilters = {
  sortOn: true,
};

export const numberWithCommas = (number) => {
  let num = number;
  if (number?.toString()[0] === "-") {
    num = number.toString().substring(1);
  }

  if (num) {
    let no =
      num.toString().split(".")[0].length > 3
        ? num
            .toString()
            .substring(0, num.toString().split(".")[0].length - 3)
            .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
          "," +
          num.toString().substring(num.toString().split(".")[0].length - 3)
        : num.toString();

    if (number.toString()[0] === "-") {
      no = "-" + no;
    }
    return no;
  } else {
    return 0;
  }
};
export function isRunningOnClient() {
  if (typeof window !== "undefined") {
    return globalThis === window;
  }

  return false;
}

export function convertDate(dateString) {
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

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

export function validateEmailField(value) {
  let emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(value);
}

export function validatePhone(phoneNo) {
  const re = /^[0-9]{10}$/;
  return phoneNo && phoneNo.length && re.test(phoneNo.trim());
}

export function validatePasswordField(value) {
  let passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±])[A-Za-z\d`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±]{8,}$/;
  return passwordPattern.test(value);
}

export function checkIfNumber(value) {
  let numberPattern = /^[0-9]+$/;
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
    let str = "/" + key + "/";
    updatedUrl = url.replace(new RegExp(str), "/resize-w:" + width + "/");
  }
  try {
    let parsedUrl = new URL(updatedUrl);
    parsedUrl.searchParams.append("dpr", '1');
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
    } else {
      return false;
    }
  }
};

export const getProductImgAspectRatio = function (
  global_config,
  defaultAspectRatio = 0.8
) {
  const productImgWidth = global_config?.props?.product_img_width;
  const productImgHeight = global_config?.props?.product_img_height;
  if (productImgWidth && productImgHeight) {
    const aspectRatio = Number(productImgWidth / productImgHeight).toFixed(2);
    //@ts-expect-error
    return aspectRatio >= 0.6 && aspectRatio <= 1
      ? aspectRatio
      : defaultAspectRatio;
  }

  return defaultAspectRatio;
};

export const currencyFormat = (value, currencySymbol) => {
  if (currencySymbol && (value || value === 0)) {
    if (/^[A-Z]+$/.test(currencySymbol)) {
      return `${currencySymbol} ${value?.toLocaleString("en-IN")}`;
    }
    return `${currencySymbol}${value?.toLocaleString("en-IN")}`;
  }
  return `${value?.toLocaleString("en-IN")}`;
};

export const getReviewRatingData = function (customMeta) {
  let data = {};

  if (customMeta && customMeta.length) {
    customMeta.forEach((item) => {
      if (item["key"]) {
        data[item["key"]] = Number(item?.value || "");
      }
    });

    const avgRating = data["rating_sum"] / data["rating_count"];

    data["avg_ratings"] = Number(Number(avgRating).toFixed(1)) || 0;
  }

  return data;
};
