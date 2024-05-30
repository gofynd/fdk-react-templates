import React, { useEffect, useMemo } from "react";
// import { useGlobalStore } from "fdk-core/utils";
import { useNavigate } from "react-router-dom";

// import { updateGraphQueryWithValue } from "../../helper/utils";
// import { CART_DETAILS, CART_UPDATE } from "../../queries/cartQuery";
// import { FETCH_CARTCOUNT_QUERY } from "../../queries/headerQuery";
// import useSnackbar from "../../helper/hooks";
// import useHeader from "../../components/header/useHeader";

const useCart = ({fpi,useGlobalStore,useSnackbar, CART_DETAILS,CART_UPDATE,updateGraphQueryWithValue}) => {
  let CART = useGlobalStore(fpi.getters.CART);
  const COUPONS = useGlobalStore(fpi.getters.COUPONS);
  console.log(COUPONS);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { buy_now_cart_items, cart_items, cart_items_count } = CART || {};
  const {
    breakup_values,
    loading: cartItemsLoading,
    items,
    id,
  } = cart_items || {};
  const { loading: buyNowCartItemsLoading } = buy_now_cart_items || {};
  const { loading: cartItemsCountLoading } = cart_items_count || {};
  // const cartItems = cart_items_count?.user_cart_items_count?.items || [];
  useEffect(() => {
    // fpi?.cart?.getCartItems({ b: true, i: true });
    // fpi?.cart?.getShipments({ id: cart_items?.id });

    // const payload = [["$getCartId", `${cartData?.cart_id}`]];
    fpi.executeGraphQL(CART_DETAILS).then((res) => console.log(res));
  }, []);

  const cartItemsByItemId = useMemo(() => {
    if (items?.length > 0) {
      let cartitemsObj = {};
      items?.map((singleItem) => {
        if (singleItem?.key) {
          cartitemsObj[singleItem?.key] = singleItem;
        }
      });
      return cartitemsObj;
    } else {
      return {};
    }
  }, [items]);

  function refreshCart() {
    fpi.executeGraphQL(CART_DETAILS);
  }

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
    const itemQuery = {
      article_id: itemDetails?.product?.uid + "_" + itemSize,
      item_id: itemDetails?.product?.uid,
      identifiers: { identifier: itemDetails?.identifiers?.identifier },
      item_size: itemSize,
      quantity: (itemDetails?.quantity || 0) + quantity,
      parent_item_identifiers: {
        identifier: null,
        parent_item_size: null,
        parent_item_id: null,
      },
      item_index: itemIndex,
    };
    console.log("Cart", itemDetails, quantity, itemIndex, operation, itemSize);
    let callFunction;
    const payload = [
      ["$article_id", `${itemDetails?.product?.uid + "_" + itemSize}`],
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
          // setCartItemCount(res?.getItemCount?.user_cart_items_count || 0);
        }
      });
    setTimeout(() => {
      fpi.executeGraphQL(CART_DETAILS);
    }, 4000);

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
      search: `id=${cart_items_count?.user_cart_items_count?.id}`,
    });
  }

  return {
    cartItems: cartItemsByItemId,
    cartItemsWithActualIndex: items,
    breakUpValues: breakup_values,
    isLoading: false,
    updateCartItems,
    gotoCheckout,
  };
};

export default useCart;
