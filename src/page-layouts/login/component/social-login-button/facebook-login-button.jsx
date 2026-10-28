import React, { useState, useEffect } from "react";
import * as styles from "./facebook-login-button.less";

const FacebookLogin = ({
  facebookAppId,
  loginWithFacebookMutation,
  application_id,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load Facebook SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setError(null);

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          // Get user profile information
          window.FB.api(
            "/me",
            { fields: "id,name,email,first_name,last_name,picture" },
            async function (profile) {
              try {
                // Prepare the input variables for your GraphQL mutation
                const variables = {
                  oAuthRequestSchemaInput: {
                    is_signed_in: true,
                    oauth2: {
                      access_token: response.authResponse.accessToken,
                      expiry: response.authResponse.expiresIn,
                    },
                    profile: {
                      email: profile.email || "",
                      first_name: profile.first_name || "",
                      full_name: profile.name || "",
                      id: profile.id,
                      image: profile.picture?.data?.url || "",
                      last_name: profile.last_name || "",
                    },
                  },
                  platform: application_id,
                };

                // Call your GraphQL mutation
                await loginWithFacebookMutation(variables);
              } catch (error) {
                console.log("Login failed: " + error.message);
                console.error("Login error:", error);
              } finally {
                setIsLoading(false);
              }
            }
          );
        } else {
          console.log("Facebook login was cancelled or failed");
          setIsLoading(false);
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <div className={styles["facebook-login-container"]}>
      <button
        onClick={handleFacebookLogin}
        disabled={isLoading}
        className={styles["facebook-login-button"]}
      >
        <svg viewBox="0 0 28 28" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
};

export default FacebookLogin;
