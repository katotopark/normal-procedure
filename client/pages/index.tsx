import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuery } from 'react-query';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import { fetchCaseById } from '../api';

const Div = styled.div`
	background-color: red;
`;

const playerId = 1;
const id = 59;

interface IPaperwork {
	case_id: number;
	coordinates: { x: number; y: number; z: number };
	document_type: string;
}

interface ICase {
	id: number;
	case_number: string;
	department: string;
	player_id: number;
	paperworks: IPaperwork[];
}

const Paperwork: React.FC<JSX.IntrinsicElements['mesh']> = (
	props: JSX.IntrinsicElements['mesh']
) => {
	const mesh = useRef<THREE.Mesh>(null!);
	useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
	return (
		<mesh {...props} ref={mesh}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={'orange'} />
		</mesh>
	);
};

const Index: NextPage = () => {
	const [cluster, setCluster] = useState();
	const { data }: any = useQuery(['case', id], () => fetchCaseById(id), {
		onSuccess: (data) => console.log(data),
	});

	const mapCoordinates = ({ x, y, z }: { x: number; y: number; z: number }) => {
		return [x, y, z];
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Normal Procedure</title>
				<meta name="Normal Procedure" content="A bureaucratic game" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Canvas>
					<ambientLight />
					<pointLight position={[10, 10, 10]} />
					<Paperwork position={[0.7, 0.1, 0.6]} />
				</Canvas>
			</main>
		</div>
	);
};

export default Index;
