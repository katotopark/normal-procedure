import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { fetchCaseById, fetchCasesByPlayerId } from '../api';
import routes from '../routes';
import styled from 'styled-components';

const playerId = 1;
const id = 59;

const CaseCard = styled.button`
	width: 200px;
	height: 200px;
	border: 2px solid black;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;

	p {
		margin: 0.5rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 16px;
		line-height: 1rem;
	}
`;

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

const Dashboard: NextPage = () => {
	const router = useRouter();
	const { data } = useQuery(['cases', playerId], () => fetchCasesByPlayerId(playerId), {
		onError: (error) => {
			console.error(error);
			router.push(routes.error);
		},
		onSuccess: (data) => {
			console.log(data);
		},
		refetchOnWindowFocus: false,
	});

	const getCaseById = useQuery(['case', id], () => fetchCaseById(id), {
		onSuccess: (data) => console.log(data),
	});

	return (
		<div>
			<h3>Dashboard</h3>
			{data.total_count <= 0 ? (
				<>
					<p>You have 0 active cases. Click the button below to initiate one.</p>
					<button type="button" onClick={() => router.push(routes.assign)}>
						Initiate
					</button>
				</>
			) : (
				data.cases.map(({ case_number, department, id }: ICase) => (
					<CaseCard type="button" key={id} onClick={() => getCaseById}>
						<p>CASE NUMBER: {case_number}</p>
						<p>DEPARTMENT: {department}</p>
					</CaseCard>
				))
			)}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['cases', playerId], () => fetchCasesByPlayerId(playerId));

	return {
		props: { dehydratedState: dehydrate(queryClient) },
	};
};

export default Dashboard;
