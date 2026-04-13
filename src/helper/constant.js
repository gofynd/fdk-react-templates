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
    is_selected: true,
  },
];

/**
 * Image optimization configuration
 * Adjust these values to balance quality vs. performance
 */
export const IMAGE_OPTIMIZATION_CONFIG = {
  // Maximum DPR (Device Pixel Ratio) to support
  // 2.5 balances retina display sharpness with file size
  MAX_DPR: 2.5,
};

/**
 * Responsive image breakpoints configuration
 * Maps viewport widths to image sizes (considering DPR)
 *
 * Formula: image_width = viewport_width * target_dpr
 * Target DPR ranges from 1.3x (large screens) to 1.8x (mobile) for optimal quality
 */
export const RESPONSIVE_IMAGE_BREAKPOINTS = [
  // Desktop large (≥1440px): 1920px image (1440 * 1.33 = 1920)
  { breakpoint: { min: 1440 }, width: 1920 },
  // Laptop (≥1024px): 1600px image (1280 * 1.25 = 1600)
  { breakpoint: { min: 1024 }, width: 1600 },
  // Tablet landscape (≥768px): 1200px image (768 * 1.56 = 1200)
  { breakpoint: { min: 768 }, width: 1200 },
  // Tablet portrait (≥640px): 1000px image (640 * 1.56 = 1000)
  { breakpoint: { min: 640 }, width: 1000 },
  // Mobile large (≥480px): 800px image (480 * 1.67 = 800)
  { breakpoint: { min: 480 }, width: 800 },
  // Mobile (≥360px): 640px image (360 * 1.78 = 640)
  { breakpoint: { min: 360 }, width: 640 },
  // Mobile small (<360px): 540px image (320 * 1.69 = 540)
  { breakpoint: { max: 359 }, width: 540 },
];
