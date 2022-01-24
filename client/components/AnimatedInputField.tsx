import { animated, useSpring, useSpringRef } from 'react-spring';
import * as S from '../styles/AnimatedInputField.styles';

type Props = {
	handleChange: (e: React.SyntheticEvent) => void;
	label: string;
};

const AnimatedInputField: React.FC<Props> = ({ handleChange, label }: Props) => {
	const getRandomInteger = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const randomX = getRandomInteger(100, 250);

	const boxStyles = useSpring({
		loop: { reverse: true },
		from: { x: randomX },
		to: {
			x: 416,
		},
	});

	const ref = useSpringRef();
	const inputStyles = useSpring({
		loop: { reverse: true },
		from: { width: randomX - 16 },
		to: {
			width: 400,
		},
	});

	return (
		<S.Wrapper>
			<p className="label">{label}</p>
			<S.AnimatedInput
				id={label}
				name={label}
				onChange={handleChange}
				style={inputStyles}
				type={label.includes('pass') ? 'password' : 'text'}
			/>
			<S.AnimatedDiv style={boxStyles}>
				<S.Diagonal />
			</S.AnimatedDiv>
		</S.Wrapper>
	);
};

export default AnimatedInputField;
