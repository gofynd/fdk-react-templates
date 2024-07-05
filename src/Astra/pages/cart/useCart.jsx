import React, { useEffect, useMemo, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useNavigate } from "react-router-dom";

import { updateGraphQueryWithValue } from "../../helper/utils";
import {
  CART_DETAILS,
  CART_UPDATE,
  APPLY_COUPON,
  REMOVE_COUPON,
  CART_META_UPDATE,
} from "../../queries/cartQuery";
import { FETCH_CARTCOUNT_QUERY } from "../../queries/headerQuery";
import useSnackbar from "../../helper/hooks";
// import useHeader from "../../components/header/useHeader";

const useCart = (fpi) => {
  const CART = useGlobalStore(fpi.getters.CART);
  const coupons = useGlobalStore(fpi.getters.COUPONS);
  const appFeatures = useGlobalStore(fpi.getters.APP_FEATURES);
  // const { cartItemCount } = useHeader(fpi);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { buy_now_cart_items, cart_items, cart_items_count } = CART || {};
  const {
    breakup_values,
    loading: cartItemsLoading,
    items,
    id: cartId,
  } = cart_items || {};
  const { loading: buyNowCartItemsLoading } = buy_now_cart_items || {};
  const { loading: cartItemsCountLoading } = cart_items_count || {};

  // const cartItems = cart_items_count?.user_cart_items_count?.items || [];
  useEffect(() => {
    setIsLoading(true);
    // fpi?.cart?.getCartItems({ b: true, i: true });
    // fpi?.cart?.getShipments({ id: cart_items?.id });

    const payload = [["$areaCode", ` `]];
    fpi
      .executeGraphQL(updateGraphQueryWithValue(CART_DETAILS, payload))
      .then((res) => setIsLoading(false));
  }, []);

  const cartItemsByItemId = useMemo(() => {
    if (items?.length > 0) {
      const cartitemsObj = {};
      items?.map((singleItem) => {
        if (singleItem?.key) {
          cartitemsObj[singleItem?.key] = singleItem;
        }
      });
      return cartitemsObj;
    }
    return {};
  }, [items]);

  function updateCartItems(
    event,
    itemDetails,
    itemSize,
    quantity,
    itemIndex,
    operation
  ) {
    if (event) {
      event.stopPropagation();
    }
    const payload = [
      ["$article_id", `${`${itemDetails?.product?.uid}_${itemSize}`}`],
      ["$item_id", `${itemDetails?.product?.uid}`],
      ["$item_size", `${itemSize}`],
      ["$identifier", `${itemDetails?.identifiers?.identifier}`],
      ["$item_index", `${itemIndex}`],
      ["$quantity", `${(itemDetails?.quantity || 0) + quantity}`],
      ["$operation", `${operation}`],
    ];
    fpi
      .executeGraphQL(updateGraphQueryWithValue(CART_UPDATE, payload), null)
      .then((res) => {
        if (res?.updateCart?.success) {
          showSnackbar(
            res?.updateCart?.message || "Cart is updated",
            "success"
          );
        }
      });

    // if (operation === "update_item") {
    //   fpi?.cart?.updateCartItems({ items: [itemQuery] }).then((res) => {
    //     if (res.payload.success) {
    //       // fpi?.cart?.getCartItems({ b: true, i: true });
    //       fpi.cart.getCartItemsCount();
    //     }
    //   });
    // } else if (operation === "remove_item") {
    //   fpi?.cart?.removeCartItem({ items: [itemQuery] }).then((res) => {
    //     if (res.payload.success) {
    //       // fpi?.cart?.getCartItems({ b: true, i: true });
    //       fpi.cart.getCartItemsCount();
    //     }
    //   });
    // }
  }
  function gotoCheckout() {
    // console.log(cart_items?.id);
    // navigate("/cart/checkout");
    navigate({
      pathname: "/cart/checkout",
      search: `id=${cart_items?.id}`,
    });
  }

  const applyCoupon = (couponCode) => {
    const payload = [
      ["$couponCode", `${couponCode}`],
      ["$cartId", `${cartId}`],
    ];
    fpi.executeGraphQL(updateGraphQueryWithValue(APPLY_COUPON, payload), null);
  };

  const removeCoupon = (couponId) => {
    const payload = [["$removeCouponId", `${couponId}`]];
    fpi.executeGraphQL(updateGraphQueryWithValue(REMOVE_COUPON, payload), null);
  };

  const updateComment = (comment) => {
    const cartMetaRequestInput = `{comment: "${comment}"}`;
    const payload = [
      ["$cartMetaRequestInput", `${cartMetaRequestInput}`],
      ["$cartId", `${cartId}`],
    ];
    fpi.executeGraphQL(
      updateGraphQueryWithValue(CART_META_UPDATE, payload),
      null
    );
  };

  const applyGST = (gstin) => {
    const cartMetaRequestInput = `{gstin: "${gstin}"}`;
    const payload = [
      ["$cartMetaRequestInput", `${cartMetaRequestInput}`],
      ["$cartId", `${cartId}`],
    ];
    return fpi.executeGraphQL(
      updateGraphQueryWithValue(CART_META_UPDATE, payload),
      null
    );
  };

  const removeGST = () => {
    const cartMetaRequestInput = '{gstin: ""}';
    const payload = [
      ["$cartMetaRequestInput", `${cartMetaRequestInput}`],
      ["$cartId", `${cartId}`],
    ];
    return fpi.executeGraphQL(
      updateGraphQueryWithValue(CART_META_UPDATE, payload),
      null
    );
  };

  return {
    cartData: cart_items,
    cartItems: cartItemsByItemId,
    cartItemsWithActualIndex: items,
    breakUpValues: breakup_values,
    cartItemCount: 0,
    coupons,
    appFeatures,
    isLoading: false,
    updateCartItems,
    gotoCheckout,
    applyCoupon,
    removeCoupon,
    updateComment,
    applyGST,
    removeGST,
  };
};

export default useCart;
