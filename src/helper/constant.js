export const SINGLE_FILTER_VALUES = {
  page_no: true,
};

export const ALL_PROFILE_MENU = [
  {
    key: "orders",
    icon: "orders",
    display: "resource.common.my_orders",
    link: "/profile/orders",
    disabled_cart: false,
  },
  {
    key: "phone",
    icon: "call",
    display: "resource.common.phone_number",
    link: "/profile/phone",
    disabled_cart: true,
  },
  {
    key: "email",
    icon: "email",
    display: "resource.common.email_address",
    link: "/profile/email",
    staff: false,
    disabled_cart: true,
  },
  {
    key: "address",
    icon: "address",
    display: "resource.common.my_address",
    link: "/profile/address",
    disabled_cart: false,
  },
];

export const GENDER_OPTIONS = [
  {
    value: "male",
    display: "resource.common.male",
  },
  {
    value: "female",
    display: "resource.common.female",
  },
  {
    value: "unisex",
    display: "resource.common.other",
  },
];

export const DATE_FILTERS = [
  {
    display: "resource.common.date_filter_options.last_30_days",
    value: 30,
    is_selected: false,
  },
  {
    display: "resource.common.date_filter_options.last_6_months",
    value: 180,
    is_selected: false,
  },
  {
    display: "resource.common.date_filter_options.last_12_months",
    value: 365,
    is_selected: false,
  },
  {
    display: "resource.common.date_filter_options.last_24_months",
    value: 730,
    is_selected: true,
  },
];

export const DEFAULT_UTC_LOCALE = "en-US";
export const DEFAULT_CURRENCY_LOCALE = "en-IN";
