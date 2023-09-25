import { Axis, ControllerAxis } from "../renderer/hooks/useGamePad";
import { ControllerSettings } from "../storage";

/*
*	@summary Interface for the WIIOTNMessage Model, this is a protocol for the communication between the server and the client
*/
export default interface WIIOTNMessage {
	type: 'connection' | 'controller' | 'ping' | 'disconnect',
	name: string,
	new: boolean,
	id: number,
}

/*
	@summary Currenlty unused, but will be used for the ping modulation.
*/
export interface WIIOTNPing {
	type: 'ping',
	name: string,
	ping: boolean,
	id: number,
}

/*
 * @summary Interface for all WIIOTN compatible controllers, this is used to transmit the controller data to the server. 
 * @extends WIIOTNMessage
 *
 */
export interface WIIOTNController extends WIIOTNMessage {
	id: number,
	name: string,
	type: 'controller',
	controller: 'wii' | 'xbox' | 'keyboard',
	axis: ControllerAxis,
	lTrigger: number,
	rTrigger: number,
	buttons_pressed: number, //should be binary encoded 01101110, each bit represents a buttons_pressed	
	new: boolean,
}

//empty controller model
export const empty_wii_controller: WIIOTNController = {
	type: 'controller',
	controller: 'keyboard',
	id: 0,
	name: '',
	new: false,
	buttons_pressed: 0,
	axis: {
		l_joystick_x: new Axis(0),
		l_joystick_y: new Axis(0),
		r_joystick_x: new Axis(0),
		r_joystick_y: new Axis(0),
	},
	lTrigger: 0,
	rTrigger: 0,
};

//map of buttons_pressed
export const key_map: { [key: number]: number } = {
	65: 1,
	66: 2,
	88: 4,
	89: 8,
	38: 16,
	37: 64,
	40: 32,
	39: 128,
	8: 256,
	13: 512,
	16: 1024,
	17: 2048,
	18: 4096,
	32: 8192,
	27: 16384,
	9: 32768,
	192: 65536,
};


//convert a ControllerSettings object into a key_map object, shown above this function
//@summary this is used to convert the settings into a format that can be used by the controller, we use this on the configure page
//@warning this will not work if settings.key_map is not a valid key_map object
export const mapSettingsToController = (settings: ControllerSettings): { [key: number]: number } => {

	if (!settings.key_map) return {};
	//swap key and value
	const key_map = Object.entries(settings.key_map).reduce((acc, [key, value]) => {
		acc[value] = key as unknown as number;
		return acc;
	}, {} as { [key: number]: number });
	return key_map;
}
