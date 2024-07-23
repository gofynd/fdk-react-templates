import { useState, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useForm } from "react-hook-form";
import { validateEmailField, validatePasswordField } from "../../helper/utils";
import { useAccounts } from "../../helper/useAccounts";
// import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';

const useRegister = (fpi) => {
  const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);

  const [isValidMobile, setIsValidMobile] = useState(false);
  const [showVerifyBoth, setShowVerifyBoth] = useState(false);
  const [verifyBothData, setVerifyBothData] = useState({});
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  const validateEmail = (value) => {
    if (
      (platformData?.required_fields?.email?.is_required &&
        platformData?.required_fields?.email?.level === "hard") ||
      value
    ) {
      return validateEmailField(value);
    }
    return true;
  };

  const validatePassword = (value) => validatePasswordField(value);

  const registerForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      email: "",
      phone: {
        countryCode: "91",
        mobile: "",
        isValidNumber: false,
      },
      password: "",
      confirmPassword: "",
    },
  });

  const { signUp, openHomePage } = useAccounts({ fpi });

  const isShowVerifyEmail = useMemo(
    () => !!verifyBothData?.verify_email_otp,
    [verifyBothData]
  );
  const isShowVerifyMobile = useMemo(
    () => !!verifyBothData?.verify_mobile_otp,
    [verifyBothData]
  );

  const isEmail = platformData?.required_fields?.email?.is_required;

  const isEmailRequired = useMemo(() => {
    if (platformData?.required_fields?.email?.level === "soft") {
      return "(optional)";
    }
    if (platformData?.required_fields?.email?.level === "hard") {
      return "*";
    }
    return "";
  }, [platformData]);

  const isMobile = platformData?.required_fields?.mobile?.is_required;

  const isMobileRequired = useMemo(() => {
    if (platformData?.required_fields?.mobile?.level === "soft") {
      return "optional";
    }
    if (platformData?.required_fields?.mobile?.level === "hard") {
      return "required";
    }
    return "";
  }, [platformData]);

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  const toggleConfirmPasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsConfirmPasswordShow((prevState) => !prevState);
  };

  // const handlePhoneChange = (data) => {
  // 	const phoneData = {
  // 		countryCode: data.countryCode,
  // 		mobile: data.mobile,
  // 	};
  // 	if (data.isValidNumber) {
  // 		registerForm.setValue("phone", phoneData, {
  // 			shouldDirty: true,
  // 		});
  // 	}
  // 	setIsValidMobile(data.isValidNumber);
  // };

  const onRegisterFormSubmit = (formData) => {
    const user = { ...formData, registerToken: "" };
    signUp(user)
      .then((data) => {
        if (data?.errors) {
          throw data?.errors?.[0];
        }
        const response = data?.registerWithForm;
        setVerifyBothData(response);
        if (response?.verify_mobile_otp || response?.verify_email_otp) {
          setShowVerifyBoth(true);
        } else {
          openHomePage();
        }
      })
      .catch((err) => {
        registerForm.setError("root", {
          message: err?.message || "Something went wrong",
        });
      });
  };

  return {
    showVerifyBoth,
    registerForm,
    verifyBothData,
    isShowVerifyEmail,
    isShowVerifyMobile,
    isEmail,
    isEmailRequired,
    isMobile,
    isMobileRequired,
    isPasswordShow,
    isConfirmPasswordShow,
    togglePasswordDisplay,
    toggleConfirmPasswordDisplay,
    validateEmail,
    validatePassword,
    // handlePhoneChange,
    onRegisterFormSubmit,
  };
};

export default useRegister;
