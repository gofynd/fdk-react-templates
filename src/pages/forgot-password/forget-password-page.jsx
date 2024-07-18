import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import { useAccounts } from "../../helper/useAccounts";
import AuthContainer from "../../page-layouts/auth/auth-container/auth-container";
import * as styles from "./forget-password-page.less";

function ForgetPasswordPage({ fpi }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
		setError,
	} = useForm({
		defaultValues: {
			email: "",
		},
	});
	const emailInputId = useId();
	const [isSendResetPasswordSuccess, setIsSendResetPasswordSuccess] = useState(false);
	const { openLogin, sendResetPasswordEmail } = useAccounts({ fpi });

	const handleForgotPasswordSubmit = (data) => {
		const payload = { email: data.email };
		sendResetPasswordEmail(payload)
			.then((data) => {
				if (data?.errors) {
					throw data?.errors?.[0];
				}
				setIsSendResetPasswordSuccess(true);
			})
			.catch((err) => {
				setIsSendResetPasswordSuccess(false);
				setError("root", { message: err?.details?.error || err?.message });
			});
	};

	return (
		<AuthContainer>
			<div>
				<h1 className={styles.forgotPasswordTitle}>Reset Your Password</h1>
				{!isSendResetPasswordSuccess ? (
					<form
						className={styles.forgotPasswordWrapper}
						onSubmit={handleSubmit(handleForgotPasswordSubmit)}
					>
						<div className={styles.forgotPasswordInputGroup}>
							<label className={styles.loginInputTitle} htmlFor={emailInputId}>
								Email
							</label>
							<input
								id={emailInputId}
								type="text"
								{...register("email", {
									validate: (value) =>
										validateEmailField(value) || "Please enter valid email address",
								})}
							/>

							{errors.email && <p className={styles.emailErrorMessage}>{errors.email.message}</p>}
						</div>
						{errors.root && (
							<div className={styles.forgotPasswordAlert}>
								<span className={styles.alertMessage}>{errors.root.message}</span>
							</div>
						)}
						{/* Extension slot: above_reset_button */}
						<button className={styles.forgotPasswordSubmitBtn} disabled={!isValid} type="submit">
							RESET PASSWORD
						</button>
						<button className={styles.loginLink} onClick={() => openLogin({ redirect: false })}>
							Back to login
						</button>
						{/* Extension slot: below_reset_button */}
					</form>
				) : (
					<div className={styles.submitWrapper}>
						<p className={styles.submitSuccessMsg}>
							Reset Link has been sent to your primary email address.
						</p>
						<button
							className={styles.resendBtn}
							onClick={() => handleForgotPasswordSubmit(getValues())}
						>
							RESEND EMAIL
						</button>
					</div>
				)}
			</div>
		</AuthContainer>
	);
}

export default ForgetPasswordPage;
