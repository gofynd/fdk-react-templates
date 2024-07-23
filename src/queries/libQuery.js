export const USER_DATA_QUERY = `query User {
  user {
    loggedInUser {
      id
      account_type
      active
      application_id
      created_at
      dob
      emails {
        active
        email
        primary
        verified
      }
      first_name
      gender
      last_name
      meta
      phone_numbers {
        active
        country_code
        phone
        primary
        verified
      }
      profile_pic_url
      updated_at
      user_id
      username
      debug {
        platform
        source
      }
      has_old_password_hash
      uid
    }
    activeSessions {
      sessions
    }
    hasPassword {
      result
    }
  }
  cart {
    user_cart_items_count
  }
}`;

export const APP_DETAILS = `query AppDetails {
  applicationConfiguration {
    appDetails {
      id
      banner {
        secure_url
      }
      description
      domain {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      domains {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      favicon {
        secure_url
      }
      logo {
        secure_url
      }
      mobile_logo {
        secure_url
      }
      name
      app_type
      auth {
        enabled
      }
      cache_ttl
      channel_type
      company_id
      cors {
        domains
      }
      created_at
      updated_at
      is_active
      is_internal
      meta {
        name
        value
      }
      owner
      redirections {
        redirect_from
        redirect_to
        type
      }
      token
      website {
        basepath
        enabled
      }
    }
  }
}`;

export const APP_CONTENT_LANDING_SEO = `query LandingPage {
  applicationContent {
    landingPage {
      custom_json
      id
      action {
        page {
          params
          query
          type
          url
        }
        popup {
          params
          query
          type
          url
        }
        type
      }
      application
      archived
      created_by {
        id
      }
      date_meta {
        created_on
        modified_on
      }
      platform
      slug
    }
    seoConfiguration {
      id
      app
      cannonical_enabled
      created_at
      custom_meta_tags {
        id
        content
        name
      }
      details {
        description
        image_url
        title
      }
      robots_txt
      sitemap_enabled
      updated_at
    }
  }
}`;

export const APP_CONFIG = `query AppCurrencies {
  applicationConfiguration {
    appCurrencies {
      application
      default_currency {
        code
        ref
      }
      supported_currency {
        id
        code
        created_at
        decimal_digits
        is_active
        name
        symbol
        updated_at
      }
      
    }
    appDetails {
      id
      banner {
        secure_url
      }
      description
      domain {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      domains {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      favicon {
        secure_url
      }
      logo {
        secure_url
      }
      mobile_logo {
        secure_url
      }
      name
      app_type
      auth {
        enabled
      }
      cache_ttl
      channel_type
      company_id
      cors {
        domains
      }
      created_at
      updated_at
      is_active
      is_internal
      meta {
        name
        value
      }
      owner
      redirections {
        redirect_from
        redirect_to
        type
      }
      token
      website {
        basepath
        enabled
      }
    }
    basicDetails {
      id
      description
      name
      app_type
      cache_ttl
      channel_type
      company_id
      created_at
      updated_at
      is_active
      is_internal
      owner
      token
    }
    features {
      id
      app
      cart {
        google_map
        gst_input
        placing_for_customer
        revenue_engine_coupon
        staff_selection
      }
      common {
        communication_optin_dialog {
          visibility
        }
        compare_products {
          enabled
        }
        currency {
          default_currency
          type
          value
        }
        deployment_store_selection {
          enabled
          type
        }
        feedback {
          enabled
        }
        listing_price {
          sort
          value
        }
        revenue_engine {
          enabled
        }
        reward_points {
          credit {
            enabled
          }
          debit {
            auto_apply
            enabled
            strategy_channel
          }
        }
      }
      created_at
      home_page {
        order_processing
      }
      landing_page {
        continue_as_guest
        launch_page {
          page_type
          params
          query
        }
        login_btn_text
        show_domain_textbox
        show_register_btn
      }
      order {
        buy_again
      }
      pcr {
        staff_selection
      }
      product_detail {
        request_product
        seller_selection
        similar
        update_product_meta
      }
      qr {
        application
        collections
        products
      }
      registration_page {
        ask_store_address
      }
      updated_at
    }
    integrationTokens {
      id
      application
      created_at
      tokens {
        firebase {
          credentials {
            android {
              api_key
              application_id
            }
            api_key
            application_id
            gcm_sender_id
            ios {
              api_key
              application_id
            }
            project_id
          }
          enabled
        }
        freshchat {
          credentials {
            app_id
            app_key
            web_token
          }
          enabled
        }
        fynd_rewards {
          credentials {
            public_key
          }
        }
        google_map {
          credentials {
            api_key
          }
        }
        gtm {
          credentials {
            api_key
          }
          enabled
        }
        moengage {
          credentials {
            app_id
          }
          enabled
        }
        safetynet {
          credentials {
            api_key
          }
          enabled
        }
        segment {
          credentials {
            write_key
          }
          enabled
        }
      }
      updated_at
    }
    languages {
      code
      name
    }
  }
}`;

export const THEME_PAGE_DETAILS = `query ThemePageDetail {
  page:theme(themeId: $themeId) {
    themePageDetail(pageValue: $pageValue) {
      id
      path
      props
      sections {
        blocks
        label
        name
        predicate {
          route {
            exact_url
            query
            selected
          }
          screen {
            desktop
            mobile
            tablet
          }
          user {
            anonymous
            authenticated
          }
        }
        preset
        props
      }
      sections_meta {
        attributes
      }
      seo {
        description
        title
      }
      text
      theme
      type
      value
    }
  }
}`;

export const PLATFORM_CONFIG = `query PlatformConfig {
  platformConfig {
    id
    active
    created_at
    delete_account_consent
    delete_account_day
    delete_account_reasons {
      reason_id
      reason_text
      show_text_area
    }
    desktop_image
    display
    flash_card {
      background_color
      text
      text_color
    }
    forgot_password
    login {
      otp
      password
    }
    look_and_feel {
      background_color
      card_position
    }
    meta {
      fynd_default
    }
    mobile_image
    name
    register
    register_required_fields {
      email {
        is_required
        level
      }
      mobile {
        is_required
        level
      }
    }
    required_fields {
      email {
        level
        is_required
      }
      mobile {
        is_required
        level
      }
    }
    session_config
    skip_captcha
    skip_login
    social {
      account_kit
      apple
      facebook
      google
    }
    social_tokens {
      account_kit {
        app_id
      }
      facebook {
        app_id
      }
      google {
        app_id
      }
    }
    subtext
    updated_at
  }
}`;

export const LIB_QUERY = `query ApplicationConfiguration {
  applicationConfiguration {
    contactInfo {
      id
      address {
        address_line
        city
        country
        loc {
          coordinates
          type
        }
        phone {
          code
          number
        }
        pincode
      }
      business_highlights {
        id
        icon
        sub_title
        title
      }
      application
      support {
        email {
          key
          value
        }
        phone {
          code
          key
          number
        }
        timing
      }
      social_links {
        blog_link {
          icon
          link
          title
        }
        facebook {
          icon
          link
          title
        }
        google_plus {
          icon
          link
          title
        }
        instagram {
          icon
          link
          title
        }
        linked_in {
          icon
          link
          title
        }
        pinterest {
          icon
          link
          title
        }
        twitter {
          icon
          link
          title
        }
        vimeo {
          icon
          link
          title
        }
        youtube {
          icon
          link
          title
        }
      }
      links {
        link
        title
      }
      copyright_text
      created_at
      updated_at
      version
    }
    appDetails {
      id
      banner {
        secure_url
      }
      description
      domain {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      domains {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      favicon {
        secure_url
      }
      logo {
        secure_url
      }
      mobile_logo {
        secure_url
      }
      name
      app_type
      auth {
        enabled
      }
      cache_ttl
      channel_type
      company_id
      cors {
        domains
      }
      created_at
      updated_at
      is_active
      is_internal
      meta {
        name
        value
      }
      owner
      redirections {
        redirect_from
        redirect_to
        type
      }
      token
      website {
        basepath
        enabled
      }
    }
    appCurrencies {
      application
      default_currency {
        code
        ref
      }
      supported_currency {
        id
        code
        created_at
        decimal_digits
        is_active
        name
        symbol
        updated_at
      }
    }
    basicDetails {
      id
      description
      name
      app_type
      cache_ttl
      channel_type
      company_id
      created_at
      updated_at
      is_active
      is_internal
      owner
      token
    }
    features {
      id
      app
      cart {
        google_map
        gst_input
        placing_for_customer
        revenue_engine_coupon
        staff_selection
      }
      common {
        communication_optin_dialog {
          visibility
        }
        compare_products {
          enabled
        }
        currency {
          default_currency
          type
          value
        }
        deployment_store_selection {
          enabled
          type
        }
        feedback {
          enabled
        }
        listing_price {
          sort
          value
        }
        revenue_engine {
          enabled
        }
        reward_points {
          credit {
            enabled
          }
          debit {
            auto_apply
            enabled
            strategy_channel
          }
        }
      }
      created_at
      home_page {
        order_processing
      }
      landing_page {
        continue_as_guest
        launch_page {
          page_type
          params
          query
        }
        login_btn_text
        show_domain_textbox
        show_register_btn
      }
      order {
        buy_again
      }
      pcr {
        staff_selection
      }
      product_detail {
        request_product
        seller_selection
        similar
        update_product_meta
      }
      qr {
        application
        collections
        products
      }
      registration_page {
        ask_store_address
      }
      updated_at
    }
    integrationTokens {
      id
      application
      created_at
      tokens {
        firebase {
          credentials {
            android {
              api_key
              application_id
            }
            api_key
            application_id
            gcm_sender_id
            ios {
              api_key
              application_id
            }
            project_id
          }
          enabled
        }
        freshchat {
          credentials {
            app_id
            app_key
            web_token
          }
          enabled
        }
        fynd_rewards {
          credentials {
            public_key
          }
        }
        google_map {
          credentials {
            api_key
          }
        }
        gtm {
          credentials {
            api_key
          }
          enabled
        }
        moengage {
          credentials {
            app_id
          }
          enabled
        }
        safetynet {
          credentials {
            api_key
          }
          enabled
        }
        segment {
          credentials {
            write_key
          }
          enabled
        }
      }
      updated_at
    }
    languages {
      code
      name
    }
    ownerInfo {
      id
      created_at
      description
      is_active
      name
      secret
      token
      mode
      slug
      status
      company_info {
        id
        addresses {
          address1
          address2
          address_type
          city
          country
          pincode
          state
          lat_long {
            coordinates
            type
          }
        }
        created_on
        is_active
        name
        notification_emails
        uid
      }
      owner_info {
        id
        emails {
          active
          email
          primary
          verified
        }
        first_name
        last_name
        phone_numbers {
          active
          country_code
          phone
          primary
          verified
        }
        profile_pic
      }
    }
  }
  applicationContent {
    navigations {
      items {
        navigation {
          locale_language {
            ar {
              display
            }
            en_us {
              display
            }
            hi {
              display
            }
          }
          acl
          action {
            page {
              params
              query
              type
              url
            }
            popup {
              params
              query
              type
              url
            }
            type
          }
          active
          display
          image
          sort_order
          sub_navigation {
            acl
            active
            display
            image
            sort_order
            tags
            type
            action {
              page {
                params
                query
                type
                url
              }
              popup {
                params
                query
                type
                url
              }
              type
            }
            sub_navigation {
              locale_language {
                ar {
                  display
                }
                en_us {
                  display
                }
                hi {
                  display
                }
              }
              acl
              action {
                page {
                  params
                  query
                  type
                  url
                }
                popup {
                  params
                  query
                  type
                  url
                }
                type
              }
              active
              display
              image
              sort_order
              sub_navigation {
                acl
                active
                display
                image
                sort_order
                tags
                type
              }
              tags
              type
            }
          }
          tags
          type
        }
      }
    }
  }
  cart {
    user_cart_items_count
  }
  page:theme(themeId: $themeId) {
    themePageDetail(pageValue: $pageValue) {
      id
      path
      props
      sections {
        blocks
        label
        name
        predicate {
          route {
            exact_url
            query
            selected
          }
          screen {
            desktop
            mobile
            tablet
          }
          user {
            anonymous
            authenticated
          }
        }
        preset
        props
      }
      sections_meta {
        attributes
      }
      seo {
        description
        title
      }
      text
      theme
      type
      value
    }
  }
  
}`;
