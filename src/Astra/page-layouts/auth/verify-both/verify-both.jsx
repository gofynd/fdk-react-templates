import React, { useState, useEffect, useMemo, useRef, useId } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./verify-both.less";
import { useAccounts } from "../../../helper/useAccounts";

function VerifyBoth({
	fpi,
	isShowVerifyMobile = true,
	isShowVerifyEmail = true,
	verifyBothData = {},
}) {
	const mobileForm = useForm({
		defaultValues: {
			otp: "",
		},
	});
	const mobileOtpId = useId();
	const [isValidMobileOtp, setIsValidMobileOtp] = useState(false);
	const [isShowResendMobileOtp, setIsShowResendMobileOtp] = useState(false);
	const [mobileOtpTime, setMobileOtpTime] = useState(30);
	const mobileTimerRef = useRef(null);

	const emailForm = useForm({
		defaultValues: {
			otp: "",
		},
	});
	const emailOtpId = useId();
	const [isValidEmailOtp, setIsValidEmailOtp] = useState(false);
	const [isShowResendEmailOtp, setIsShowResendEmailOtp] = useState(false);
	const [emailOtpTime, setEmailOtpTime] = useState(90);
	const emailTimerRef = useRef(null);

	const {
		isLoggedIn,
		verifyMobileOtp,
		resendVerifyMobileOtp,
		verifyEmailOtp,
		resendVerifyEmailOtp,
	} = useAccounts({
		fpi,
	});

	const isShowMobileOtp = useMemo(() => {
		if (isShowVerifyMobile) {
			return !isValidMobileOtp;
		}
		return false;
	}, [isShowVerifyMobile, isValidMobileOtp]);

	const isShowEmailOtp = useMemo(() => {
		if (isShowVerifyEmail) {
			return !isValidEmailOtp;
		}
		// setIsShowEmail(false);
		return false;
	}, [isShowVerifyEmail, isValidEmailOtp]);

	const mobileTimer = (time) => {
		if (mobileTimerRef.current) {
			clearInterval(mobileTimerRef.current);
		}

		setMobileOtpTime(time);
		setIsShowResendMobileOtp(false);

		mobileTimerRef.current = setInterval(() => {
			setMobileOtpTime((prevRemaining) => {
				if (prevRemaining <= 1) {
					clearInterval(mobileTimerRef.current);
					setIsShowResendMobileOtp(true);
					return 0;
				}
				return prevRemaining - 1;
			});
		}, 1000);
	};

	const emailTimer = (time) => {
		if (emailTimerRef.current) {
			clearInterval(emailTimerRef.current);
		}

		setEmailOtpTime(time);
		setIsShowResendEmailOtp(false);

		emailTimerRef.current = setInterval(() => {
			setEmailOtpTime((prevRemaining) => {
				if (prevRemaining <= 1) {
					clearInterval(emailTimerRef.current);
					setIsShowResendEmailOtp(true);
					return 0;
				}
				return prevRemaining - 1;
			});
		}, 1000);
	};

	const handleVerifyMobile = (data) => {
		if (!data.otp) {
			return;
		}
		const payload = {
			requestId: verifyBothData?.request_id,
			registerToken: verifyBothData?.register_token,
			otp: data.otp,
			isEmailVerified: false,
			isRedirection: true,
		};
		verifyMobileOtp(payload)
			.then(() => {
				setIsValidMobileOtp(true);
			})
			.catch((err) => {
				setIsValidMobileOtp(false);
				mobileForm.setError("root", { message: err || "" });
			});
	};

	const handleResendMobileOtp = (e) => {
		e.stopPropagation();
		const payload = {
			mobile: verifyBothData.mobile,
			countryCode: verifyBothData.country_code,
			token: verifyBothData.resend_token,
		};
		resendVerifyMobileOtp(payload).then((data) => {
			console.log("handleResendMobileOtp", { data });
			const response = data.SendOTPOnMobile;
			setIsShowResendMobileOtp(false);
			setMobileOtpTime(response?.resend_timer || 30);
			mobileTimer(response?.resend_timer || 30);
		});
	};

	const handleVerifyEmail = (data) => {
		if (!data.otp) {
			return;
		}
		const payload = {
			otp: data.otp,
			email: verifyBothData.email,
			registerToken: verifyBothData.register_token,
			action: isLoggedIn ? "verify" : "register",
			isRedirection: true,
		};
		verifyEmailOtp(payload)
			.then(() => {
				setIsValidEmailOtp(true);
			})
			.catch((err) => {
				setIsValidEmailOtp(false);
				emailForm.setError("root", { message: err || "" });
			});
	};
	const handleResendEmailOtp = (e) => {
		e.stopPropagation();
		const payload = {
			email: verifyBothData.email,
			registerToken: verifyBothData.register_token,
			token: verifyBothData.resend_email_token,
		};
		resendVerifyEmailOtp(payload).then(() => {
			// const response = data.SendOTPOnEmail;
			setIsShowResendEmailOtp(false);
			setEmailOtpTime(90);
			emailTimer(90);
		});
	};

	useEffect(() => {
		mobileTimer(verifyBothData?.resend_timer || 30);
		emailTimer(90);
		return () => {
			clearInterval(mobileTimerRef.current);
			clearInterval(emailTimerRef.current);
		};
	}, []);

	return (
		<div className={styles.verifyBoth}>
			{isShowMobileOtp && (
				<div className={styles.formWrapper}>
					<h3 className={styles.header}>Verify Mobile</h3>
					<form
						className={styles.verifyOtpForm}
						onSubmit={mobileForm.handleSubmit(handleVerifyMobile)}
					>
						<div>
							<p className={styles.otpSentMessage}>{`OTP sent to ${verifyBothData?.mobile}`}</p>
							<div className={styles.inputGroup}>
								<label className={styles.label} htmlFor={mobileOtpId}>
									Enter OTP
								</label>
								<input
									id={mobileOtpId}
									type="number"
									maxLength={4}
									{...mobileForm.register("otp")}
								/>
							</div>
						</div>
						{mobileForm.formState.errors.root && (
							<div className={styles.loginAlert}>
								<span>{mobileForm.formState.errors.root.message}</span>
							</div>
						)}
						<button className={styles.submitBtn} type="submit" disabled={!mobileForm.watch("otp")}>
							Submit
						</button>

						<div className={styles.resendOtpWrapper}>
							<button
								className={styles.resendOtpBtn}
								onClick={handleResendMobileOtp}
								disabled={!isShowResendMobileOtp}
							>
								Resend OTP
								{!isShowResendMobileOtp && ` (${mobileOtpTime}S)`}
							</button>
						</div>
					</form>
				</div>
			)}
			{isShowEmailOtp && (
				<div className={styles.formWrapper}>
					<h3 className={styles.header}>Verify Email</h3>
					<form
						className={styles.verifyOtpForm}
						onSubmit={emailForm.handleSubmit(handleVerifyEmail)}
					>
						<div>
							<p className={styles.otpSentMessage}>{`OTP sent to ${verifyBothData?.email}`}</p>
							<div className={styles.inputGroup}>
								<label className={styles.label} htmlFor={emailOtpId}>
									Enter OTP
								</label>
								<input id={emailOtpId} type="number" maxLength={4} {...emailForm.register("otp")} />
							</div>
						</div>
						{emailForm.formState.errors.root && (
							<div className={styles.loginAlert}>
								<span>{emailForm.formState.errors.root.message}</span>
							</div>
						)}
						<button className={styles.submitBtn} type="submit" disabled={!emailForm.watch("otp")}>
							<span>Submit</span>
						</button>
						<div className={styles.resendOtpWrapper}>
							<button
								className={styles.resendOtpBtn}
								onClick={handleResendEmailOtp}
								disabled={!isShowResendEmailOtp}
							>
								Resend OTP
								{!isShowResendEmailOtp && ` (${emailOtpTime}S)`}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default VerifyBoth;
