import WIIOTNMessage, { WIIOTNController, empty_wii_controller, key_map } from "./interface";
import { KeyboardListener } from "./keyboard";
import Socket from "./socket";
import createState from "./state";

const keyboard_listener = new KeyboardListener.KeyboardListener();
const wii_message_state = createState<WIIOTNMessage | WIIOTNController>({ ...empty_wii_controller, name: 'test', new: true });
const socket_object: Socket = new Socket("192.168.1.3", 1337);


socket_object.sendMessage(wii_message_state.getState());
wii_message_state.setState((old_state) => { return { ...old_state, new: false } });
wii_message_state.addListener((new_state) => {
	socket_object.sendMessage(new_state);
});

keyboard_listener.addListener('keypress', (key: number) => {

	if (key === 3) {
		process.exit();
	}

	//check if key is in key_map
	if (!key_map[key]) return;

	const buttons_pressed = key_map[key] | (wii_message_state.getState() as WIIOTNController)!.buttons_pressed;

	wii_message_state.setState((old_state) => { return { ...old_state, buttons_pressed: buttons_pressed, new: false } });

});

keyboard_listener.addListener('keyup', () => {
	console.log('key up');
	wii_message_state.setState((old_state) => { return { ...old_state, buttons_pressed: 0, new: false } });
});


//do not terminate program unless user does
setInterval(() => { }, 1000);
