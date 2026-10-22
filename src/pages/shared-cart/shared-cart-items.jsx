import React from "react";
import * as styles from "./shared-cart.less";
import ChipReviewItem from "../../components/chip-review-item/chip-review-item";
import FreeGiftItem from "../../page-layouts/cart/Components/free-gift-item/free-gift-item";

const SharedCartItems = ({ bagItems = [] }) => {
  return (
    <div className={styles.itemContainer}>
      {bagItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChipReviewItem item={item.item} articles={item.articles} />
          <FreeGiftItem
            item={item.item}
            currencySymbol={
              item?.item?.price?.converted?.currency_symbol ?? "₹"
            }
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default SharedCartItems;
