export const GET_ADDRESSES_AGGREGATORS = `query Addresses {
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
}`;
