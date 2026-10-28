import React, { useEffect, useRef, useState } from "react";
import * as styles from "./apple-login-button.less";
import { useFPI, useGlobalStore } from "fdk-core/utils";

const loadAppleScript = () =>
  new Promise((resolve, reject) => {
    if (window.AppleID?.auth) return resolve();
    const s = document.createElement("script");
    s.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Apple SDK"));
    document.head.appendChild(s);
  });

const randomString = (len = 16) =>
  [...crypto.getRandomValues(new Uint8Array(len))]
    .map((n) => ("0" + (n & 0xff).toString(16)).slice(-2))
    .join("");

const AppleLoginButton = ({
  appleClientId = "",
  redirectURI = "",
  scope = "name email",
  usePopup = true,
  onAppleCredential,
  onError,
  className = "",
  disabled = false,
}) => {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);
  const mounted = useRef(true);
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en-US";
  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        setErr(null);
        await loadAppleScript();

        const state = randomString();
        const nonce = randomString();

        window.AppleID.auth.init({
          clientId: appleClientId,
          scope,
          redirectURI,
          state,
          nonce,
          usePopup,
          locale,
        });

        if (mounted.current) setReady(true);
      } catch (e) {
        console.error(e);
        if (mounted.current) {
          setErr(e.message);
          setReady(false);
          onError?.(e);
        }
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [appleClientId, redirectURI, scope, usePopup, locale]);

  const handleClick = async () => {
    if (!ready || disabled) return;
    try {
      const response = await window.AppleID.auth.signIn();
      await onAppleCredential?.(response);
    } catch (e) {
      console.warn("Apple sign-in cancelled/failed:", e);
      setErr(e?.message || "Apple sign-in was cancelled");
      onError?.(e);
    }
  };

  return (
    <div className={styles["apple-login-container"]}>
      <button
        className={styles["apple-login-button"]}
        onClick={handleClick}
        disabled={!ready || disabled}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 384 512"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
          />
        </svg>

        <span>Sign in with Apple</span>
      </button>
      {err ? (
        <div
          style={{ marginTop: 8, fontSize: 12, color: "var(--error, #c62828)" }}
        >
          {err}
        </div>
      ) : null}
    </div>
  );
};

export default AppleLoginButton;
