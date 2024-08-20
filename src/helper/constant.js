export const SINGLE_FILTER_VALUES = {
  page_no: true,
};

export const ALL_PROFILE_MENU = [
  {
    key: "orders",
    icon: "orders",
    display: "My Orders",
    link: "/profile/orders",
    disabled_cart: false,
  },
  {
    key: "phone",
    icon: "call",
    display: "Phone Number",
    link: "/profile/phone",
    disabled_cart: true,
  },
  {
    key: "email",
    icon: "email",
    display: "Email Address",
    link: "/profile/email",
    staff: false,
    disabled_cart: true,
  },
  {
    key: "address",
    icon: "address",
    display: "My Address",
    link: "/profile/address",
    disabled_cart: false,
  },
  {
    key: "card",
    icon: "card",
    display: "My Cards",
    link: "/profile/my-cards",
    disabled_cart: false,
  },
  {
    key: "reward_points",
    icon: "refernearn",
    display: "Refer and Earn",
    link: "/profile/refer-earn",
    disabled_cart: false,
  },
];

export const GENDER_OPTIONS = [
  {
    value: "male",
    display: "Male",
  },
  {
    value: "female",
    display: "Female",
  },
  {
    value: "unisex",
    display: "Other",
  },
];