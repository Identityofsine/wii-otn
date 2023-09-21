import { useContext, useEffect, useState } from "react";
import '../styles/pages/configure.scss'
import { ControllerSettings, WIIOTNSettingsKey } from "../../storage";
import Button from "../components/button/Button";
import { SettingsContext } from "../App";
import KeyInput from "../components/keyinput/keyinput";


interface KeyboardSettingsProps {
	settings: ControllerSettings;
	onSettingsUpdate: (settings: ControllerSettings) => void;
}

function KeyboardSettings(props: KeyboardSettingsProps) {
	const [key_map, setKeyMap] = useState<ControllerSettings['key_map']>(props.settings.key_map ?? {});

	useEffect(() => {
		props.onSettingsUpdate({ ...props.settings, key_map: key_map });
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

function Configure() {

	const [settings, setSettings] = useState<ControllerSettings>();
	const [status, setStatus] = useState<string>('');
	const global_settings = useContext(SettingsContext);

	useEffect(() => {
		//call settings from ipc
		window.electron.ipcRenderer.sendMessage('fetch-settings', 'controller');
		const controller_listener = window.electron.ipcRenderer.on('fetch-settings-reply', (event) => {
			const settings_response: { type: 'controller', settings: any } = event as any;
			if (settings_response.type === 'controller')
				setSettings(settings_response!.settings as ControllerSettings);
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

	useEffect(() => {
		if (settings && settings === global_settings.state)
			setStatus('')
	}, [settings])


	const save_settings = () => {
		if (settings) {
			const new_settings = { ...settings };
			window.electron.ipcRenderer.sendMessage('store-settings', JSON.stringify({ type: 'controller', settings: new_settings }));
			global_settings.setState({ ...global_settings.state, ...new_settings });
		}
	}

	return (
		<div className="configure-page flex column space-between fill-width relative">
			{settings ?
				<>
					<div className="top flex space-between align-center fill-width">
						<span className="option-label ">{settings?.controller}</span>
						<div className="flex column margin-top-auto align-center relative fill-container">
							<span className="inter status">{status}</span>
							<Button className="black button" text="SAVE" onClick={() => save_settings()} />
						</div>
					</div>
					<div className="bottom input-field">
						<KeyboardSettings settings={settings} onSettingsUpdate={(settings) => setSettings(settings)} />
					</div>
				</>
				: <h2 className="inter center-margin">Loading...</h2>}
		</div>
	)

}

export default Configure;
