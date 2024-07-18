import React, { useId } from "react";
// import { useGlobalStore } from 'fdk-core/utils';
// import { useNavigate, useSearchParams } from 'react-router-dom';
import { Controller } from "react-hook-form";
import { validateName } from "../../helper/utils";
import useRegister from "../../page-layouts/register/useRegister";
import AuthContainer from "../../page-layouts/auth/auth-container/auth-container";
import * as styles from "./register-page.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
// import Loader from '../../components/loader/loader';

function RegisterPage({ fpi }) {
	const firstnameId = useId();
	const lastnameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const {
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
		onRegisterFormSubmit,
	} = useRegister(fpi);

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
		getValues,
	} = registerForm;

	return (
		<AuthContainer>
			<div className={styles.containerWrapper}>
				{!showVerifyBoth ? (
					<form
						className={styles.registerFormWrapper}
						onSubmit={handleSubmit(onRegisterFormSubmit)}
					>
						<h1 className={styles.title}>Complete Signup</h1>
						<div
							className={`${styles.registerNameInput} ${errors.firstName ? styles.errorInput : ""}`}
						>
							<label className={styles.inputTitle} htmlFor={firstnameId}>
								First Name*
							</label>
							<input
								id={firstnameId}
								type="text"
								{...register("firstName", {
									validate: (value) => validateName(value) || "Please enter valid first name",
								})}
							/>
							{errors.firstName && <p className={styles.errorText}>{errors.firstName.message}</p>}
						</div>
						<div
							className={`${styles.registerNameInput} ${errors.lastName ? styles.errorInput : ""}`}
						>
							<label className={styles.inputTitle} htmlFor={lastnameId}>
								Last Name*
							</label>
							<input
								id={lastnameId}
								type="text"
								{...register("lastName", {
									validate: (value) => validateName(value) || "Please enter valid last name",
								})}
							/>
							{errors.lastName && <p className={styles.errorText}>{errors.lastName.message}</p>}
						</div>
						<div className={styles.genderRadioContainer}>
							<label className={styles.radioContainer}>
								Male
								<input type="radio" value="male" {...register("gender")} />
								<span className={styles.checkmark} />
							</label>
							<label className={styles.radioContainer}>
								Female
								<input type="radio" value="female" {...register("gender")} />
								<span className={styles.checkmark} />
							</label>
							<label className={styles.radioContainer}>
								Other
								<input type="radio" value="unisex" {...register("gender")} />
								<span className={styles.checkmark} />
							</label>
						</div>
						{isEmail && (
							<div className={`${styles.registerEmail} ${errors.email ? styles.errorInput : ""}`}>
								<label className={styles.inputTitle} htmlFor={emailId}>
									{`Email ${isEmailRequired}`}
								</label>
								<input
									id={emailId}
									type="text"
									{...register("email", {
										validate: (value) => validateEmail(value) || "Please enter valid email address",
									})}
								/>
								{errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
							</div>
						)}
						{isMobile && (
							<div className={styles.registerMobileInput}>
								<Controller
									name="phone"
									control={control}
									rules={{
										validate: (value) => {
											if (isMobileRequired === "required" || value?.mobile) {
												return value.isValidNumber || "Please enter valid phone number";
											}
											return true;
										},
									}}
									render={({ field, fieldState: { error } }) => (
										<MobileNumber
											mobile={field.value.mobile}
											countryCode={field.value.countryCode}
											isRequired={isMobileRequired}
											error={error}
											onChange={(value) => {
												field.onChange(value);
											}}
										/>
									)}
								/>
							</div>
						)}
						<div
							className={`${styles.registerPasswordInput} ${
								errors.password ? styles.errorInput : ""
							}`}
						>
							<label className={styles.inputTitle} htmlFor={passwordId}>
								Password*
							</label>
							<div className={styles.passwordInputWrapper}>
								<input
									id={passwordId}
									type={isPasswordShow ? "text" : "password"}
									{...register("password", {
										validate: (value) =>
											validatePassword(value) ||
											"Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character.",
									})}
								/>
								{watch("password") && (
									<button
										className={styles.passwordToggle}
										aria-label={!isPasswordShow ? "Show confirm password" : "Hide confirm password"}
										onClick={togglePasswordDisplay}
									>
										<SvgWrapper svgSrc={!isPasswordShow ? "show-password" : "hide-password"} />
									</button>
								)}
							</div>
							{errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
						</div>
						<div
							className={`${styles.registerConfirmPasswordInput} ${
								errors.confirmPassword ? styles.errorInput : ""
							}`}
						>
							<label className={styles.inputTitle} htmlFor={confirmPasswordId}>
								Confirm Password*
							</label>
							<div className={styles.passwordInputWrapper}>
								<input
									id={confirmPasswordId}
									type={isConfirmPasswordShow ? "text" : "password"}
									{...register("confirmPassword", {
										validate: (value) =>
											value === getValues("password") || "Password does not match",
									})}
								/>
								{watch("confirmPassword") && (
									<button
										className={styles.passwordToggle}
										aria-label={
											!isConfirmPasswordShow ? "Show confirm password" : "Hide confirm password"
										}
										onClick={toggleConfirmPasswordDisplay}
									>
										<SvgWrapper
											svgSrc={!isConfirmPasswordShow ? "show-password" : "hide-password"}
										/>
									</button>
								)}
							</div>
							{errors.confirmPassword && (
								<p className={styles.errorText}>{errors.confirmPassword.message}</p>
							)}
						</div>
						{errors.root && (
							<div className={styles.loginAlert}>
								<span>{errors.root.message}</span>
							</div>
						)}

						{/* Extension slot: above_register_button */}

						<button className={styles.registerBtn} type="submit">
							Continue
						</button>
						<LoginRegisterToggle fpi={fpi} />
					</form>
				) : (
					<VerifyBoth
						fpi={fpi}
						isShowVerifyEmail={isShowVerifyEmail}
						isShowVerifyMobile={isShowVerifyMobile}
						verifyBothData={verifyBothData}
					/>
				)}
			</div>
		</AuthContainer>
	);
}

export default RegisterPage;
