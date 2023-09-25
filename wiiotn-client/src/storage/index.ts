import { static_settings } from "./exports";

const Store = require('electron-store');

export type WIIOTNSettingsKey = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080 | 0x0100 | 0x0200 | 0x0400 | 0x0800 | 0x1000 | 0x2000 | 0x4000 | 0x8000 | 0x10000;

export interface WIIOTNSettings {
	selected_controller: 'keyboard' | 'xbox',
	KeyboardSettings: KeyboardSettings,
	XboxSettings: XboxSettings,
}

export interface ControllerSettings {
	controller: 'keyboard' | 'xbox',
	key_map: { [key in WIIOTNSettingsKey | number | string]: number },
}

export interface KeyboardSettings extends ControllerSettings {
	controller: 'keyboard',
	key_map: { [key in WIIOTNSettingsKey | number]: number },
	map_mouse_to_ljoystick: boolean,
}

export interface XboxSettings extends ControllerSettings {
	controller: 'xbox',
	key_map: { [key in WIIOTNSettingsKey | number]: number },
}




function useSettings() {
	const store_api = new Store();
	let settings: WIIOTNSettings = store_api.get("settings");

	if (!settings) {
		store_api.set("settings", static_settings);
		settings = static_settings;
	}


	return {
		get: (key: keyof WIIOTNSettings) => {
			console.log('[DEBUG]: GETTING SETTINGS: ', settings[key]);
			return settings[key];
		},
		set: (key: keyof WIIOTNSettings, value: WIIOTNSettings[keyof WIIOTNSettings]) => {
			settings[key] = value as any;
			console.log('[DEBUG]: SETTING SETTINGS: ', settings[key]);
			store_api.set("settings", settings);
		}
	}

}





/*
 *  const controllerSettings : ControllerSettings = settings.get("controller");
 *  const connectionSettings : ConnectionSettings = settings.get("connection");
 */


export { useSettings };
