// export const CART_DETAILS = `mutation GetCart {
//     getCart(b: true, i: true, buy_now: false) {
//       applied_promo_details {
//         amount
//         applied_free_articles {
//           article_id
//           free_gift_item_details {
//             item_brand_name
//             item_id
//             item_images_url
//             item_name
//             item_price_details
//             item_slug
//           }
//           parent_item_identifier
//           quantity
//         }
//         article_quantity
//         buy_rules {
//           cart_conditions
//           item_criteria
//         }
//         discount_rules {
//           item_criteria
//           matched_buy_rules
//           offer
//           raw_offer
//         }
//         mrp_promotion
//         offer_text
//         ownership {
//           payable_by
//           payable_category
//         }
//         promo_id
//         promotion_group
//         promotion_name
//         promotion_type
//       }
//       breakup_values {
//         coupon {
//           coupon_code
//           coupon_type
//           coupon_value
//           coupon_description
//           is_valid
//           is_applied
//           discount
//           maximum_discount_value
//           message
//           minimum_cart_value
//           coupon_subtitle
//           coupon_title
//           cashback_amount
//           cashback_message_primary
//           cashback_message_secondary
//           coupon_id
//         }
//         display {
//           currency_code
//           currency_symbol
//           display
//           key
//           message
//           value
//         }
//         loyalty_points {
//           applicable
//           description
//           is_applied
//           total
//         }
//         raw {
//           cod_charge
//           convenience_fee
//           promotion
//           coupon
//           delivery_charge
//           discount
//           fynd_cash
//           gift_card
//           gst_charges
//           mop_total
//           mrp_total
//           subtotal
//           total
//           vog
//           you_saved
//           total_charge
//         }
//       }
//       buy_now
//       checkout_mode
//       comment
//       coupon_text
//       currency {
//         code
//         symbol
//       }
//       delivery_charge_info
//       delivery_promise {
//         formatted {
//           max
//           min
//         }
//         timestamp {
//           max
//           min
//         }
//         iso {
//           max
//           min
//         }
//       }
//       gstin
//       id
//       is_valid
//       items {
//         article {
//           _custom_json
//           cart_item_meta
//           extra_meta
//           gift_card
//           identifier
//           is_gift_visible
//           meta
//           mto_quantity
//           parent_item_identifiers
//           price {
//             base {
//               currency_code
//               currency_symbol
//               effective
//               marked
//             }
//             converted {
//               currency_code
//               currency_symbol
//               effective
//               marked
//             }
//           }
//           product_group_tags
//           quantity
//           seller {
//             name
//             uid
//           }
//           seller_identifier
//           size
//           store {
//             name
//             store_code
//             uid
//           }
//           type
//           uid
//         }
//         availability {
//           available_sizes {
//             display
//             is_available
//             value
//           }
//           deliverable
//           is_valid
//           other_store_quantity
//           out_of_stock
//           sizes
//         }
//         bulk_offer
//         coupon {
//           code
//           discount_single_quantity
//           discount_total_quantity
//         }
//         coupon_message
//         custom_order
//         delivery_promise {
//           formatted {
//             max
//             min
//           }
//           timestamp {
//             max
//             min
//           }
//         }
//         discount
//         identifiers {
//           identifier
//         }
//         is_set
//         key
//         message
//         moq
//         parent_item_identifiers
//         price {
//           base {
//             add_on
//             currency_code
//             currency_symbol
//             effective
//             marked
//             selling
//           }
//           converted {
//             add_on
//             currency_code
//             currency_symbol
//             effective
//             marked
//             selling
//           }
//         }
//         price_per_unit {
//           base {
//             add_on
//             currency_code
//             currency_symbol
//             effective
//             marked
//             selling_price
//           }
//           converted {
//             add_on
//             currency_code
//             currency_symbol
//             effective
//             marked
//             selling_price
//           }
//         }
//         product {
//           _custom_json
//           action {
//             query {
//               product_slug
//             }
//             type
//             url
//           }
//           brand {
//             name
//             uid
//           }
//           categories {
//             name
//             uid
//           }
//           images {
//             aspect_ratio
//             secure_url
//             url
//           }
//           item_code
//           name
//           slug
//           tags
//           teaser_tag {
//             tags
//           }
//           type
//           uid
//           attributes
//         }
//         promo_meta {
//           message
//         }
//         promotions_applied {
//           amount
//           article_quantity
//           mrp_promotion
//           offer_text
//           promo_id
//           promotion_group
//           promotion_name
//           promotion_type
//         }
//         quantity
//         charges {
//           meta
//           amount {
//             value
//             currency
//           }
//           name
//           allow_refund
//           code
//           type
//         }
//         product_ean_id
//       }
//       last_modified
//       message
//       pan_config
//       pan_no
//       payment_selection_lock {
//         default_options
//         enabled
//         payment_identifier
//       }
//       restrict_checkout
//     }
//   }`;

export const CART_DETAILS = `query Cart {
  cart(includeBreakup:true, includeAllItems: true) {
    applied_promo_details {
      amount
      applied_free_articles {
        article_id
        free_gift_item_details {
          item_brand_name
          item_id
          item_images_url
          item_name
          item_price_details
          item_slug
        }
        parent_item_identifier
        quantity
      }
      article_quantity
      buy_rules {
        cart_conditions
        item_criteria
      }
      discount_rules {
        item_criteria
        matched_buy_rules
        offer
        raw_offer
      }
      mrp_promotion
      offer_text
      ownership {
        payable_by
        payable_category
      }
      promo_id
      promotion_group
      promotion_name
      promotion_type
    }
    breakup_values {
      coupon {
        coupon_code
        coupon_type
        coupon_value
        coupon_description
        is_valid
        is_applied
        discount
        maximum_discount_value
        message
        minimum_cart_value
        coupon_subtitle
        coupon_title
        cashback_amount
        cashback_message_primary
        cashback_message_secondary
        coupon_id
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
      }
      raw {
        cod_charge
        convenience_fee
        promotion
        coupon
        delivery_charge
        discount
        fynd_cash
        gift_card
        gst_charges
        mop_total
        mrp_total
        subtotal
        total
        vog
        you_saved
        total_charge
      }
    }
    buy_now
    cart_id
    checkout_mode
    comment
    coupon {
      cashbackAmount
      cashbackMessagePrimary
      cashbackMessageSecondary
      couponCode
      couponDescription
      couponId
      couponSubtitle
      couponTitle
      couponType
      couponValue
      discount
      isApplied
      isValid
      maximumDiscountValue
      message
      minimumCartValue
    }
    common_config {
      deliveryChargesConfig {
        charges {
          charges
          threshold
        }
        enabled
      }
      delivery_charges_config {
        enabled
      }
    }
    coupon_text
    currency {
      code
      symbol
    }
    delivery_charge_info
    delivery_promise {
      formatted {
        max
        min
      }
      timestamp {
        max
        min
      }
    }
    gstin
    id
    is_valid
    items {
      article {
        _custom_json
        cart_item_meta
        extra_meta
        gift_card
        identifier
        is_gift_visible
        meta
        mto_quantity
        parent_item_identifiers
        price {
          base {
            currency_code
            currency_symbol
            effective
            marked
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
          }
        }
        product_group_tags
        quantity
        seller {
          name
          uid
        }
        seller_identifier
        size
        store {
          name
          store_code
          uid
        }
        type
        uid
      }
      availability {
        available_sizes {
          display
          is_available
          value
        }
        deliverable
        is_valid
        other_store_quantity
        out_of_stock
        sizes
      }
      bulk_offer
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      coupon_message
      custom_order
      discount
      identifiers {
        identifier
      }
      is_set
      key
      message
      moq
      parent_item_identifiers
      price {
        base {
          add_on
          currency_code
          currency_symbol
          effective
          marked
          selling
        }
        converted {
          add_on
          currency_code
          currency_symbol
          effective
          marked
          selling
        }
      }
      price_per_unit {
        base {
          add_on
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
        converted {
          add_on
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
      }
      product {
        _custom_json
        action {
          query {
            product_slug
          }
          type
          url
        }
        brand {
          name
          uid
        }
        categories {
          name
          uid
        }
        images {
          aspect_ratio
          secure_url
          url
        }
        item_code
        name
        slug
        tags
        teaser_tag {
          tags
        }
        type
        uid
        attributes
      }
      promo_meta {
        message
      }
      promotions_applied {
        amount
        article_quantity
        mrp_promotion
        offer_text
        promo_id
        promotion_group
        promotion_name
        promotion_type
      }
      quantity
      charges {
        meta
        amount {
          value
          currency
        }
        name
        allow_refund
        code
        type
      }
      product_ean_id
    }
    last_modified
    message
    notification
    pan_config
    pan_no
    payment_selection_lock {
      default_options
      enabled
      payment_identifier
    }
    restrict_checkout
    addresses {
      address {
        custom_json
        address
        address_type
        area
        area_code
        area_code_slug
        checkout_mode
        city
        country
        country_code
        country_iso_code
        country_phone_code
        created_by_user_id
        email
        geo_location {
          latitude
          longitude
        }
        google_map_point
        id
        is_active
        is_default_address
        landmark
        meta
        name
        phone
        state
        tags
        user_id
        sector
      }
      pii_masking
    }
    user_cart_items_count
    staff_user_id
    success
    uid
  }
}`;

export const CART_UPDATE = `mutation UpdateCart {
    updateCart(b: true, i: true, updateCartRequestInput: {
      items: [
        {
          article_id: "$article_id",
          item_id: $item_id,
          item_size: "$item_size",
          quantity: $quantity,
          item_index: $item_index
          identifiers: {
            identifier: "$identifier"
          }
        }
      ],
      operation: $operation
    }) {
      message
      success
    }
  }`;
