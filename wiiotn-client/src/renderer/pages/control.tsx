import { useContext, useEffect, useState } from "react";
import "../styles/pages/control.scss";
import createState from "../../obj/state";
import { WIIOTNController, empty_wii_controller, key_map, mapSettingsToController } from "../../obj/interface";
import { SettingsContext } from "../App";

type ControlProps = {
	socket_id: number
}

function Control(props: ControlProps) {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const key_state = createState<Array<number>>([0]);
	const wii_controller = createState<WIIOTNController>({ ...empty_wii_controller, id: props.socket_id });
	const controller_settings = useContext(SettingsContext);

	useEffect(() => {

		const key_state_listener = (key: Array<number>) => {
			let mutated_key: number = 0;
			const transfered_key_map = mapSettingsToController(controller_settings.state);
			key.forEach((key) => { mutated_key |= transfered_key_map[key] });

			if (wii_controller.getState().buttons_pressed == mutated_key) return;
			wii_controller.setState(old_state => { return { ...old_state, buttons_pressed: mutated_key } });
			console.log(wii_controller.getState());
			window.electron.ipcRenderer.sendMessage('udp-message', JSON.stringify({ ...wii_controller.getState(), time: Date.now() }));
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
	}, [])


	return (
		<div className="control-page inter fill-container fill-height flex center-flex column">
			<div className="control-page-box center-text">
				<span className="label select-none">Focus On This Window to Control Instance</span>
			</div>
			<span className="sub-label select-none flex">Current Key:{key_state_react?.key}</span>
		</div>
	)
}

export default Control;
