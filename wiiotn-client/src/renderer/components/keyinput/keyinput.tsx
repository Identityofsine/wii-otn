import { useEffect, useState } from "react";
import { ControllerSettings } from "../../../storage";
import { button_map } from "../../../storage/exports";

interface KeyInputProp<T extends ControllerSettings> {
	key_identifier: keyof T['key_map'];
	onKeyUpdate: (key: keyof T['key_map'], value: number) => void;
	default_value?: number;
}

const mutate_key_code = (key_code: number) => {
	let key_char = String.fromCharCode(key_code) ?? 0;
	if (key_code === 0) key_char = 'N/A';
	if (key_code === 32) key_char = '␣';
	if (key_code === 13) key_char = 'Enter';
	if (key_code === 8) key_char = 'Backspace';
	if (key_code === 9) key_char = 'Tab';
	if (key_code === 27) key_char = 'Esc';
	//arrow keys
	if (key_code === 37) key_char = '←';
	if (key_code === 38) key_char = '↑';
	if (key_code === 39) key_char = '→';
	if (key_code === 40) key_char = '↓';
	return key_char ?? 0;
}

function KeyInput<T extends ControllerSettings>(props: KeyInputProp<T>) {
	const [key, setKey] = useState<{ key: string, code: number }>({ key: '', code: 0 });

	useEffect(() => {
		if (props.default_value) {
			let key_char = mutate_key_code(props.default_value);
			setKey({ key: key_char, code: props.default_value })
		}
	}, [])



	useEffect(() => {
		props.onKeyUpdate(props.key_identifier, key.code);
	}, [key])

	//treat key_code as uppercase
	const change_current_key = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 1) {
			const key_code = event.target.value.toUpperCase().charCodeAt(event.target.value.length - 1);
			const key = mutate_key_code(key_code);
			return setKey({ key: key, code: key_code });
		} else {
			const key_code = event.target.value.toUpperCase().charCodeAt(0);
			const key = mutate_key_code(key_code);
			return setKey({ key: key, code: event.target.value.toUpperCase().charCodeAt(0) });
		}
	}

	const select_all_text = (event: React.FocusEvent<HTMLInputElement>) => {
		event.target.select();
	}

	const handle_arrow_key_press = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const key = event.key;
		if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
			event.preventDefault();
			const unicode_arrow_map: { [key: string]: string } = {
				'ArrowUp': '↑',
				'ArrowRight': '→',
				'ArrowDown': '↓',
				'ArrowLeft': '←'
			}
			if (unicode_arrow_map[key])
				setKey({ key: unicode_arrow_map[key], code: event.keyCode });
			return;
		}
		else {
			return;
		}
	}



	return (
		<div className="key-input flex column justify-center align-center" >
			<span className="key-label inter" > {props.key_identifier ? button_map[props.key_identifier as number] : 'N/A'} </span>
			< input
				className="key-input-field inter select-none"
				type="text"
				value={key.key}
				onChange={change_current_key}
				onSelect={select_all_text}
				onKeyDown={handle_arrow_key_press}
			/>
		</div>
	)
}

export default KeyInput;