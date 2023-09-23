
const static_button_map: { [key: number]: string } = {

};


interface GamePadProps {
	gamepad_index?: number;
	onButtonPressed?: (button: GamepadButton) => void;
}

export default function useGamePad(gamepad_index: number = 0): Gamepad | null {

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
					console.log("[DEBUG] BUTTON PRESSED: [%s, %s]", button, index);
				}
			});
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
	}

	loop_function();

	return current_gamepad;
}
