import { useState, useMemo } from 'react';
import { useGlobalStore } from 'fdk-core/utils';

const useAuth = (fpi) => {
	const [isPasswordToggle, setIsPasswordToggle] = useState(false);
	const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);
	const appFeatures = useGlobalStore(fpi.getters.APP_FEATURES);

	const logo = useMemo(
		() => ({
			desktopLogo: platformData?.desktop_image,
			mobileImage: platformData?.mobile_image || platformData?.desktop_image,
		}),
		[platformData],
	);

	const showLoginModeButton = useMemo(
		() => platformData?.login?.otp && platformData?.login?.password,
		[platformData],
	);

	const isPassword = useMemo(() => {
		if (platformData?.login?.otp && platformData?.login?.password) {
			return isPasswordToggle;
		}
		return platformData?.login?.password;
	}, [platformData, isPasswordToggle]);

	const isOtp = useMemo(() => {
		if (platformData?.login?.otp && platformData?.login?.password) {
			return !isPasswordToggle;
		}
		return platformData?.login?.otp;
	}, [platformData, isPasswordToggle]);

	const toggleLoginMode = () => {
		setIsPasswordToggle((prevState) => !prevState);
	};

	return {
		platformData,
		appFeatures,
		logo,
		showLoginModeButton,
		isPassword,
		isOtp,
		toggleLoginMode,
	};
};

export default useAuth;
