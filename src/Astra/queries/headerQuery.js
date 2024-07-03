export const FETCH_NAVIGATION_QUERY = `query Navigations {
  applicationContent {
    navigations {
      items {
        id
        application
        archived
        created_by {
          id
        }
        date_meta {
          created_on
          modified_on
        }
        name
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
        orientation {
          landscape
          portrait
        }
        platform
        slug
        version
      }
      page {
        current
        next_id
        has_previous
        has_next
        item_total
        type
        size
      }
    }
  }
}`;

export const FETCH_CARTCOUNT_QUERY = `GetItemCount {
  cart {
    user_cart_items_count
  }
}`;
