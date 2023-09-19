import { useEffect, useState } from "react";
import "../styles/pages/control.scss";
import createState from "../../obj/state";
import { WIIOTNController, empty_wii_controller, key_map } from "../../obj/interface";

function Control() {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const key_state = createState<number>(0);
	const wii_controller = createState<WIIOTNController>(empty_wii_controller);

	useEffect(() => {

		const key_state_listener = (key: number) => {
			const mutated_key = key_map[key] || 0;
			wii_controller.setState(old_state => { return { ...old_state, buttons_pressed: mutated_key } });
			window.electron.ipcRenderer.sendMessage('udp-message', JSON.stringify(wii_controller.getState()));
		}

		key_state.addListener(key_state_listener);

		//add key listeners
		const keydown = (e: KeyboardEvent) => {
			setKeyStateReact(e);
			key_state.setState(old_state => e.keyCode | old_state);
		}
		const keyup = (e: KeyboardEvent) => {
			setKeyStateReact(e);
			key_state.setState(0);
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
		<div className="control-page inter full-width full-height flex center-flex column">
			<div className="control-page-box center-text">
				<span className="label select-none">Focus On This Window to Control Instance</span>
			</div>
			<span className="sub-label select-none flex">Current Key:{key_state_react?.key}</span>
		</div>
	)
}

export default Control;
