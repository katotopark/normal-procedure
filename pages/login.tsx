import { SyntheticEvent, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import routes from '../routes';
import { login, register } from '../api';

type Credentials = {
	password: string;
	player: string;
};

enum ButtonLabel {
	LOGIN = 'login',
	REGISTER = 'register',
}

const Login: NextPage = () => {
	const [player, setPlayer] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [actionButtonLabel, setActionButtonLabel] = useState<ButtonLabel>(ButtonLabel.REGISTER);
	const router = useRouter();
	const mutation = useMutation((credentials: Credentials) => getMutationFunction(credentials), {
		onError: (error) => {
			console.error('there was an error', error);
			router.push(routes.error);
		},
		onSuccess: (data) => {
			router.push(routes.root);
		},
	});

	const getMutationFunction = (credentials: Credentials) =>
		actionButtonLabel === ButtonLabel.LOGIN ? login(credentials) : register(credentials);

	const handleChange = (e: SyntheticEvent) => {
		const { name, value } = e.target as HTMLInputElement;
		name.includes('pass') ? setPassword(value) : setPlayer(value);
	};

	const handleSubmit = () => {
		mutation.mutate({
			password,
			player,
		});
	};

	const changeMode = () =>
		actionButtonLabel === ButtonLabel.LOGIN
			? setActionButtonLabel(ButtonLabel.REGISTER)
			: setActionButtonLabel(ButtonLabel.LOGIN);

	const getSecondaryButtonLabel = () =>
		actionButtonLabel === ButtonLabel.LOGIN ? ButtonLabel.REGISTER : ButtonLabel.LOGIN;

	return (
		<div>
			<label htmlFor="player">Full Name</label>
			<input type="text" id="player" name="player" onChange={handleChange} />
			<label htmlFor="pass">Password</label>
			<input type="password" id="pass" name="password" onChange={handleChange} />
			<button type="submit" onClick={handleSubmit}>
				{actionButtonLabel}
			</button>
			<button type="button" onClick={changeMode}>
				{getSecondaryButtonLabel()}
			</button>
		</div>
	);
};

export default Login;
