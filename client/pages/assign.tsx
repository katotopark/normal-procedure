import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import * as api from '../api';
import routes from '../routes';

const Assign: NextPage = () => {
	const router = useRouter();
	const mutation = useMutation((playerId: number) => api.createCase(playerId), {
		onError: (error) => {
			console.error(error);
			router.push(routes.error);
		},
		onSuccess: (data) => {
			console.log(data);
			router.push(routes.root);
		},
	});

	const handleCreate = () => {
		mutation.mutate(1);
	};

	return (
		<div>
			<p>Here be the assigning</p>
			<button type="button" onClick={handleCreate}>
				Create Case
			</button>
		</div>
	);
};

export default Assign;
