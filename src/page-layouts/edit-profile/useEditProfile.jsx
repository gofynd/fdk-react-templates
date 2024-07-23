import { useState, useEffect, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useForm } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import { useAccounts } from "../../helper/useAccounts";
import { useLocation, useNavigate } from "react-router-dom";

const useEditProfile = (fpi) => {
  const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);
  const userData = useGlobalStore(fpi.getters.USER_DATA);
  const isLoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);

  // const [isValidMobile, setIsValidMobile] = useState(false);
  const [showVerifyBoth, setShowVerifyBoth] = useState(false);
  const [verifyBothData, setVerifyBothData] = useState({});
  const [showVerifyEmail, setShowVerifyEmail] = useState(true);
  const [showVerifyMobile, setShowVerifyMobile] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

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

  const isCancelButton = useMemo(() => {
    if (isLoggedIn) {
      if (
        platformData?.required_fields?.email?.is_required &&
        platformData?.required_fields?.email?.level === "soft"
      ) {
        return true;
      }
      if (
        platformData?.required_fields?.mobile?.is_required &&
        platformData?.required_fields?.mobile?.level === "soft"
      ) {
        return true;
      }
      return false;
    }
    return false;
  }, [platformData]);

  const userPrimaryEmail = useMemo(
    () => userData?.emails?.find((e) => e.primary),
    [userData]
  );
  const userPrimaryPhone = useMemo(
    () => userData?.phone_numbers?.find((e) => e.primary),
    [userData]
  );

  const isEmailExist = userPrimaryEmail?.verified;
  const isMobileDisabled = userPrimaryPhone?.verified;

  const editProfileForm = useForm({
    defaultValues: {
      firstName: userData?.first_name || "",
      lastName: userData?.last_name || "",
      gender: userData?.gender || "male",
      email: userPrimaryEmail?.email || "",
      phone: {
        countryCode: userPrimaryPhone?.country_code,
        mobile: userPrimaryPhone?.phone,
        isValidNumber: isMobileDisabled,
      },
    },
  });

  useEffect(() => {
    if (userData) {
      editProfileForm.reset({
        firstName: userData?.first_name || "",
        lastName: userData?.last_name || "",
        gender: userData?.gender || "male",
        email: userPrimaryEmail?.email || "",
        phone: {
          countryCode: userPrimaryPhone?.country_code || "91",
          mobile: userPrimaryPhone?.phone,
          isValidNumber: isMobileDisabled,
        },
      });
    }
  }, [userData, editProfileForm.reset]);

  const { openHomePage, updateProfile, signOut } = useAccounts({ fpi });

  const handleCancelClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const EMAIL_MOBILE_SOFT_SHOW_PROFILE_TIME = 5 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "isCancelButtonClicked",
      EMAIL_MOBILE_SOFT_SHOW_PROFILE_TIME
    );
    openHomePage();
  };

  const handleSignOutClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    signOut();
  };

  const handleProfileUpdate = (formData) => {
    const user = { ...formData, registerToken: userData?.register_token || "" };
    console.log({ user });
    updateProfile(user)
      .then((data) => {
        if (data?.errors) {
          throw data?.errors?.[0];
        }
        const res = data?.updateProfile;
        let {
          verify_mobile_otp: verifyMobileOtp,
          verify_email_otp: verifyEmailOtp,
          verify_email_link: verifyEmailLink,
          email,
        } = res;
        if (verifyEmailLink) {
          const queryParams = new URLSearchParams(location.search);
          queryParams.set("email", email);
          navigate({
            pathname: "/auth/verify-email-link",
            search: queryParams.toString(),
          });
          return;
        }
        if (verifyMobileOtp || verifyEmailOtp) {
          setShowVerifyMobile(!!verifyMobileOtp);
          setShowVerifyEmail(!!verifyEmailOtp);
          setVerifyBothData(res);
          setShowVerifyBoth(true);
          return;
        }
        openHomePage();
      })
      .catch((err) => {
        editProfileForm.setError("root", {
          message: err?.message || "Something went wrong",
        });
      });
  };
  return {
    editProfileForm,
    showVerifyBoth,
    verifyBothData,
    showVerifyEmail,
    showVerifyMobile,
    isLoggedIn,
    isEmail,
    isEmailRequired,
    isMobile,
    isMobileRequired,
    isEmailExist,
    isMobileDisabled,
    isCancelButton,
    validateEmail,
    handleCancelClick,
    handleSignOutClick,
    handleProfileUpdate,
  };
};

export default useEditProfile;
