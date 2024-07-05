import React from "react";
import useSetPassword from "../../page-layouts/set-password/useSetPassword";
import { validatePasswordField } from "../../helper/utils";
import AuthContainer from "../../page-layouts/auth/auth-container/auth-container";
import * as styles from "./set-password-page.less";

function SetPasswordPage({ fpi }) {
	const { setPasswordForm, handleSetPassword } = useSetPassword(fpi);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
	} = setPasswordForm;

	return (
		<AuthContainer>
			<form className={styles.setWrapper} onSubmit={handleSubmit(handleSetPassword)}>
				<div className={styles.setContentTitle}>Create New Password</div>
				<div
					className={`${styles.setInputGroup} ${errors.newPassword ? `${styles.errorInput}` : ""}`}
				>
					<label className={styles.setInputTitle} htmlFor="newPassword">
						New Password
					</label>
					<input
						type="password"
						{...register("newPassword", {
							validate: (value) =>
								validatePasswordField(value) ||
								"Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character.",
						})}
					/>
					{errors.newPassword && <p className={styles.errorText}>{errors.newPassword.message}</p>}
				</div>

				<div
					className={`${styles.setInputGroup} ${
						errors.confirmNewPassword ? `${styles.errorInput}` : ""
					}`}
				>
					<label className={styles.setInputTitle} htmlFor="confirmNewPassword">
						Confirm New Password
					</label>
					<input
						type="password"
						{...register("confirmNewPassword", {
							validate: (value) => value === getValues("newPassword") || "Password does not match",
						})}
					/>
					{errors.confirmNewPassword && (
						<p className={styles.errorText}>{errors.confirmNewPassword.message}</p>
					)}
				</div>
				{errors.root && (
					<div className={styles.loginAlert}>
						<span>{errors.root.message}</span>
					</div>
				)}

				<button className={styles.setSubmitBtn} type="submit" disabled={!isValid}>
					Set Password
				</button>
			</form>
		</AuthContainer>
	);
}

export default SetPasswordPage;
