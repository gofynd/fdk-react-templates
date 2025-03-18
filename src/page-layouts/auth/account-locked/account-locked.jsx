import React, { useMemo } from "react";
import * as styles from "./account-locked.less";
import FyButton from "../../../components/core/fy-button/fy-button";

const AccountLocked = ({ email, openHomePage }) => {
  const { active = false, email: emailArray = [] } = email ?? {};

  const supportEmail = useMemo(() => emailArray?.[0]?.value, [emailArray]);

  return (
    <div>
      <div className={styles.deleteAccountTxt}>Your Account is locked</div>
      <p className={styles.deleteAccountDesc}>
        As per your request, your account will be deleted soon. If you wish to
        restore your account, please contact on below support email id.
      </p>
      {active && supportEmail && (
        <a href={`mailto:${supportEmail}`}>
          <p className={styles.supportEmail}>{supportEmail}</p>
        </a>
      )}
      <div className={styles.deleteAccountBtn}>
        <FyButton
          className={styles.btnPrimary}
          variant="outlined"
          size="large"
          color="primary"
          fullWidth={true}
          type="submit"
          onClick={openHomePage}
        >
          Continue
        </FyButton>
      </div>
    </div>
  );
};

export default AccountLocked;
