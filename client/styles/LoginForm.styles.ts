import styled from 'styled-components';

export const Wrapper = styled.div`
	width: 35rem;
	height: 25rem;
	top: -50%;
	transform: translateY(50%);
	margin: 0 auto;
	border: 4px solid black;
`;

export const Section = styled.section`
	width: 90%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 1.5rem auto;

	&.buttons p {
		margin: 0.5rem 0;
		font-size: 12px;
		font-weight: bold;
		text-transform: uppercase;
	}
`;

export const PrimaryButton = styled.button`
	padding-bottom: 0.25rem;
	font-size: 32px;
	font-weight: bold;
	text-transform: uppercase;
	border: none;
	border-bottom: 3px solid black;
	border-radius: 0;
	background-color: transparent;
	color: black;

	&:hover {
		cursor: pointer;
		border-bottom: 4px solid black;
		border-right: 4px solid black;
	}
`;

export const SecondaryButton = styled(PrimaryButton)`
	padding: 0;
	padding-bottom: 0.25rem;
	font-size: 16px;
	border-bottom: 2px solid black;

	&:hover {
		border-bottom: 3px solid black;
		border-right: none;
	}
`;
