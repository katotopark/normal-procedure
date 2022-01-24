import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'react-query';

import routes from '../routes';
import { login, register } from '../api';
import * as S from '../styles/LoginForm.styles';
import AnimatedInputField from './AnimatedInputField';

type Credentials = {
	name: string;
	password: string;
};

enum ButtonLabel {
	LOGIN = 'login',
	REGISTER = 'register',
}

const LoginForm = (): JSX.Element => {
	const [credentials, setCredentials] = useState<Credentials>({ name: '', password: '' });
	const [actionButtonLabel, setActionButtonLabel] = useState<ButtonLabel>(ButtonLabel.REGISTER);
	const router = useRouter();
	const mutation = useMutation((credentials: Credentials) => getMutationFunction(credentials), {
		onError: (error) => router.push(routes.error),
		onSuccess: (data) => {
			router.push(routes.dashboard);
		},
	});

	const getMutationFunction = (data: Credentials) =>
		actionButtonLabel === ButtonLabel.LOGIN ? login(data) : register(data);

	const handleChange = (e: React.SyntheticEvent) => {
		const { name, value } = e.target as HTMLInputElement;
		setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
	};

	const handleSubmit = () => {
		mutation.mutate(credentials);
	};

	const changeMode = () =>
		actionButtonLabel === ButtonLabel.LOGIN
			? setActionButtonLabel(ButtonLabel.REGISTER)
			: setActionButtonLabel(ButtonLabel.LOGIN);

	const getSecondaryButtonLabel = () =>
		actionButtonLabel === ButtonLabel.LOGIN ? ButtonLabel.REGISTER : ButtonLabel.LOGIN;

	return (
		<S.Wrapper>
			<S.Section className="fields">
				<AnimatedInputField handleChange={handleChange} label="name" />
				<AnimatedInputField handleChange={handleChange} label="password" />
			</S.Section>
			<S.Section className="buttons">
				<S.PrimaryButton type="submit" onClick={handleSubmit}>
					{actionButtonLabel}
				</S.PrimaryButton>
				<p>or</p>
				<S.SecondaryButton type="button" onClick={changeMode}>
					{getSecondaryButtonLabel()}
				</S.SecondaryButton>
			</S.Section>
		</S.Wrapper>
	);
};

export default LoginForm;
