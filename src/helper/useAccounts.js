// import { loginUserInFb } from '../../helper/facebook.utils';
// import { renderButton } from '../../helper/google.utils';

import { useState, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { updateGraphQueryWithValue } from "./utils";
import {
	LOGIN_WITH_OTP,
	UPDATE_PROFILE,
	REGISTER_WITH_FORM,
	VERIFY_MOBILE_OTP,
	SEND_OTP_ON_MOBILE,
	VERIFY_EMAIL_OTP,
	SEND_OTP_ON_EMAIL,
	SEND_RESET_PASSWORD_EMAIL,
	LOGIN_WITH_EMAIL_AND_PASSWORD,
	LOGOUT,
	FORGOT_PASSWORD,
} from "../queries/authQuery";

export const useAccounts = ({ fpi }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [facebookUser, setFacebookUser] = useState(null);

	const userData = useGlobalStore(fpi.getters.USER_DATA);
	const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);
	const isLoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);

	const openLogin = ({ redirect = true } = {}) => {
		const queryParams = new URLSearchParams(location.search);
		if (redirect) {
			queryParams.set("redirectUrl", encodeURIComponent(location.pathname + location.search));
		}
		navigate({
			pathname: "/auth/login",
			search: queryParams.toString(),
		});
	};

	const openRegister = ({ redirect = true } = {}) => {
		const queryParams = new URLSearchParams(location.search);
		if (redirect) {
			queryParams.set("redirectUrl", location.pathname);
		}
		navigate({
			pathname: "/auth/register",
			search: queryParams.toString(),
		});
	};

	const openForgotPassword = () => {
		navigate({
			pathname: "/auth/forgot-password",
			search: location.search,
		});
	};

	const openHomePage = () => {
		const queryParams = new URLSearchParams(location.search);
		const redirectUrl = queryParams.get("redirectUrl") || "";
		window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
	};

	const updateProfile = (data) => {
		// this.$store.dispatch(UPDATE_PROFILE, data);
		const id = window.APP_DATA.applicationID;
		const {
			registerToken,
			firstName,
			lastName,
			gender,
			email,
			phone: { countryCode, mobile },
		} = data;
		const editProfileRequestInput = `{
			country_code: "${countryCode}",
    	first_name: "${firstName}",
			last_name: "${lastName}",
			gender: "${gender}",
			register_token: "${registerToken}",
			${email ? `email: "${email}",` : ""}
			${
				mobile && countryCode
					? `mobile: {
				country_code: "${countryCode}",
				phone: "${mobile}"
			}`
					: ""
			}
		}`;
		const payload = [
			["$platform", `${id}`],
			["$editProfileRequestInput", `${editProfileRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(UPDATE_PROFILE, payload), null);
	};

	const signOut = () =>
		fpi.executeGraphQL(updateGraphQueryWithValue(LOGOUT), null).then((data) => {
			if (data?.errors) {
				throw data?.errors?.[0];
			}
			if (data?.user?.logout?.logout) {
				const queryParams = new URLSearchParams(location.search);
				const redirectUrl = queryParams.get("redirectUrl") || "";
				window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
				return data;
			}
			return Promise.reject();
		});
	const signIn = (data) => {
		// return this.$store.dispatch(SIGNIN_USER, data);
		const { isRedirection, password, username } = data;
		const payload = [
			["$username", `${username}`],
			["$password", `${password}`],
		];
		return fpi
			.executeGraphQL(updateGraphQueryWithValue(LOGIN_WITH_EMAIL_AND_PASSWORD, payload), null)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				if (isRedirection) {
					const queryParams = new URLSearchParams(location.search);
					const redirectUrl = queryParams.get("redirectUrl") || "";
					window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
				}
				return data;
			});
	};

	const sendOtp = ({ mobile, countryCode }) => {
		// return this.$store.dispatch(SEND_OTP, data);
		const id = window.APP_DATA.applicationID;
		const sendOtpRequestInput = `{
			mobile: "${mobile}"
			country_code: "${countryCode}",
		}`;
		const payload = [
			["$platform", `${id}`],
			["$sendOtpRequestInput", `${sendOtpRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(LOGIN_WITH_OTP, payload), null);
	};

	const resendOtp = ({ mobile, countryCode, token, action }) => {
		// return this.$store.dispatch(RESEND_OTP, data);
		const id = window.APP_DATA.applicationID;
		const sendMobileOtpRequestInput = `{
			mobile: "${mobile}",
			country_code: "${countryCode}",
    	token: "${token}",
			action: ${action},
		}`;
		const payload = [
			["$platform", `${id}`],
			["$sendMobileOtpRequestInput", `${sendMobileOtpRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(SEND_OTP_ON_MOBILE, payload), null);
	};

	const signInWithOtp = ({ otp, requestId, isRedirection = true }) => {
		// return this.$store.dispatch(SIGNIN_USER_WITH_OTP, {
		// 	is_redirection: true,
		// 	...data,
		// });
		const id = window.APP_DATA.applicationID;
		const verifyOtpRequestInput = `{
			otp: "${otp}",
    	request_id: "${requestId}",
		}`;
		const payload = [
			["$platform", `${id}`],
			["$verifyOtpRequestInput", `${verifyOtpRequestInput}`],
		];
		return fpi
			.executeGraphQL(updateGraphQueryWithValue(VERIFY_MOBILE_OTP, payload), null)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				const { user_exists: userExists } = data?.verifyMobileOTP || {};
				if (!userExists) {
					if (isRedirection) {
						navigate({
							pathname: "/auth/edit-profile",
							search: location.search,
						});
					}
				} else {
					const queryParams = new URLSearchParams(location.search);
					const redirectUrl = queryParams.get("redirectUrl") || "";
					window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
				}
				return data;
			});
	};

	const signUp = (data) => {
		// return this.$store.dispatch(SIGNUP_USER, data);
		const id = window.APP_DATA.applicationID;
		const {
			registerToken,
			firstName,
			lastName,
			gender,
			email,
			phone: { countryCode, mobile },
			password,
		} = data;
		const formRegisterRequestInput = `{
			gender: "${gender}",
			first_name: "${firstName}",
			last_name: "${lastName}",
			password: "${password}",
			register_token: "${registerToken}",
			${email ? `email: "${email}",` : ""}
			${countryCode && mobile ? `phone: { country_code: "${countryCode}", mobile: "${mobile}" },` : ""}
		}`;

		const payload = [
			["$platform", `${id}`],
			["$formRegisterRequestInput", `${formRegisterRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(REGISTER_WITH_FORM, payload), null);
	};

	const setPassword = ({ password, code }) => {
		// return this.$store.dispatch(SET_PASSWORD, data);
		const payload = [
			["$code", `${code}`],
			["$password", `${password}`],
		];
		return fpi
			.executeGraphQL(updateGraphQueryWithValue(FORGOT_PASSWORD, payload), null)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				navigate({
					pathname: "/",
				});
				return data;
			});
	};

	const sendOtpMobile = (data) => {
		// return this.$store.dispatch(SEND_OTP_MOBILE, data);
	};

	const sendResetPasswordEmail = (data) => {
		// return this.$store.dispatch(SEND_RESET_PASSWORD_EMAIL, data);
		const id = window.APP_DATA.applicationID;
		const { email } = data;
		const payload = [
			["$platform", `${id}`],
			["$email", `${email}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(SEND_RESET_PASSWORD_EMAIL, payload), null);
	};

	const sendResetPasswordMobile = (data) => {
		// return this.$store.dispatch(SEND_RESET_PASSWORD_MOBILE, data);
	};

	const resendVerifyMobileOtp = (data) => {
		// return this.$store.dispatch(RESEND_VERIFY_OTP_MOBILE, data);
		const { mobile, countryCode, token } = data;
		const id = window.APP_DATA.applicationID;
		const sendMobileOtpRequestInput = `{
			mobile: "${mobile}",
			country_code: "${countryCode}",
    	token: "${token}",
			action: resend,
		}`;
		const payload = [
			["$platform", `${id}`],
			["$sendMobileOtpRequestInput", `${sendMobileOtpRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(SEND_OTP_ON_MOBILE, payload), null);
	};

	const resendVerifyEmailOtp = (data) => {
		// return this.$store.dispatch(RESEND_VERIFY_OTP_EMAIL, data);
		const { email, registerToken, token } = data;
		const id = window.APP_DATA.applicationID;
		const sendEmailOtpRequestInput = `{
			email: "${email}",
			register_token: "${registerToken}",
    	token: "${token}",
			action: resend,
		}`;
		const payload = [
			["$platform", `${id}`],
			["$sendEmailOtpRequestInput", `${sendEmailOtpRequestInput}`],
		];
		return fpi.executeGraphQL(updateGraphQueryWithValue(SEND_OTP_ON_EMAIL, payload), null);
	};

	const verifyMobileOtp = (data) => {
		// return this.$store.dispatch(VERIFY_MOBILE_OTP, data);
		const { requestId = "", registerToken = "", otp, isEmailVerified, isRedirection } = data;
		const id = window.APP_DATA.applicationID;
		const verifyOtpRequestInput = `{
			otp: "${otp}",
			register_token: "${registerToken}",
    	request_id: "${requestId}",
		}`;
		const payload = [
			["$platform", `${id}`],
			["$verifyOtpRequestInput", `${verifyOtpRequestInput}`],
		];
		return fpi
			.executeGraphQL(updateGraphQueryWithValue(VERIFY_MOBILE_OTP, payload), null)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				const {
					user_exists: userExists,
					email,
					verify_email_link: verifyEmailLink,
				} = data?.verifyMobileOTP || {};
				if (userExists) {
					if (verifyEmailLink) {
						if (isRedirection) {
							const queryParams = new URLSearchParams(location.search);
							queryParams.set("email", email);
							navigate({
								pathname: "/auth/verify-email-link",
								search: queryParams.toString(),
							});
						}
					} else if (isRedirection) {
						const queryParams = new URLSearchParams(location.search);
						const redirectUrl = queryParams.get("redirectUrl") || "";
						window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
					}
				}
				return data;
			});
	};

	const verifyEmailOtp = (data) => {
		const { otp, email, registerToken, action, isMobileVerified, isRedirection } = data;
		const id = window.APP_DATA.applicationID;
		const verifyEmailOtpRequestInput = `{
			register_token: "${registerToken}",
			otp: "${otp}",
    	email: "${email}",
			action: "${action}"
		}`;
		const payload = [
			["$platform", `${id}`],
			["$verifyEmailOtpRequestInput", `${verifyEmailOtpRequestInput}`],
		];
		return fpi
			.executeGraphQL(updateGraphQueryWithValue(VERIFY_EMAIL_OTP, payload), null)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				if (isRedirection) {
					const queryParams = new URLSearchParams(location.search);
					const redirectUrl = queryParams.get("redirectUrl") || "";
					window.location.href = window.location.origin + decodeURIComponent(redirectUrl);
				}
				return data;
			});
	};

	const sendVerificationLinkEmail = (data) => {
		// return this.$store.dispatch(SEND_VERIFICATION_LINK_EMAIL, data);
	};

	const facebookText = useMemo(() => {
		if (facebookUser?.is_signed_in) {
			return `Continue as ${facebookUser.profile.full_name}`;
		}
		return "Login with Facebook";
	}, [facebookUser]);

	const facebookLogin = async () => {
		// const appId = this.platformData.social_tokens.facebook.app_id;
		// if (appId) {
		// 	if (!this.facebookUser?.is_signed_in) {
		// 		this.facebookUser = await loginUserInFb();
		// 	}
		// 	return this.$store.dispatch(FACEBOOK_LOGIN, {
		// 		facebook_user: this.facebookUser,
		// 	});
		// } else {
		// 	throw new Error('Facebook App ID not provided in platform');
		// }
	};

	const facebook = useMemo(() => ({ display_text: facebookText, login: facebookLogin }));

	const addEmail = (value) => {
		// const appName = platformData.name;
		// return this.$root.$apiSDK.user.addEmail({
		// 	platform: appName,
		// 	body: value,
		// });
	};

	const deleteUser = (data) => {
		// return this.$store.dispatch(DELETE_USER, data);
	};

	const sendForgotOtpMobile = (data) => {
		// return this.$store.dispatch(SEND_FORGOT_OTP_MOBILE, data);
	};

	const sendForgotOtpEmail = (data) => {
		// return this.$store.dispatch(SEND_FORGOT_OTP_EMAIL, data);
	};

	const verifyForgotMobileOtp = (data) => {
		// return this.$store.dispatch(VERIFY_MOBILE_FORGOT_OTP, data);
	};

	const verifyForgotEmailOtp = (data) => {
		// return this.$store.dispatch(VERIFY_EMAIL_FORGOT_OTP, data);
	};

	const resetForgotPassword = (data) => {
		// return this.$store.dispatch(RESET_FORGOT_PASSWORD, data);
	};

	return {
		userData,
		platformData,
		isLoggedIn,
		openLogin,
		openRegister,
		openForgotPassword,
		openHomePage,
		updateProfile,
		signOut,
		signIn,
		sendOtp,
		resendOtp,
		signInWithOtp,
		signUp,
		setPassword,
		sendOtpMobile,
		sendResetPasswordEmail,
		sendResetPasswordMobile,
		resendVerifyMobileOtp,
		resendVerifyEmailOtp,
		verifyMobileOtp,
		verifyEmailOtp,
		sendVerificationLinkEmail,
		facebook,
		addEmail,
	};
};
