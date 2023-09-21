const Store = require('electron-store');

export type WIIOTNSettingsKey = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080 | 0x0100 | 0x0200 | 0x0400 | 0x0800 | 0x1000 | 0x2000 | 0x4000;

export interface WIIOTNSettings {
	controller_settings: KeyboardSettings | XboxSettings,
}

export interface ControllerSettings {
	controller: 'keyboard' | 'xbox',
	key_map: { [key in WIIOTNSettingsKey]: number },
}

interface KeyboardSettings extends ControllerSettings {
	controller: 'keyboard',
	key_map: { [key in WIIOTNSettingsKey]: number },
}

interface XboxSettings extends ControllerSettings {
	controller: 'xbox',
	key_map: { [key in WIIOTNSettingsKey]: number },
}


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

function useSettings() {
	const store_api = new Store();
	let settings: WIIOTNSettings = store_api.get("settings");

	if (!settings) {
		store_api.set("settings", static_settings);
		settings = static_settings;
	}


	return {
		get: (key: keyof WIIOTNSettings) => {
			return settings[key];
		},
		set: (key: keyof WIIOTNSettings, value: WIIOTNSettings[keyof WIIOTNSettings]) => {
			settings[key] = value;
			store_api.set("settings", settings);
		}
	}

}

/*
 *  const controllerSettings : ControllerSettings = settings.get("controller");
 *  const connectionSettings : ConnectionSettings = settings.get("connection");
 */


export { useSettings };
