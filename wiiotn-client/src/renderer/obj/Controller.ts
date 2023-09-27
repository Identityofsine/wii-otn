import { WIIOTNController, empty_wii_controller, mapSettingsToController } from "../../obj/interface";
import createState, { useConservativeState } from "../../obj/state";
import { WIIOTNSettings } from "../../storage";
import { xbox_buttons_map } from "../../storage/exports";
import { getIPC } from "../IPC.e";
import { Axis, static_axes, ControllerEvent, ControllerHandler, ControllerAxis } from "../hooks/useGamePad";
import { getSettings } from "../hooks/useSettings";

class Controller {
	private static _instance: Controller = new Controller();
	private wii_controller = useConservativeState<WIIOTNController>({ ...empty_wii_controller }, { ignore: ['id'] })


	private constructor() {
		if (Controller._instance) {
			throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
		}
		Controller._instance = this;
	}

	public static getInstance(socket_id: number = -1): Controller {
		if (socket_id != -1) {
			Controller._instance.wii_controller.setState(old_state => { return { ...old_state, id: socket_id } });
		}
		return Controller._instance;
	}

	//mouse daemon, convert this into a joystick axis
	private m_mouseDaemon<DataType>(side_effect: (key: DateType) => void): () => void {
		console.log("[DEBUG] Controller Running [m_mouseDaemon]");
		const mouse_state = createState<{ x: number, y: number }>({ x: 0, y: 0 });
		const mouse_state_listener = (key: { x: number, y: number }) => {
			const converted_axis = { x: new Axis(key.x), y: new Axis(key.y) };
			if (Axis.Equals(converted_axis.x, this.wii_controller.getState().axis.l_joystick_x) && Axis.Equals(converted_axis.y, this.wii_controller.getState().axis.l_joystick_y)) return;
			getIPC().send('udp-message', { ...this.wii_controller.getState(), time: Date.now() });
		}
		mouse_state.addListener(mouse_state_listener);

		const mousemove_daemon = (event: MouseEvent) => {
			side_effect(event as DataType);
			//transform the mouse position to a percentage of the screen.
			const mutated_mouse_pos = { x: event.movementX / window.innerWidth, y: event.movementY / window.innerHeight };
			mouse_state.setState(old_state => { return { x: mutated_mouse_pos.x, y: event.movementY } });
		}

	}

	private m_keyboardDaemon<DataType>(side_effect: (key: DataType) => void): () => void {
		console.log("[DEBUG] Controller Running [m_keyboardDaemon]");
		const key_state = createState<Array<number>>([0]);
		const key_state_listener = (key: Array<number>) => {
			const keyboard_settings = getSettings().getSettings()?.KeyboardSettings;
			if (!keyboard_settings) return;
			let mutated_key: number = 0;
			const transfered_key_map = mapSettingsToController(keyboard_settings);
			key.forEach((key) => { mutated_key |= transfered_key_map[key] });

			if (this.wii_controller.getState().buttons_pressed == mutated_key) return;
			this.wii_controller.setState(old_state => { return { ...old_state, buttons_pressed: mutated_key } });
			getIPC().send('udp-message', { ...this.wii_controller.getState(), time: Date.now() });
		}
		key_state.addListener(key_state_listener);

		const keydown = (event: KeyboardEvent) => {
			side_effect(event as DataType);
			key_state.setState(old_state => { return [...old_state, event.keyCode] });
		}
		const keyup = (event: KeyboardEvent) => {
			side_effect(event as DataType);
			key_state.setState(old_state => { return old_state.filter((key) => key != event.keyCode) });
		}
		window.addEventListener("keydown", keydown);
		window.addEventListener("keyup", keyup);


		return () => {
			console.log("[DEBUG] Controller ENDED [m_keyboardDaemon] [END]");
			key_state.removeListener(key_state_listener);
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
		};
	}

	private m_gamepadDaemon<DataType>(side_effect: (key: DataType) => void): () => void {

		const xbox_controller = ControllerHandler.getInstance();
		const xbox_controls = getSettings().getSettings()?.XboxSettings;
		xbox_controller.addEventListener("buttonpress", (event: ControllerEvent) => {
			if (!xbox_controls) return;
			let mutated_key: number = 0;
			let string_buttons = '';
			const transfered_key_map = mapSettingsToController(xbox_controls);
			event.buttons.forEach((key) => { mutated_key |= transfered_key_map[key]; string_buttons += xbox_buttons_map[key] + ' ' });
			if (this.wii_controller.getState().buttons_pressed === Number(mutated_key) && Axis.AxisEquals({ ...static_axes, ...this.wii_controller.getState().axis }, event.axes)) return;


			this.wii_controller.setState(old_state => {
				//check if the axes are zero or equal to the previous static
				let axes_intermediate: ControllerAxis = { ...event.axes };
				let old_state_intermediate: ControllerAxis = { ...static_axes, ...old_state.axis };

				return {
					...old_state,
					buttons_pressed: Number(mutated_key),
					axis: axes_intermediate,
				}
			});
			//check if the axes are zero
			const zero_checker = Axis.AnyZero({ ...static_axes, ...this.wii_controller.getState().axis });
			if (zero_checker !== '') {
				console.log("[DEBUG] Zero Detected: %s [AnyZero]", zero_checker);
			}
			console.log("[DEBUG] Packet Sent:", { ...this.wii_controller.getState(), time: Date.now() });
			getIPC().send('udp-message', { ...this.wii_controller.getState(), time: Date.now() });
			side_effect(string_buttons as DataType);
		});

		return () => {
			xbox_controller.removeEventListener("buttonpress");
		}
	}

	public launchControllerProfile<DataType>(selected_controller: WIIOTNSettings['selected_controller'], side_effect: (key: DataType) => void): () => void {

		if (selected_controller === 'keyboard') return this.m_keyboardDaemon<DataType>(side_effect);
		if (selected_controller === 'xbox') return this.m_gamepadDaemon<DataType>(side_effect);
		return () => { }
	}
}

export let getController = Controller.getInstance;
