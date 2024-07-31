export const LOGIN_WITH_PASS = `mutation LoginWithEmailAndPassword {
    loginWithEmailAndPassword(passwordLoginRequestSchemaInput: {
        username: "$username",
        password: "$password",
      }) {
      register_token
      request_id
      user {
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
    }
  }`;
