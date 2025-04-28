import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./term-privacy.less";
import { useGlobalTranslation } from "fdk-core/utils";

function TermPrivacy({ onChange, checked }) {
  const { t } = useGlobalTranslation("translation");
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
            {t("resource.auth.login.agree_to_the")}&nbsp;
              <FDKLink to="/terms-and-conditions" target="_blank">
                {t("resource.auth.login.terms_of_service")}
              </FDKLink>
              &nbsp;{t("resource.auth.login.and_symbol")}&nbsp;
              <FDKLink to="/privacy-policy" target="_blank">
                {t("resource.auth.login.privacy_policy")}
              </FDKLink>
            </span>
          </div>
      ) : (
        <span className={styles.byContinuingText}>
          {t("resource.auth.login.agree_to_terms_prompt")}&nbsp;
          <FDKLink to="/terms-and-conditions" target="_blank">
            {t("resource.auth.login.terms_of_service")}
          </FDKLink>
          &nbsp;{t("resource.auth.login.and_symbol")}&nbsp;
          <FDKLink to="/privacy-policy" target="_blank">
            {t("resource.auth.login.privacy_policy")}
          </FDKLink>
        </span>
      )}
    </>
  );
}

export default TermPrivacy;
