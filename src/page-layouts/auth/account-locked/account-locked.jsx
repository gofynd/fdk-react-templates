import React, { useMemo } from "react";
import * as styles from "./account-locked.less";
import FyButton from "../../../components/core/fy-button/fy-button";
import { useGlobalTranslation } from "fdk-core/utils";

const AccountLocked = ({ email, openHomePage }) => {
  const { t } = useGlobalTranslation("translation");
  const { active = false, email: emailArray = [] } = email ?? {};

  const supportEmail = useMemo(() => emailArray?.[0]?.value, [emailArray]);

  return (
    <div>
      <div className={styles.deleteAccountTxt}>{t("resource.auth.account_locked_message")}</div>
      <p className={styles.deleteAccountDesc}>
        {t("resource.auth.account_deletion_notice")}
      </p>
      {active && supportEmail && (
        <a href={`mailto:${supportEmail}`}>
          <p className={styles.supportEmail}>{supportEmail}</p>
        </a>
      )}
      <div className={styles.deleteAccountBtn}>
        <FyButton fullWidth variant="text" type="submit" onClick={openHomePage}>
          {t("resource.auth.continue")}
        </FyButton>
      </div>
    </div>
  );
};

export default AccountLocked;
