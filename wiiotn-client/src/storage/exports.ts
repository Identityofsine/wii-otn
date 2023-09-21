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
