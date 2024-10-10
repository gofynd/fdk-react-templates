import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/main.less";

function VerifyEmail({ verifyEmail }) {
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
          ? "Email Successfully Verified"
          : "Code Expired/Invalid Request"}
      </span>
    </div>
  );
}

export default VerifyEmail;
