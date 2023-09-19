import React from 'react'
import '../../styles/textinput.scss';
import { GenericIHDOM } from '../genericdom';
import { IconProps } from '../icon/IHIcon.type';
import IHIcon from '../icon/IHIcon';


export interface TextInputRules {
	//rules for text input
	min_length?: number,
	max_length?: number,
	//if number
	max_value?: number,
	min_value?: number,
}


type TextInputProps = {
	onChange?: (new_input: string) => void,
	input_type?: React.HTMLInputTypeAttribute | undefined,
	placeholder?: string,
	defaultValue?: string | number | any,
	read_only?: boolean,
	icon?: IconProps,
	rules?: TextInputRules,
} & GenericIHDOM

function TextInput(props: TextInputProps) {

	const [input, setInput] = React.useState<string | number | any>(props.defaultValue || '');

	//apply props.rules to input
	const applyRules = (value: number | string) => {
		//handle strings first
		if (typeof value === 'string') {

		}
		//then handle numbers
		else if (typeof value === 'number') {
			//apply max, min rules [check if they exist]
			if (props.rules?.max_value) {
				if (value > props.rules.max_value) {
					return value as unknown as string;
				}
			} else if (props.rules?.min_value) {
				if (value < props.rules.min_value) {
					return value as unknown as string;
				}
			}
		}
		//cast to string, cast to string before returning.
		if (props.rules?.max_length) {
			if ((value + '').length > props.rules.max_length) {
				return (value + '').slice(0, props.rules.max_length);
			}
		} else if (props.rules?.min_length) {
			if ((value + '').length < props.rules.min_length) {

				return (value + '').slice(0, props.rules.min_length);
			}
		}

		return value;
	}

	//gets called on every Change
	const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
		//check if type is number
		let new_input = e.target.value;
		if (props.input_type === 'number' && !Number.isNaN(parseInt(new_input))) {
			//filter into number only
			new_input = e.target.value.replace(/[^0-9]/g, '');
			new_input = applyRules(parseInt(new_input)) as string;
		} else {
			new_input = applyRules(new_input) as string;
		}

		setInput(new_input);
		props.onChange && props.onChange(new_input);
	}

	return (
		<input className={`text-input border-box ${props.className && props.className} ${props.read_only && 'read-only'}`} style={props.style} type={props.input_type} onChange={onChangeFunction} placeholder={props.placeholder} value={input} readOnly={props.read_only}>
		</input>
	)
}

export default TextInput
