import { useContext, useEffect, useRef, useState } from "react";
import "../styles/pages/control.scss";
import createState, { useConservativeState } from "../../obj/state";
import { WIIOTNController, empty_wii_controller, key_map, mapSettingsToController } from "../../obj/interface";
import { SettingsContext, XboxControllerContext } from "../App";
import { ControllerSettings, WIIOTNSettings } from "../../storage";
import { xbox_buttons_map } from "../../storage/exports";

type ControlProps = {
	socket_id: number
}

function Control(props: ControlProps) {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const [current_button, setCurrentButton] = useState<string>('');
	const key_state = createState<Array<number>>([0]);
	const wii_controller = useRef(useConservativeState<WIIOTNController>({ ...empty_wii_controller, id: props.socket_id }, { ignore: ['id'] }));
	const controller_settings = useContext(SettingsContext).state as WIIOTNSettings;
	const controller = useContext(XboxControllerContext);

	useEffect(() => {
		if (controller_settings.selected_controller === 'keyboard') {
			const key_state_listener = (key: Array<number>) => {
				let mutated_key: number = 0;
				const transfered_key_map = mapSettingsToController(controller_settings.KeyboardSettings);
				key.forEach((key) => { mutated_key |= transfered_key_map[key] });

				if (wii_controller.current.getState().buttons_pressed == mutated_key) return;
				wii_controller.current.setState(old_state => { return { ...old_state, buttons_pressed: mutated_key } });
				console.log(wii_controller.current.getState());
				window.electron.ipcRenderer.sendMessage('udp-message', JSON.stringify({ ...wii_controller.current.getState(), time: Date.now() }));
			}

			key_state.addListener(key_state_listener);

			//add key listeners
			const keydown = (e: KeyboardEvent) => {
				setKeyStateReact(e);
				key_state.setState(old_state => [...old_state, e.keyCode]);
				//set 
			}
			const keyup = (e: KeyboardEvent) => {
				setKeyStateReact(e);
				key_state.setState(old_state => old_state.filter((key) => key != e.keyCode));
			}
			window.addEventListener('keydown', keydown);
			window.addEventListener('keyup', keyup);

			return () => {
				window.removeEventListener('keydown', keydown);
				window.removeEventListener('keyup', keyup);
				key_state.removeListener(key_state_listener);
			}
		} else if (controller_settings.selected_controller === 'xbox') {

			controller.addEventListener('buttonpress', (event: number[]) => {
				const transfered_button_map = mapSettingsToController(controller_settings.XboxSettings);
				let mutated_buttons: number = 0;
				let string_buttons = '';
				event.forEach((button: number) => { mutated_buttons |= transfered_button_map[button]; string_buttons += xbox_buttons_map[button] + ' ' });
				setCurrentButton(string_buttons);
				if (wii_controller.current.getState().buttons_pressed == mutated_buttons) return;
				wii_controller.current.setState(old_state => { return { ...old_state, buttons_pressed: Number(mutated_buttons) } });
				console.log(wii_controller.current.getState());
				window.electron.ipcRenderer.sendMessage('udp-message', JSON.stringify({ ...wii_controller.current.getState(), time: Date.now() }));
			});

			return () => {
				controller.removeEventListener('buttonpress');
			}
		}
	}, [])




	return (
		<div className="control-page inter fill-container fill-height flex center-flex column">
			<div className="control-page-box center-text">
				<span className="label select-none">Focus On This Window to Control Instance</span>
			</div>
			{controller_settings.selected_controller === 'keyboard' ?
				<span className="sub-label select-none flex">Current Key:{key_state_react?.key}</span>
				:
				<span className="sub-label select-none flex">Current Button:{current_button}</span>
			}
		</div>
	)
}

export default Control;
