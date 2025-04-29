import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./term-privacy.less";

function TermPrivacy({ onChange, checked }) {
  const isRegisterPage =
    typeof window !== "undefined" &&
    window.location.pathname.includes("auth/register");

  return (
    <>
      {isRegisterPage ? (
          <div className={styles.midLinks}>
            <input
              className={styles.checkbox}
              type="checkbox"
              onChange={(e) => onChange?.(e.target.checked)}
              checked={checked}
            />
            <span>
              I agree to the&nbsp;
              <FDKLink to="/terms-and-conditions" target="_blank">
                Terms of Service
              </FDKLink>
              &nbsp;&amp;&nbsp;
              <FDKLink to="/privacy-policy" target="_blank">
                Privacy Policy
              </FDKLink>
            </span>
          </div>
      ) : (
        <span className={styles.byContinuingText}>
          By continuing, I agree to the&nbsp;
          <FDKLink to="/terms-and-conditions" target="_blank">
            Terms of Service
          </FDKLink>
          &nbsp;&amp;&nbsp;
          <FDKLink to="/privacy-policy" target="_blank">
            Privacy Policy
          </FDKLink>
        </span>
      )}
    </>
  );
}

export default TermPrivacy;
