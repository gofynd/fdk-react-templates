# B2B Mobile Size Selector

Presentational building blocks for a Blinkit-style mobile PDP. They hold no cart logic; the theme supplies data and callbacks. All three are visible on tablet/mobile only (`@tablet`, max-width 768px).

| Component | Import | Purpose |
| --- | --- | --- |
| `SizeScroller` | `components/b2b-mobile-size-selector/size-scroller` | Horizontally scrollable size cards with an in-cart quantity badge. |
| `StickyQtyBar` | `components/b2b-mobile-size-selector/sticky-qty-bar` | Price on the left; "Add to cart" or the quantity controller on the right. |
| `FloatingViewCart` | `components/b2b-mobile-size-selector/floating-view-cart` | Floating "View cart" pill. |

## SizeScroller props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `""` | Heading above the cards. |
| `sizes` | `{ value, display, priceLabel, mrpLabel, discountLabel, quantity, isSelected, disabled }[]` | `[]` | Sizes to render. |
| `onSelect` | `function(size)` | `() => {}` | Called when a card is clicked. |
| `className` | string | `""` | Extra container class. |

## StickyQtyBar props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `""` | Active size label. |
| `priceLabel` / `mrpLabel` / `taxLabel` | string | `""` | Formatted price, strikethrough MRP and helper text. |
| `quantity` | number | `0` | When greater than 0 the quantity controller replaces the button. |
| `addToCartLabel` | string | `"Add to cart"` | Button label. |
| `onAddToCart` | `function(event)` | `() => {}` | Add-to-cart click handler. |
| `disabled` | boolean | `false` | Disables the button. |
| `isCartUpdating` | boolean | `false` | Loading state. |
| `quantityControlProps` | object | `{}` | Forwarded to `B2BSizeQuantityControl`. |

## FloatingViewCart props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `imageUrl` | string | `""` | Thumbnail. |
| `itemCount` | number | `0` | Renders nothing when 0. |
| `label` / `itemsLabel` | string | `"View cart"` / `"<n> Items"` | Labels. |
| `onClick` | `function` | `() => {}` | Click handler. |
| `disabled` | boolean | `false` | Disables the pill. |

## Example

```jsx
import SizeScroller from "fdk-react-templates/components/b2b-mobile-size-selector/size-scroller";
import "fdk-react-templates/components/b2b-mobile-size-selector/size-scroller.css";
```
