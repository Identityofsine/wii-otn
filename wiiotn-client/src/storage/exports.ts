import { WIIOTNSettings, WIIOTNSettingsKey } from ".";

export const static_settings: WIIOTNSettings = {
	controller_settings: {
		controller: 'keyboard',
		key_map: {
			0x0001: 87,
			0x0002: 83,
			0x0004: 65,
			0x0008: 68,
			0x0010: 32,
			0x0020: 16,
			0x0040: 37,
			0x0080: 39,
			0x0100: 38,
			0x0200: 40,
			0x0400: 81,
			0x0800: 69,
			0x1000: 82,
			0x2000: 70,
			0x4000: 90
		}
	}
}


export const button_map: { [key in WIIOTNSettingsKey | number]: string } = {
	0x0001: "A",
	0x0002: "B",
	0x0004: "X",
	0x0008: "Y",
	0x0010: "UP",
	0x0020: "DOWN",
	0x0040: "LEFT",
	0x0080: "RIGHT",
	0x0100: "START",
	0x0200: "SELECT",
	0x0400: "L SHOULDER",
	0x0800: "R SHOULDER",
	0x1000: "L STICKDOWN",
	0x2000: "R STICKDOWN",
	0x4000: "HOME"
}

//a -> A, b-> B, x -> X, y-> Y 
export const default_keyboard_layout: { [key in WIIOTNSettingsKey]: number } = {
	0x0001: 65, //A
	0x0002: 66, //B
	0x0004: 88, //X
	0x0008: 89, //Y
	0x0010: 32, //START
	0x0020: 13, //SELECT
	0x0040: 38, //UP
	0x0080: 40, //DOWN
	0x0100: 37, //LEFT
	0x0200: 39, //RIGHT
	0x0400: 87, //L
	0x0800: 69, //R
	0x1000: 81, //ZL
	0x2000: 82, //ZR
	0x4000: 16, //LCLICK
}

export const default_xbox_layout: { [key in WIIOTNSettingsKey]: number } = {
	0x0001: 0, //A
	0x0002: 1, //B
	0x0004: 2, //X
	0x0008: 3, //Y
	0x0010: 12, //UP 
	0x0020: 13, //DOWN
	0x0040: 14, //LEFT
	0x0080: 15, //RIGHT
	0x0100: 9, //START 
	0x0200: 8, //SELECT
	0x0400: 4, //LB
	0x0800: 5, //RB
	0x1000: 8, //LTD
	0x2000: 9, //RTD
	0x4000: 16, //HOME
}

export const xbox_buttons_map: { [key: number]: string } = {
	0: "A",
	1: "B",
	2: "X",
	3: "Y",
	4: "LB",
	5: "RB",
	8: "⏸️",
	9: "▶️",
	10: "LT",
	11: "RT",
	12: "🔼",
	13: "🔽",
	14: "⬅️",
	15: "➡️",
	16: "🏠"
}


