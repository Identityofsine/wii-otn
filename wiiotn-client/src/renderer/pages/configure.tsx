import { useContext, useEffect, useRef, useState } from "react";
import '../styles/pages/configure.scss'
import { ControllerSettings, KeyboardSettings, WIIOTNSettings, WIIOTNSettingsKey, XboxSettings } from "../../storage";
import Button from "../components/button/Button";
import { SettingsContext } from "../App";
import KeyInput, { ButtonInput } from "../components/keyinput/keyinput";
import Dropdown, { Option } from "../components/dropdown/dropdown";
import { default_keyboard_layout, default_xbox_layout } from "../../storage/exports";


interface KeyboardSettingsProps {
	settings: ControllerSettings;
	onSettingsUpdate: (settings: ControllerSettings) => void;
}

function KeyboardSettingsPage(props: KeyboardSettingsProps) {
	const [key_map, setKeyMap] = useState<ControllerSettings['key_map']>(props.settings?.key_map ?? default_keyboard_layout);

	useEffect(() => {
		console.log("[DEBUG] KeyboardSettings: ", props.settings)
	}, [])

	useEffect(() => {
		props.onSettingsUpdate({ controller: 'keyboard', key_map: key_map });
	}, [key_map])

	const update_key_map = (key: keyof ControllerSettings['key_map'], value: number) => {
		if (key_map)
			setKeyMap({ ...key_map, [key]: value });
	};

	const grab_default_key = (key: number): number => {
		if (key_map)
			return key_map[key] ?? 0;
		return 0;
	};

	const grab_key_map = (start: number, end: number) => {
		if (key_map)
			return Object.keys(key_map).slice(start, end)
		else
			return [];
	}

	return (
		<>
			<div className="flex column input-field-gap input-field-margin">
				<div className="input-group fill-width">
					{grab_key_map(0, 18).map((key: string, _index: number) => (
						<KeyInput
							key={key}
							key_identifier={key as unknown as WIIOTNSettingsKey}
							default_value={grab_default_key(key as unknown as number)}
							onKeyUpdate={(key_id, value) => update_key_map(key_id, value)}
						/>
					))}
				</div>
			</div>
		</>
	)
}

function XboxSettingsPage(props: KeyboardSettingsProps) {

	const [game_pad_connected, setGamePadConnected] = useState<boolean>(false);
	const navigator = window.navigator as any;
	const [game_pad, setGamePad] = useState<Gamepad | null>(null);
	const [button_map, setButtonMap] = useState<ControllerSettings['key_map']>(props.settings?.key_map ?? default_xbox_layout);

	useEffect(() => {

		//search for already connected gamepads
		const game_pads = navigator.getGamepads();
		for (let i = 0; i < game_pads.length; i++) {
			if (game_pads[i] !== null) {
				setGamePad(game_pads[i]);
				break;
			}
		}

		const on_gamepad_connected = (event: GamepadEvent) => {
			if (game_pad === null) {
				console.log('[DEBUG] Gamepad connected at index %d: %s. %d buttons, %d axes.', event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length);

				setGamePad(event.gamepad);
				setGamePadConnected(true);
			}
		};
		window.addEventListener('gamepadconnected', on_gamepad_connected);

		return () => {
			window.removeEventListener('gamepadconnected', on_gamepad_connected);
		}
	}, [])

	useEffect(() => {
		if (game_pad) {
			setGamePadConnected(true);
		}

	}, [game_pad])

	const update_button_map = (key: keyof ControllerSettings['key_map'], value: number) => {
		if (button_map)
			setButtonMap({ ...button_map, [key]: value });
		console.log("[DEBUG] Button map: ", { ...button_map, [key]: value });
	};

	const grab_default_button = (key: number): number => {
		if (button_map)
			return button_map[key] ?? 0;
		return 0;
	};

	const grab_button_map = (start: number, end: number) => {
		if (button_map)
			return Object.keys(button_map).slice(start, end)
		else
			return [];
	}

	return (
		<>
			<div className="flex column input-field-gap input-field-margin">
				<div className="input-group fill-width">
					{grab_button_map(0, 18).map((key: string, _index: number) => (
						<ButtonInput
							key={key}
							key_identifier={key as unknown as WIIOTNSettingsKey}
							default_value={grab_default_button(key as unknown as number)}
							onKeyUpdate={(key_id, value) => update_button_map(key_id, value)}
						/>
					))}
				</div>
			</div>
		</>
	)
}

function Configure() {

	const [controller, setController] = useState<'keyboard' | 'xbox'>('keyboard');
	const [active_controller, setActiveController] = useState<'keyboard' | 'xbox'>('keyboard');
	const [keyboard_settings, setKeyboardSettings] = useState<ControllerSettings>();
	const [xbox_settings, setXboxSettings] = useState<ControllerSettings>();
	const [status, setStatus] = useState<string>('');
	const global_settings = useContext(SettingsContext);

	useEffect(() => {
		//call settings from ipc
		window.electron.ipcRenderer.sendMessage('fetch-settings', JSON.stringify({ type: 'controller', controller: 'all' }));
		const controller_listener = window.electron.ipcRenderer.on('fetch-settings-reply', (event) => {
			const settings_response: { type: 'controller', settings: WIIOTNSettings } = event as any;
			if (settings_response.type === 'controller') {
				console.log('[DEBUG] Settings: ', settings_response.settings);
				setKeyboardSettings(settings_response.settings?.KeyboardSettings ?? { controller: 'keyboard', key_map: default_keyboard_layout } as KeyboardSettings);
				setXboxSettings(settings_response.settings?.XboxSettings ?? { controller: 'xbox', key_map: default_xbox_layout } as XboxSettings);
				setActiveController(settings_response.settings?.selected_controller ?? 'controller');
			}
		});
		const save_listener = window.electron.ipcRenderer.on('store-settings-reply', (event: any) => {
			if (event.success) {
				setStatus('Settings Saved!')
			}
		});
		return () => {
			//remove listener
			controller_listener();
			save_listener();
		}
	}, [])


	const save_settings = () => {
		const new_settings: WIIOTNSettings = {
			selected_controller: active_controller,
			KeyboardSettings: keyboard_settings as KeyboardSettings,
			XboxSettings: xbox_settings as XboxSettings,
		}
		window.electron.ipcRenderer.sendMessage('store-settings', JSON.stringify({ type: 'controller', settings: new_settings }));
	}

	return (
		<div className="configure-page flex column space-between fill-width relative">
			{true ?
				<>
					<div className="top flex space-between align-end fill-width">
						<div className="flex column">
							<Dropdown<typeof controller> className="black" options={[{ value: 'keyboard', label: 'Keyboard' }, { value: 'xbox', label: 'Xbox' }]} defaultValue={{ value: controller, label: controller }} onChange={(value: Option<typeof controller>) => setController(value.value)} />
							{/* checkbox : set active?*/}
							<div className="flex align-center">
								<input type="checkbox" name="active" className="checkbox" checked={controller === active_controller} onChange={(_event) => { setActiveController(controller) }} />
								<span className="label checkbox-label inter">Set this controller as active</span>
							</div>
						</div>
						<div className="flex column align-center fit-height relative fill-container">
							<span className="inter status">{status}</span>
							<Button className="black button" text="SAVE" onClick={() => save_settings()} />
						</div>
					</div>
					<div className="bottom input-field">
						{controller === 'keyboard' ?
							<KeyboardSettingsPage settings={keyboard_settings as ControllerSettings} onSettingsUpdate={(settings) => setKeyboardSettings(settings)} />
							:
							<XboxSettingsPage settings={xbox_settings as ControllerSettings} onSettingsUpdate={(settings) => setXboxSettings(settings)} />
						}
					</div>
				</>
				: <h2 className="inter center-margin">Loading...</h2>}
		</div>
	)

}

export default Configure;
