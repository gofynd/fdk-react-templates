import OrdersIcon from "../assets/images/orders.svg";
import CallIcon from "../assets/images/call.svg";
import EmailIcon from "../assets/images/email.svg";
import AddressIcon from "../assets/images/address.svg";

export const SINGLE_FILTER_VALUES = {
  page_no: true,
};

export const ALL_PROFILE_MENU = [
  {
    key: "orders",
    Icon: OrdersIcon,
    display: "resource.common.my_orders",
    link: "/profile/orders",
    disabled_cart: false,
  },
  {
    key: "phone",
    Icon: CallIcon,
    display: "resource.common.phone_number",
    link: "/profile/phone",
    disabled_cart: true,
  },
  {
    key: "email",
    Icon: EmailIcon,
    display: "resource.common.email_address",
    link: "/profile/email",
    staff: false,
    disabled_cart: true,
  },
  {
    key: "address",
    Icon: AddressIcon,
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
    display: "Last 30 days",
    value: 30,
    is_selected: false,
  },
  {
    display: "Last 30 days",
    value: 90,
    is_selected: true,
  },
  {
    display: "Last 6 months",
    value: 180,
    is_selected: false,
  },
  {
    display: "Last 12 months",
    value: 365,
    is_selected: false,
  },
  {
    display: "Last 24 months",
    value: 730,
    is_selected: false,
  },
];

export const DEFAULT_UTC_LOCALE = "en-US";
export const DEFAULT_CURRENCY_LOCALE = "en-IN";
