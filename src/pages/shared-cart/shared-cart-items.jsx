import React from "react";
import * as styles from "./shared-cart.less";
import ChipReviewItem from "../../components/chip-review-item/chip-review-item";

const SharedCartItems = ({ bagItems = [] }) => {
  return (
    <div className={styles.itemContainer}>
      {bagItems.map((item, index) => (
        <ChipReviewItem key={index} item={item.item} articles={item.articles} />
      ))}
    </div>
  );
};

export default SharedCartItems;
