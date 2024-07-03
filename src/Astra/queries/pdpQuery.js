export const GET_PRODUCT_DETAILS = `query ($slug: String!) {
  product(slug: $slug) {
    brand {
      custom_config
      banners {
        landscape {
          alt
          type
          url
        }
        portrait {
          alt
          type
          url
        }
      }
      description
      logo {
        alt
        type
        url
      }
      name
      uid
      departments
      discount
      slug
    }
    color
    item_code
    item_type
    has_variant
    uid
    grouped_attributes {
      title
      details {
        key
        type
        value
      }
    }
    attributes
    custom_config
    media {
      alt
      meta {
        source
      }
      type
      url
    }
    sizes {
      slug
      discount
      multi_size
      sellable
      size_chart {
        description
        headers {
          col_1 {
            convertable
            value
          }
          col_2 {
            convertable
            value
          }
          col_3 {
            convertable
            value
          }
          col_4 {
            convertable
            value
          }
          col_5 {
            convertable
            value
          }
          col_6 {
            convertable
            value
          }
        }
        image
        size_tip
        sizes {
          col_1
          col_2
          col_3
          col_4
          col_5
          col_6
        }
        title
        unit
      }
      sizes:size_details {
        dimension {
          height
          is_default
          length
          unit
          width
        }
        display
        is_available
        quantity
        seller_identifiers
        value
        weight {
          is_default
          shipping
          unit
        }
      }
      stores {
        count
      }
    }
    custom_order {
      is_custom_order
      manufacturing_time
      manufacturing_time_unit
    }
    custom_meta {
      key
      value
    }
    description
    discount
    highlights
    image_nature
    is_dependent
    moq {
      increment_unit
      maximum
      minimum
    }
    name
    net_quantity {
      unit
      value
    }
    price {
      effective {
        currency_code
        currency_symbol
        max
        min
      }
      marked {
        currency_code
        currency_symbol
        max
        min
      }
    }
    product_group_tag
    product_online_date
    rating
    rating_count
    seo {
      description
      title
    }
    short_description
    similars
    slug
    teaser_tag
    tryouts
    type
    variants {
      display_type
      header
      items {
        _custom_meta {
          key
          value
        }
        color
        color_name
        is_available
        medias {
          alt
          type
          url
        }
        name
        slug
        uid
        value
      }
      key
      total
    }
    action {
      page {
        params
        query
        type
        url
      }
      type
    }
    categories {
      description
      name
      uid
    }
    category_map {
      l1 {
        description
        name
        uid
      }
      l2 {
        description
        name
        uid
      }
      l3 {
        description
        name
        uid
      }
    }
    sellable
  }
  coupons {
    available_coupon_list {
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
    page {
      current
      has_next
      has_previous
      total
      total_item_count
    }
  }
}`;

export const GET_PRODUCT_DETAILS_SSR = `query Product {
  product(slug: $slug) {
    brand {
      custom_config
      banners {
        landscape {
          alt
          type
          url
        }
        portrait {
          alt
          type
          url
        }
      }
      description
      logo {
        alt
        type
        url
      }
      name
      uid
      departments
      discount
      slug
    }
    color
    item_code
    item_type
    has_variant
    uid
    grouped_attributes {
      title
      details {
        key
        type
        value
      }
    }
    attributes
    custom_config
    media {
      alt
      meta {
        source
      }
      type
      url
    }
    sizes {
      slug
      discount
      multi_size
      sellable
      size_chart {
        description
        headers {
          col_1 {
            convertable
            value
          }
          col_2 {
            convertable
            value
          }
          col_3 {
            convertable
            value
          }
          col_4 {
            convertable
            value
          }
          col_5 {
            convertable
            value
          }
          col_6 {
            convertable
            value
          }
        }
        image
        size_tip
        sizes {
          col_1
          col_2
          col_3
          col_4
          col_5
          col_6
        }
        title
        unit
      }
      sizes:size_details {
        dimension {
          height
          is_default
          length
          unit
          width
        }
        display
        is_available
        quantity
        seller_identifiers
        value
        weight {
          is_default
          shipping
          unit
        }
      }
      stores {
        count
      }
    }
    custom_order {
      is_custom_order
      manufacturing_time
      manufacturing_time_unit
    }
    custom_meta {
      key
      value
    }
    description
    discount
    highlights
    image_nature
    is_dependent
    moq {
      increment_unit
      maximum
      minimum
    }
    name
    net_quantity {
      unit
      value
    }
    price {
      effective {
        currency_code
        currency_symbol
        max
        min
      }
      marked {
        currency_code
        currency_symbol
        max
        min
      }
    }
    product_group_tag
    product_online_date
    rating
    rating_count
    seo {
      description
      title
    }
    short_description
    similars
    slug
    teaser_tag
    tryouts
    type
    variants {
      display_type
      header
      items {
        _custom_meta {
          key
          value
        }
        color
        color_name
        is_available
        medias {
          alt
          type
          url
        }
        name
        slug
        uid
        value
      }
      key
      total
    }
    action {
      page {
        params
        query
        type
        url
      }
      type
    }
    categories {
      description
      name
      uid
    }
    category_map {
      l1 {
        description
        name
        uid
      }
      l2 {
        description
        name
        uid
      }
      l3 {
        description
        name
        uid
      }
    }
    sellable
  }
}`;

export const PRODUCT_SIZE_PRICE = `query ProductPrice {
  productPrice(slug: $slug, size: $size) {
    article_assignment {
      level
      strategy
    }
    article_id
    delivery_promise {
      max
      min
    }
    discount
    grouped_attributes {
      title
      details {
        key
        type
        value
      }
    }
    is_cod
    is_gift
    item_type
    long_lat
    marketplace_attributes {
      title
    }
    pincode
    price {
      currency_code
      currency_symbol
      effective
      marked
      selling
    }
    price_per_piece {
      currency_code
      currency_symbol
      effective
      marked
      selling
    }
    price_per_unit {
      currency_code
      currency_symbol
      price
      unit
    }
    quantity
    return_config {
      returnable
      time
      unit
    }
    seller {
      count
      name
      uid
    }
    seller_count
    set {
      quantity
      size_distribution {
        sizes {
          pieces
          size
        }
      }
    }
    special_badge
    store {
      id
      uid
      name
      city
      code
      count
      custom_json
      address {
        address1
        address2
        city
        country
        landmark
        latitude
        longitude
        pincode
        state
      }
      company {
        business_type
        company_type
        name
        uid
      }
      contact_numbers {
        active
        country_code
        phone
        primary
        verified
      }
      departments {
        logo {
          alt
          meta {
            source
          }
          type
          url
        }
        name
        priority_order
        slug
        uid
      }
      manager {
        email
        mobile_no {
          active
          country_code
          phone
          primary
          verified
        }
        name
      }
      store_code
      timing {
        closing {
          hour
          minute
        }
        open
        opening {
          hour
          minute
        }
        weekday
      }
    }
    strategy_wise_listing {
      distance
      pincode
      quantity
      tat
    }
  }
}`;

export const COUPONS_DATA = `query Coupons {
  coupons {
    available_coupon_list {
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
  }
}`;

export const ADD_TO_CART = `mutation AddItemsToCart {
  addItemsToCart(buyNow: $buyNow, addCartRequestInput:{
    items: [
      {
        article_assignment: {
          level: "$level",
          strategy:"$strategy"
        },
        article_id: "$article_id",
        item_id: $item_id,
        item_size: "$item_size",
        quantity: 1,
        seller_id: $seller_id,
        store_id: $store_id,
      }
    ]}) {
    message
    partial
    success
    cart {
      buy_now
      cart_id
      checkout_mode
      comment
      coupon_text
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
      last_modified
      message
      notification
      pan_config
      pan_no
      restrict_checkout
      user_cart_items_count
      staff_user_id
      success
      uid
    }
  }
}`;
