

export class ControllerHandler {
	private static _instance: ControllerHandler = new ControllerHandler();
	private events = new Map<string, (event: number[]) => void>();
	private loop_running: boolean = false;

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
			this.emitAll(buttons_pressed);
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
		this.loop_running = false;
		console.log("[DEBUG] ControllerHandler ENDED [startListeningLoop] [END]");
	}

	public emitAll(value: number[] = []) {
		this.events.forEach((callback, _event) => {
			callback(value);
		});
	}

	public addEventListener(event: string, callback: (event: number[]) => void) {
		console.log("[DEBUG] ControllerHandler Running [addEventListener]");
		this.events.set(event, callback);
	}

	public removeEventListener(event: string) {
		this.events.delete(event);
	}

}

