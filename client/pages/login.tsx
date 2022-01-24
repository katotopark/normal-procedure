import { SyntheticEvent, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import routes from '../routes';
import { login, register } from '../api';
import LoginForm from '../components/LoginForm';

type Credentials = {
	name: string;
	password: string;
};

enum ButtonLabel {
	LOGIN = 'login',
	REGISTER = 'register',
}

const Login: NextPage = () => {
	return (
		<div>
			<LoginForm />
		</div>
	);
};

export default Login;
