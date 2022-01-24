import styled from 'styled-components';
import { animated } from 'react-spring';

let boxSize: number | string = 5;
let hypotenuse: number | string = Math.sqrt(Math.pow(boxSize, 2) + Math.pow(boxSize, 2));
const lineHeight = '2rem';
const lineThickness = '0.125rem';
boxSize = `${boxSize}rem`;
hypotenuse = `${hypotenuse}rem`;

export const Wrapper = styled.div`
	width: 100%;
	display: inline-block;
	margin-top: 3rem;
	position: relative;

	p.label {
		width: 5rem;
		margin: 0;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
		text-transform: uppercase;
		line-height: 2rem;
	}
`;

export const AnimatedDiv = styled(animated.div)`
	width: ${boxSize};
	height: ${boxSize};
	background-color: black;
	position: absolute;
	top: ${`calc(-${boxSize} + ${lineHeight})`};
`;

export const Diagonal = styled.div`
	width: ${hypotenuse};
	border-top: ${lineThickness} solid white;
	transform: rotate(45deg);
	transform-origin: 0% 0%;
`;

export const AnimatedInput = styled(animated.input)`
	height: ${boxSize};
	font-family: monospace;
	font-size: ${`calc(${boxSize} * 0.8)`};
	background-color: transparent;
	border: none;
	border-bottom: ${lineThickness} solid black;
	border-radius: 0;
	transform: ${`translate(6rem, -${boxSize})`};
	position: absolute;

	&:focus {
		outline: none;
	}
`;
