import { useContext, useEffect, useRef, useState } from "react";
import "../styles/pages/control.scss";
import { SettingsContext } from "../App";
import { WIIOTNSettings } from "../../storage";
import { getController } from "../obj/Controller";
import createState from "../../obj/state";
import { getIPC } from "../IPC.e";

type ControlProps = {
	socket_id: number
}

function Control(props: ControlProps) {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const [current_button, setCurrentButton] = useState<string>('');
	const controller_settings = useContext(SettingsContext).state as WIIOTNSettings;
	const time_state = createState<number>(new Date().getTime());
	const [input_lag, setInputLag] = useState<number>(0);

	useEffect(() => {
		console.log("[DEBUG] ControllerSettings: ", controller_settings);
		let unmount_function: () => void = () => { };
		if (controller_settings.selected_controller === 'keyboard') {
			unmount_function = getController(props.socket_id).launchControllerProfile<KeyboardEvent>('keyboard', (key: KeyboardEvent) => {
				time_state.setState(new Date().getTime());
				setKeyStateReact(key);
			});
		} else {
			unmount_function = getController(props.socket_id).launchControllerProfile<string>('xbox', (button: string) => {
				time_state.setState(new Date().getTime());
				setCurrentButton(button);
			});
		}
		//success-packet
		getIPC().addEventListener('udp-success-packet', (event: any) => {
			console.log("[DEBUG -- udp-success-packet] Event OBJ: ", event);
			setInputLag(new Date().getTime() - time_state.getState());
		});
		return () => {
			unmount_function();
		}
	}, []);

	useEffect(() => {
		console.log("[DEBUG] Input Lag: ", input_lag);
	}, [input_lag])




	return (
		<div className="control-page inter fill-container fill-height flex center-flex column relative">
			<div className="control-page-box center-text">
				<span className="label select-none">Focus On This Window to Control Instance</span>
			</div>
			{controller_settings.selected_controller === 'keyboard' ?
				<span className="sub-label select-none flex">Current Key:{key_state_react?.key}</span>
				:
				<span className="sub-label select-none flex">Current Button:{current_button}</span>
			}
			<div className="absolute bottom-0 right-0">
				<span className="sub-label">Input Lag: {input_lag}ms</span>
			</div>
		</div>
	)
}

export default Control;
