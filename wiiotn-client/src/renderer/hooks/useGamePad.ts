
const static_button_map: { [key: number]: string } = {

};


interface GamePadProps {
	gamepad_index?: number;
	onButtonPressed?: (button: GamepadButton) => void;
}

export interface UseGamePadReturn {
	gamepad: Gamepad | null;
	addEventListener: (event: string, callback: (event: number) => void) => void;
	removeEventListener: (event: string) => void;
}

export class GlobalVariable {
	private static _instance: GlobalVariable = new GlobalVariable();
	private events = new Map<string, (event: number) => void>();

	private constructor() {
		if (GlobalVariable._instance) {
			throw new Error("Error: Instantiation failed: Use GlobalVariable.getInstance() instead of new.");
		}
		GlobalVariable._instance = this;
	}

	public static getInstance(): GlobalVariable {
		return GlobalVariable._instance;
	}

	public emitAll(value: number) {
		this.events.forEach((callback, event) => {
			callback(value);
		});
	}

	public addEventListener(event: string, callback: (event: number) => void) {
		this.events.set(event, callback);
	}

	public removeEventListener(event: string) {
		this.events.delete(event);
	}

}

export default function useGamePad(gamepad_index: number = 0): UseGamePadReturn {

	console.log("[DEBUG] Gamepad Running ");

	const v8_navigator = navigator as any;
	const gamepads: Gamepad[] = v8_navigator.getGamepads();
	let current_gamepad: Gamepad | null = null;

	if (gamepads.filter(gamepad => gamepad !== null).length === 0) {
		throw Error("No gamepads found");
	}


	current_gamepad = gamepads[gamepad_index];
	if (current_gamepad === null) throw Error("Gamepad not found");

	console.log("[DEBUG] Gamepad Found: ", current_gamepad);

	const loop_function = async () => {
		let gamepad: Gamepad | null = navigator.getGamepads()[gamepad_index];
		while (gamepad?.connected ?? false) {
			gamepad = navigator.getGamepads()[gamepad_index];
			gamepad?.buttons.forEach((button, index) => {
				if (button.pressed) {
					GlobalVariable.getInstance().emitAll(index);
					console.log("[DEBUG] Button Pressed: ", index);
				}
			});
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
	}

	loop_function();


	const addEventListener = (event: string, callback: (event: number) => void) => {
		GlobalVariable.getInstance().addEventListener(event, callback);
	}

	const removeEventListener = (event: string) => {
		GlobalVariable.getInstance().removeEventListener(event);
	}

	return {
		gamepad: current_gamepad,
		addEventListener,
		removeEventListener
	}
}
