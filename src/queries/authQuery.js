export const LOGIN_WITH_OTP = `mutation LoginWithOTP {
  loginWithOTP(platform: "$platform", sendOtpRequestSchemaInput: $sendOtpRequestInput) {
    country_code
    email
    message
    mobile
    register_token
    request_id
    resend_email_token
    resend_timer
    resend_token
    success
    user_exists
    verify_email_otp
    verify_mobile_otp
  }
}`;

export const VERIFY_MOBILE_OTP = `mutation VerifyMobileOTP {
  verifyMobileOTP(platform: "$platform", verifyOtpRequestSchemaInput: $verifyOtpRequestInput) {
    register_token
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
    user_exists
  }
}`;

export const LOGIN_WITH_EMAIL_AND_PASSWORD = `mutation LoginWithEmailAndPassword {
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

export const LOGOUT = `query Logout {
  user {
    logout {
      logout
    }
  }
}`;

export const UPDATE_PROFILE = `mutation UpdateProfile {
  updateProfile(platform: "$platform", editProfileRequestSchemaInput: $editProfileRequestInput) {
    country_code
    email
    message
    mobile
    register_token
    request_id
    resend_email_token
    resend_timer
    resend_token
    success
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
    user_exists
    verify_email_link
    verify_email_otp
    verify_mobile_otp
  }
}`;

export const SEND_RESET_PASSWORD_EMAIL = `mutation SendResetPasswordEmail {
  sendResetPasswordEmail(platform: "$platform", sendResetPasswordEmailRequestSchemaInput: {email: "$email"}) {
    status
  }
}`;

export const REGISTER_WITH_FORM = `mutation RegisterWithForm {
  registerWithForm(platform: "$platform", formRegisterRequestSchemaInput: $formRegisterRequestInput) {
    country_code
    email
    message
    mobile
    register_token
    request_id
    resend_email_token
    resend_timer
    resend_token
    success
    user_exists
    verify_email_otp
    verify_mobile_otp
  }
}
`;

export const SEND_OTP_ON_MOBILE = `mutation SendOTPOnMobile {
  sendOTPOnMobile(sendMobileOtpRequestSchemaInput: $sendMobileOtpRequestInput, platform: "$platform") {
    country_code
    message
    mobile
    register_token
    request_id
    resend_timer
    resend_token
    success
  }
}
`;

export const VERIFY_EMAIL_OTP = `mutation VerifyEmailOTP {
  verifyEmailOTP(platform: "$platform", verifyEmailOtpRequestSchemaInput: $verifyEmailOtpRequestInput) {
    register_token
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
    user_exists
  }
}`;

export const SEND_OTP_ON_EMAIL = `mutation SendOTPOnEmail {
  sendOTPOnEmail(platform: "$platform", sendEmailOtpRequestSchemaInput: $sendEmailOtpRequestInput) {
    success
  }
}`;

export const FORGOT_PASSWORD = `mutation ForgotPassword {
  forgotPassword(forgotPasswordRequestSchemaInput: { code: "$code", password: "$password" }) {
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

export const SEND_RESET_TOKEN = `mutation SendResetToken {
  sendResetToken(codeRequestBodySchemaInput: { code: "$code" }) {
    status
  }
}`;
