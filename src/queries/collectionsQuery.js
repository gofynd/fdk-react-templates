export const COLLECTIONS = `query Items {
    collections(pageNo: 1, pageSize: 100) {
      items {
        uid
        type
        name
        published
        description
        is_active
        slug
        allow_facets
        allow_sort
        sortOn
        priority
        schedule {
          start
          end
          next_schedule {
            start
            end
          }
        }
        seo {
          description
          image {
            url
          }
          title
        }
        badge {
          text
          color
        }
        visible_facets_keys
        tags
        logo {
          type
          url
        }
        banners {
          landscape {
            alt
            meta {
              source
            }
            type
            url
          }
          portrait {
            alt
            type
            url
          }
        }
        query {
          attribute
          op
          value
        }
      }
    }
  }`;
