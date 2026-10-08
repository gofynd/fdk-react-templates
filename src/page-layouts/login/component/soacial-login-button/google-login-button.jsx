import React, { useEffect, useRef, useState } from "react";
import { useFPI } from "fdk-core/utils";
import * as styles from "./google-login-button.less";

const GoogleLoginButton = ({
  googleClientId,
  onGoogleCredential,
  onError,
  className = "",
  buttonType = "standard",
  buttonSize = "large",
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scriptLoaded = useRef(false);
  const mounted = useRef(true);
  const fpi = useFPI();
  // Load Google SDK script
  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google || scriptLoaded.current) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded.current = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Google SDK"));
      document.head.appendChild(script);
    });
  };

  const applyCustomStyles = (container) => {
    if (!container) return;

    try {
      const buttonEl = container.querySelector('div[role="button"]');
      const svgEl = container.querySelector("svg");
      const spanEl = container.querySelector("span");

      if (buttonEl) {
        // Apply button styles
        Object.assign(buttonEl.style, {
          height: "48px",
          padding: "12px",
          background: "transparent",
          borderRadius: "4px",
          border: "1px solid var(--dividerStokes, #dadce0)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "19.6px",
          textTransform: "uppercase",
          color: "var(--textHeading, #3c4043)",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
        });
      }

      if (svgEl) {
        Object.assign(svgEl.style, {
          flex: "0 0 24px",
        });
      }

      if (spanEl) {
        Object.assign(spanEl.style, {
          marginInlineEnd: "24px",
          color: "var(--textHeading, #3c4043)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "19.6px",
          textTransform: "uppercase",
          width: "100%",
        });
      }

      console.log("✅ Custom styles applied");
    } catch (err) {
      console.warn("Failed to apply custom styles:", err);
    }
  };

  useEffect(() => {
    mounted.current = true;

    const initializeGoogleAuth = async () => {
      try {
        setError(null);

        // Load the Google script
        await loadGoogleScript();

        if (!mounted.current) return;

        // Make callback available globally
        window.onGoogleCredential = onGoogleCredential;

        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: onGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Configure the One Tap (optional)
        if (!disabled) {
          window.google.accounts.id.prompt((notification) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              console.log(
                "One Tap not displayed:",
                notification.getNotDisplayedReason()
              );
            }
          });
        }

        // Wait a bit for DOM to be ready
        setTimeout(() => {
          const buttonElement = document.getElementById("google-signin-button");
          if (buttonElement && window.google?.accounts?.id) {
            try {
              // Render the sign-in button
              window.google.accounts.id.renderButton(buttonElement, {
                type: buttonType,
                size: buttonSize,
                theme: "outline",
                text: "signin_with",
                shape: "rectangular",
              });

              applyCustomStyles(buttonElement);
            } catch (renderError) {
              console.error("Button render error:", renderError);
              setError("Failed to render Google button");
            }
          }
        }, 100);

        if (mounted.current) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize Google auth:", err);
        if (mounted.current) {
          setError(err.message);
          setIsLoading(false);
          onError?.(err);
        }
      }
    };

    initializeGoogleAuth();

    // Cleanup function
    return () => {
      mounted.current = false;

      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel?.();
          window.google.accounts.id.disableAutoSelect?.();
        } catch (e) {
          console.warn("Google cleanup error:", e);
        }
      }

      // Clean up global callback
      if (window.onGoogleCredential) {
        delete window.onGoogleCredential;
      }
    };
  }, [googleClientId, buttonType, buttonSize, disabled]);

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className={`google-login-container ${className}`}>
  //       <div className="google-login-loading">
  //         <div>Loading Google Sign-In...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // Show error state
  // if (error) {
  //   return (
  //     <div className={`google-login-container ${className}`} role="alert">
  //       <div className="google-login-error">
  //         <div>Google Sign-In Error: {error}</div>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="retry-button"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`${styles["google-login-container"]} ${className}`}>
      {/* Google One Tap configuration */}
      <div
        id="g_id_onload"
        data-client_id={googleClientId}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onGoogleCredential"
        data-auto_prompt="false"
        style={{ display: "none" }}
      />

      {/* Google Sign-In Button */}
      <div className="google-signin-wrapper">
        <div
          id="google-signin-button"
          className="g_id_signin"
          data-type={buttonType}
          data-size={buttonSize}
          style={{
            opacity: disabled,
            pointerEvents: disabled,
          }}
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
