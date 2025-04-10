import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./term-privacy.less";
import { useGlobalTranslation } from "fdk-core/utils";

function TermPrivacy() {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.midLinks}>
      {t("resource.auth.login.agree_to_terms_prompt")}&nbsp;
      <FDKLink to="/terms-and-conditions" target="_blank">
        {t("resource.auth.login.terms_of_service")}
      </FDKLink>
      &nbsp;&amp;&nbsp;
      <FDKLink to="/privacy-policy" target="_blank">
        {t("resource.auth.login.privacy_policy")}
      </FDKLink>
    </div>
  );
}

export default TermPrivacy;
