import { useContext, useEffect, useRef, useState } from "react";
import "../styles/pages/control.scss";
import { SettingsContext } from "../App";
import { WIIOTNSettings } from "../../storage";
import { getController } from "../obj/Controller";

type ControlProps = {
	socket_id: number
}

function Control(props: ControlProps) {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const [current_button, setCurrentButton] = useState<string>('');
	const controller_settings = useContext(SettingsContext).state as WIIOTNSettings;

	useEffect(() => {
		console.log("[DEBUG] ControllerSettings: ", controller_settings);
		let unmount_function: () => void = () => { };
		if (controller_settings.selected_controller === 'keyboard') {
			unmount_function = getController(props.socket_id).launchControllerProfile<KeyboardEvent>('keyboard', (key: KeyboardEvent) => {
				setKeyStateReact(key);
			});
		} else {
			unmount_function = getController(props.socket_id).launchControllerProfile<string>('xbox', (button: string) => {
				setCurrentButton(button);
			});
		}
		return () => {
			unmount_function();
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
