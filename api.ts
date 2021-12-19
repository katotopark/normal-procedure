import axios, { AxiosRequestConfig } from 'axios';

type Credentials = {
	password: string;
	player: string;
};

axios.defaults.baseURL = 'http://localhost:5000';

const baseAxiosConfig: Partial<AxiosRequestConfig> = {
	method: 'GET',
	responseType: 'json',
};

export const login = async (credentials: Credentials) => {
	const response = await axios({
		...baseAxiosConfig,
		data: credentials,
		method: 'POST',
		url: '/auth/login',
	});
	return response.data;
};

export const register = async (credentials: Credentials) => {
	const response = await axios({
		...baseAxiosConfig,
		data: credentials,
		method: 'POST',
		url: '/auth/register',
	});
	return response.data;
};

export const fetchCaseById = async (caseId: number) => {
	const response = await axios({ ...baseAxiosConfig, url: `/case/${caseId}` });
	return response.data;
};

export const fetchCasesByPlayerId = async (playerId: number) => {
	const response = await axios({
		...baseAxiosConfig,
		url: `/player/${playerId}/cases`,
	});
	return response.data;
};
