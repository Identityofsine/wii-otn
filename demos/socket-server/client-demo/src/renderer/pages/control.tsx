import { useEffect, useState } from "react";
import "../styles/pages/control.scss";
import createState from "../../obj/state";

function Control() {

	const [key_state_react, setKeyStateReact] = useState<KeyboardEvent>();
	const key_state = createState<number>(0);


	useEffect(() => {

		key_state.addListener((key) => {
			console.log("CUSTOM_STATE:", key);
		});

		//add key listeners
		const keydown = (e: KeyboardEvent) => {
			setKeyStateReact(e);
			key_state.setState(e.keyCode);
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
