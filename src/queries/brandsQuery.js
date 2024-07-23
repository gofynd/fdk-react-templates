export const DEPARTMENT_LIST = `query Departments {
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
  }`;

export const BRAND_LISTING = `query Brands {
    brands(pageNo: 1, pageSize: 30) {
      items {
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
          meta {
            source
          }
          type
          url
        }
        name
        uid
        action {
          page {
            params
            query
            type
            url
          }
          type
        }
        departments
        discount
        slug
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
  }`;
