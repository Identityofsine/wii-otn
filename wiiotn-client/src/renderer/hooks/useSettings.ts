import { WIIOTNSettings } from "../../storage";
import { getIPC } from "../IPC.e";

class Settings {
	private static _instance = new Settings();
	private settings: { type: 'controller', settings: WIIOTNSettings | null };

	private constructor() {
		if (Settings._instance) {
			throw new Error("Error: Instantiation failed: Use Settings.getInstance() instead of new.");
		}
		Settings._instance = this;
		getIPC().addEventListener('fetch-settings-reply', (event) => {
			let settings_response: { type: 'controller', settings: WIIOTNSettings } = event as any;
			if (settings_response.type == 'controller') {
				this.settings = settings_response;
			};
		});
		this.settings = { type: 'controller', settings: null };
		this.fetchSettings();
	}

	private sendSettings() {
		getIPC().send('store-settings', this.settings);
	}

	private fetchSettings() {
		getIPC().send('fetch-settings', { type: 'controller', controller: 'all' });
	}

	public static getInstance(): Settings {
		return Settings._instance;
	}

	public setSettings(settings: WIIOTNSettings) {
		this.settings = { ...this.settings, settings: settings };
		this.sendSettings();
		console.log("[DEBUG] Settings Updated [setSettings]");
	}

	public getSettings(): WIIOTNSettings | null {
		if (this.settings) {
			console.log("[DEBUG] Settings Fetched [getSettings]:", this.settings.settings);
			return this.settings.settings;
		}
		return null;
	}
}

export let getSettings = Settings.getInstance;
