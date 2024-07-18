import { useEffect } from 'react';
import { useGlobalStore } from 'fdk-core/utils';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateGraphQueryWithValue } from '../../helper/utils';
import { SEND_RESET_TOKEN } from '../../queries/authQuery';
import { useAccounts } from '../../helper/useAccounts';

const useSetPassword = (fpi) => {
	const { setPassword } = useAccounts({ fpi });
	const location = useLocation;
	const setPasswordForm = useForm({
		defaultValues: {
			newPassword: '',
			confirmNewPassword: '',
		},
	});

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const payload = [['$code', `${query.get('code')}`]];
		fpi
			.executeGraphQL(updateGraphQueryWithValue(SEND_RESET_TOKEN, payload), null)
			.then((res) => res);
	}, []);

	const handleSetPassword = (data) => {
		const query = new URLSearchParams(location.search);
		return setPassword({
			password: data.newPassword,
			code: query.get('code'),
		})
			.then((res) => {
				console.log({ res });
			})
			.catch((err) => {});
	};

	return {
		setPasswordForm,
		handleSetPassword,
	};
};

export default useSetPassword;
