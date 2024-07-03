export const CART_DETAILS = `query Cart {
  cart(buyNow: false, includeAllItems: true, includeCodCharges: true, includeBreakup: true, areaCode: "$areaCode") {
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
      code
      discount_rules {
        item_criteria
        matched_buy_rules
        offer
        raw_offer
      }
      meta
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
      cancellation_allowed
      free_quantity
      offer_description
      offer_label
      original_article_quantity
      promo_code
      return_allowed
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        maximum_discount_value
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        attr
        original
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
        message
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
        sub_total
      }
    }
    buy_now
    cart_id
    checkout_mode
    comment
    coupon {
      cashback_amount
      cashback_message_primary
      cashback_message_secondary
      coupon_code
      coupon_description
      coupon_id
      coupon_subtitle
      coupon_title
      coupon_type
      coupon_value
      discount
      is_applied
      is_valid
      maximum_discount_value
      message
      minimum_cart_value
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
      iso {
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
            selling
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
            selling
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
          code
        }
        tags
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
      charges {
        meta
        amount {
          currency
          value
        }
        name
        allow_refund
        code
        type
      }
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
        attributes
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
          tag
        }
        type
        uid
      }
      product_ean_id
      promo_meta {
        message
      }
      promotions_applied {
        amount
        article_quantity
        code
        meta
        mrp_promotion
        offer_text
        promo_id
        promotion_group
        promotion_name
        promotion_type
        cancellation_allowed
        free_quantity
        offer_description
        offer_label
        original_article_quantity
        promo_code
        return_allowed
      }
      quantity
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
        expire_at
        app_id
        state_code
        uid
        is_anonymous
      }
      pii_masking
    }
    user_cart_items_count
    staff_user_id
    success
    uid
  }
  coupons {
    available_coupon_list {
      coupon_amount
      coupon_applicable_message
      coupon_code
      coupon_type
      coupon_value
      description
      end_date
      expires_on
      is_applicable
      is_applied
      is_bank_offer
      max_discount_value
      medias {
        alt
        key
        type
        url
      }
      message
      minimum_cart_value
      offer_text
      start_date
      sub_title
      tags
      title
    }
    page {
      current
      has_next
      has_previous
      total
      total_item_count
    }
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
      cart {
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
          code
          discount_rules {
            item_criteria
            matched_buy_rules
            offer
            raw_offer
          }
          meta
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
          cancellation_allowed
          free_quantity
          offer_description
          offer_label
          original_article_quantity
          promo_code
          return_allowed
        }
        breakup_values {
          coupon {
            code
            coupon_type
            coupon_value
            description
            is_applied
            maximum_discount_value
            message
            minimum_cart_value
            sub_title
            title
            type
            uid
            value
          }
          display {
            currency_code
            currency_symbol
            display
            key
            message
            value
            attr
            original
            preset
          }
          loyalty_points {
            applicable
            description
            is_applied
            total
            message
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
            sub_total
          }
        }
        buy_now
        checkout_mode
        comment
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
          iso {
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
                selling
              }
              converted {
                currency_code
                currency_symbol
                effective
                marked
                selling
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
              code
            }
            tags
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
          charges {
            meta
            amount {
              currency
              value
            }
            name
            allow_refund
            code
            type
          }
          coupon {
            code
            discount_single_quantity
            discount_total_quantity
          }
          coupon_message
          custom_order
          delivery_promise {
            formatted {
              max
              min
            }
            timestamp {
              max
              min
            }
            iso {
              max
              min
            }
          }
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
            attributes
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
              tag
            }
            type
            uid
          }
          product_ean_id
          promo_meta {
            message
          }
          promotions_applied {
            amount
            article_quantity
            code
            meta
            mrp_promotion
            offer_text
            promo_id
            promotion_group
            promotion_name
            promotion_type
            cancellation_allowed
            free_quantity
            offer_description
            offer_label
            original_article_quantity
            promo_code
            return_allowed
          }
          quantity
        }
        last_modified
        message
        pan_config
        pan_no
        payment_selection_lock {
          default_options
          enabled
          payment_identifier
        }
        restrict_checkout
      }
      message
      success
    }
  }`;

export const APPLY_COUPON = `mutation ApplyCoupon {
  applyCoupon(applyCouponRequestInput: {coupon_code: "$couponCode"}, id: "$cartId") {
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
      code
      discount_rules {
        item_criteria
        matched_buy_rules
        offer
        raw_offer
      }
      meta
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
      cancellation_allowed
      free_quantity
      offer_description
      offer_label
      original_article_quantity
      promo_code
      return_allowed
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        maximum_discount_value
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        attr
        original
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
        message
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
        sub_total
      }
    }
    buy_now
    checkout_mode
    comment
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
      iso {
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
            selling
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
            selling
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
          code
        }
        tags
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
      charges {
        meta
        amount {
          currency
          value
        }
        name
        allow_refund
        code
        type
      }
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      coupon_message
      custom_order
      delivery_promise {
        formatted {
          max
          min
        }
        timestamp {
          max
          min
        }
        iso {
          max
          min
        }
      }
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
        attributes
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
          tag
        }
        type
        uid
      }
      product_ean_id
      promo_meta {
        message
      }
      promotions_applied {
        amount
        article_quantity
        code
        meta
        mrp_promotion
        offer_text
        promo_id
        promotion_group
        promotion_name
        promotion_type
        cancellation_allowed
        free_quantity
        offer_description
        offer_label
        original_article_quantity
        promo_code
        return_allowed
      }
      quantity
    }
    last_modified
    message
    pan_config
    pan_no
    payment_selection_lock {
      default_options
      enabled
      payment_identifier
    }
    restrict_checkout
  }
}`;

export const REMOVE_COUPON = `mutation RemoveCoupon {
  removeCoupon(id: "$removeCouponId") {
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
      code
      discount_rules {
        item_criteria
        matched_buy_rules
        offer
        raw_offer
      }
      meta
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
      cancellation_allowed
      free_quantity
      offer_description
      offer_label
      original_article_quantity
      promo_code
      return_allowed
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        maximum_discount_value
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        attr
        original
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
        message
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
        sub_total
      }
    }
    buy_now
    checkout_mode
    comment
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
      iso {
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
            selling
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
            selling
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
          code
        }
        tags
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
      charges {
        meta
        amount {
          currency
          value
        }
        name
        allow_refund
        code
        type
      }
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      coupon_message
      custom_order
      delivery_promise {
        formatted {
          max
          min
        }
        timestamp {
          max
          min
        }
        iso {
          max
          min
        }
      }
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
        attributes
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
          tag
        }
        type
        uid
      }
      product_ean_id
      promo_meta {
        message
      }
      promotions_applied {
        amount
        article_quantity
        code
        meta
        mrp_promotion
        offer_text
        promo_id
        promotion_group
        promotion_name
        promotion_type
        cancellation_allowed
        free_quantity
        offer_description
        offer_label
        original_article_quantity
        promo_code
        return_allowed
      }
      quantity
    }
    last_modified
    message
    pan_config
    pan_no
    payment_selection_lock {
      default_options
      enabled
      payment_identifier
    }
    restrict_checkout
  }
}`;

export const CART_META_UPDATE = `mutation UpdateCartMeta {
  updateCartMeta(cartMetaRequestInput: $cartMetaRequestInput, id: "$cartId") {
    is_valid
    message
  }
}`;
