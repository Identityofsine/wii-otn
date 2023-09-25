import createState, { creaetState } from "../../obj/state";


export interface ControllerAxis {
	readonly l_joystick_x: Axis;
	readonly l_joystick_y: Axis;
	readonly r_joystick_x: Axis;
	readonly r_joystick_y: Axis;
}


export interface ControllerEvent {
	readonly buttons: number[];
	readonly axes: ControllerAxis;
}


//simple number only accurate to the 10th place (.1)
export class Axis {
	private m_value: number = 0;

	constructor(value: number) {
		this.m_value = this.returnRounded(value);
	}

	private returnRounded(value: number): number {
		//convert to short [-1, 0, 1] --> [-32768, 0, 32767]
		const rounded = this.applySensitivity(this.applyDeadzone(value))

		let new_value = Math.round(rounded * 32767);

		//round down
		return new_value;
	}

	private applyDeadzone(value: number) {
		const deadzone = 0.2;
		return Math.abs(value) < deadzone ? 0 : value;
	}

	private applySensitivity(value: number) {
		const sensitivity = 1;
		return value * sensitivity;
	}

	public static AxisEquals(a: ControllerAxis, b: ControllerAxis): boolean {
		return a.l_joystick_x.value == b.l_joystick_x.value &&
			a.l_joystick_y.value == b.l_joystick_y.value &&
			a.r_joystick_x.value == b.r_joystick_x.value &&
			a.r_joystick_y.value == b.r_joystick_y.value;
	};
	public static AnyZero(a: ControllerAxis): keyof ControllerAxis | '' {
		if (a.l_joystick_x.value == 0) return 'l_joystick_x';
		if (a.l_joystick_y.value == 0) return 'l_joystick_y';
		if (a.r_joystick_x.value == 0) return 'r_joystick_x';
		if (a.r_joystick_y.value == 0) return 'r_joystick_y';
		return '';

	}

	public get value(): number {
		return this.m_value;
	}

	public set value(value: number) {
		this.m_value = this.returnRounded(value);
	}
}

export const static_axes: ControllerAxis = {
	l_joystick_x: new Axis(0),
	l_joystick_y: new Axis(0),
	r_joystick_x: new Axis(0),
	r_joystick_y: new Axis(0)
}

export class ControllerHandler {
	private static _instance: ControllerHandler = new ControllerHandler();
	private events = new Map<string, (event: ControllerEvent) => void>();
	private loop_running: boolean = false;
	private axes_state = createState<ControllerAxis>(static_axes);

	private constructor() {
		if (ControllerHandler._instance) {
			throw new Error("Error: Instantiation failed: Use ControllerHandler.getInstance() instead of new.");
		}
		console.log("[DEBUG] ControllerHandler Running [Constructor]");
		ControllerHandler._instance = this;
		window.addEventListener("gamepadconnected", (e: GamepadEvent) => {
			console.log("[DEBUG] Gamepad Connected [Constructor]");
			this.startListeningLoop(e.gamepad.index);
		});
	}

	public static getInstance(): ControllerHandler {
		return ControllerHandler._instance;
	}

	/*
	 * @summary {This function launches the (one and only) loop that listens for button presses on the controller}
	 */
	public async startListeningLoop(gamepad_index: number = 0) {
		if (this.loop_running) return;
		this.loop_running = true;
		console.log("[DEBUG] ControllerHandler Running [startListeningLoop]");
		let gamepad: Gamepad | null = navigator.getGamepads()[gamepad_index];
		while (gamepad?.connected ?? false) {
			gamepad = navigator.getGamepads()[gamepad_index];
			let buttons_pressed: number[] = [];
			gamepad?.buttons.forEach((button, index) => {
				if (button.pressed) {
					buttons_pressed.push(index);
					console.log("[DEBUG] Button Pressed: ", buttons_pressed);
				}
			});
			gamepad?.axes.forEach((axis: number, index) => {
				//check index is 0 or 2, multiply by 1 and check if index is 1 or 3, multiply by -1
				const axis_value = (index % 2 == 0 ? 1 : -1) * axis;
				const axis_obj = new Axis(axis_value);
				switch (index) {
					case 0:
						this.axes_state.setState(old_state => { return { ...old_state, l_joystick_x: axis_obj } });
						break;
					case 1:
						this.axes_state.setState(old_state => { return { ...old_state, l_joystick_y: axis_obj } });
						break;
					case 2:
						this.axes_state.setState(old_state => { return { ...old_state, r_joystick_x: axis_obj } });
						break;
					case 3:
						this.axes_state.setState(old_state => { return { ...old_state, r_joystick_y: axis_obj } });
						break;
				}
			});


			this.emitAll({ buttons: buttons_pressed, axes: this.axes_state.getState() });
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
		this.loop_running = false;
		console.log("[DEBUG] ControllerHandler ENDED [startListeningLoop] [END]");
	}

	public emitAll(value: ControllerEvent = { buttons: [], axes: static_axes }) {
		this.events.forEach((callback, _event) => {
			callback(value);
		});
	}

	public addEventListener(event: string, callback: (event: ControllerEvent) => void) {
		console.log("[DEBUG] ControllerHandler Running [addEventListener]");
		this.events.set(event, callback);
	}

	public removeEventListener(event: string) {
		this.events.delete(event);
	}

}


