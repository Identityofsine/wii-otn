
export default interface WIIOTNMessage {
	type: 'connection' | 'controller' | 'ping' | 'disconnect',
	name: string,
	new: boolean,
	id: number,
}

export interface WIIOTNPing {
	type: 'ping',
	name: string,
	ping: boolean,
	id: number,
}

/*
 *{
	"id": number,
	"name": string,
	"type": "controller",
	"controller": "keyboard" | "xbox",
	"lThumbX": number,
	"lThumbY": number,
	"rThumbX": number,
	"rThumbY": number,
	"buttons_pressed": number,
	"lTrigger": number,
	"rTrigger": number
}
 *
 *
 */

export interface WIIOTNController extends WIIOTNMessage {
	id: number,
	name: string,
	type: 'controller',
	controller: 'wii' | 'xbox' | 'keyboard',
	rThumbX: number,
	rThumbY: number,
	lThumbX: number,
	lThumbY: number,
	lTrigger: number,
	rTrigger: number,
	buttons_pressed: number, //should be binary encoded 01101110, each bit represents a buttons_pressed	
	new: boolean,
}

export const empty_wii_controller: WIIOTNController = {
	type: 'controller',
	controller: 'keyboard',
	id: 0,
	name: '',
	new: false,
	buttons_pressed: 0,
	lThumbX: 0,
	lThumbY: 0,
	rThumbX: 0,
	rThumbY: 0,
	lTrigger: 0,
	rTrigger: 0,
};

//map of buttons_pressed
//
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
};
