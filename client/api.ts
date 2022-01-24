import axios, { AxiosRequestConfig } from 'axios';

type Credentials = {
	name: string;
	password: string;
};

interface ICase {
	id: number;
	case_number: string;
	department: string;
	player_id: number;
	paperworks: {
		case_id: number;
		coordinates: { x: number; y: number; z: number };
		document_type: string;
	};
}

axios.defaults.baseURL = 'http://localhost:5000';

const baseAxiosConfig: Partial<AxiosRequestConfig> = {
	method: 'GET',
	responseType: 'json',
	headers: {
		'x-access-token':
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiJlZjY5YTlmNy0yODllLTRhYmQtOGNlYy0yMTFlOTUwMWY0YTkiLCJleHAiOjE2NDIyNzg4MDh9.ZKMlB4TkQUeCs0HDmU9UNtauShoAPdqGzPJBb_Ncj0c',
	},
};

export const login = async (credentials: Credentials) => {
	const response = await axios({
		...baseAxiosConfig,
		data: credentials,
		method: 'POST',
		url: '/auth/login',
	});
	return response;
};

export const register = async (credentials: Credentials) => {
	const response = await axios({
		...baseAxiosConfig,
		data: credentials,
		method: 'POST',
		url: '/auth/register',
	});
	return response;
};

export const fetchCaseById = async (caseId: number): Promise<{ case: ICase; success: boolean }> => {
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

export const createCase = async (playerId: number) => {
	const response = await axios({
		...baseAxiosConfig,
		url: '/case',
		method: 'POST',
		data: { player_id: playerId },
	});
	return response;
};
