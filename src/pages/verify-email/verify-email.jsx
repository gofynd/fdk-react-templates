import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/main.less";
import { useGlobalTranslation } from "fdk-core/utils";

function VerifyEmail({ verifyEmail }) {
  const { t } = useGlobalTranslation("translation");
  const [searchParams] = useSearchParams();
  const [isEmailCodeValid, setIsEmailCodeValid] = useState(true);

  const handleEmailVerification = useCallback(async () => {
    try {
      const code = searchParams.get("code");
      await verifyEmail(code);
      setIsEmailCodeValid(true);
    } catch (error) {
      setIsEmailCodeValid(false);
    }
  }, []);

  useEffect(() => {
    handleEmailVerification();
  }, []);

  return (
    <div className="content flexCenter">
      <span>
        {isEmailCodeValid
          ? t("resource.verify_email.email_success")
          : t("resource.verify_email.code_expired")}
      </span>
    </div>
  );
}

export default VerifyEmail;
