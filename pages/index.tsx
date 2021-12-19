import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { fetchCasesByPlayerId } from '../api';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';

const Div = styled.div`
	background-color: red;
`;

const playerId = 1;

const Index: NextPage = () => {
	const { data, isSuccess } = useQuery(['case', playerId], () => fetchCasesByPlayerId(playerId), {
		onError: (error) => console.error(error),
		onSuccess: (data) => console.log(data),
		refetchOnWindowFocus: false,
	});

	return (
		<div className={styles.container}>
			<Head>
				<title>Normal Procedure</title>
				<meta name="Normal Procedure" content="A bureaucratic game" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Div>I am so styled</Div>
				<h1 className={styles.title}>
					Welcome to <a href="https://nextjs.org">Next.js!</a>
				</h1>
			</main>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['case', playerId], () => fetchCasesByPlayerId(playerId));

	return {
		props: { dehydratedState: dehydrate(queryClient) },
	};
};

export default Index;
