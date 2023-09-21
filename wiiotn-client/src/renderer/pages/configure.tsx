import { useEffect, useState } from "react";
import '../styles/pages/configure.scss'
import { ControllerSettings, WIIOTNSettingsKey } from "../../storage";
import { button_map } from "../../storage/exports";


interface KeyInputProp<T extends ControllerSettings> {
	key_identifier: keyof T['key_map'];
	onKeyUpdate: (key: keyof T['key_map'], value: number) => void;
	default_value?: number;
}

function KeyInput<T extends ControllerSettings>(props: KeyInputProp<T>) {
	const [key, setKey] = useState<{ key: string, code: number }>({ key: '', code: 0 });

	useEffect(() => {
		if (props.default_value)
			setKey({ key: String.fromCharCode(props.default_value), code: props.default_value })
	}, [])

	useEffect(() => {
		props.onKeyUpdate(props.key_identifier, key.code);
	}, [key])


	const change_current_key = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 1) {
			const key_code = event.target.value.charCodeAt(event.target.value.length - 1);
			return setKey({ key: event.target.value.at(event.target.value.length - 1) as string, code: key_code });
		} else {
			return setKey({ key: event.target.value, code: event.target.value.charCodeAt(0) });
		}
	}

	return (
		<div className="key-input flex">
			<span className="key-label">{props.key_identifier ? button_map[props.key_identifier as number] : 'N/A'}</span>
			<input
				type="text"
				value={key.key}
				onChange={change_current_key} />
		</div>
	)
}


function Configure() {

	const [settings, setSettings] = useState<ControllerSettings>();
	const [key_map, setKeyMap] = useState<ControllerSettings['key_map']>({});

	useEffect(() => {
		//call settings from ipc
		window.electron.ipcRenderer.sendMessage('fetch-settings', 'controller');
		const controller_listener = window.electron.ipcRenderer.on('fetch-settings-reply', (event) => {
			const settings_response: { type: 'controller', settings: any } = event as any;
			if (settings_response.type === 'controller')
				setSettings(settings_response!.settings as ControllerSettings);
		});
		return () => {
			//remove listener
			controller_listener();
		}
	}, [])

	useEffect(() => {
		if (settings)
			setKeyMap(settings.key_map);
	}, [settings])


	const update_key_map = (key: keyof ControllerSettings['key_map'], value: number) => {
		if (key_map)
			setKeyMap({ ...key_map, [key]: value });
	};

	const grab_default_key = (key: number): number => {
		if (key_map)
			return key_map[key] ?? 0;
		return 0;
	};

	return (
		<div className="configure-page flex space-between align-center fill-width relative">
			{settings ?
				<>
					<div className="left">
						<span className="option-label">{settings?.controller}</span>
					</div>
					<div className="right input-field">
						<h2 className="inter title">Configure</h2>
						<div className="flex input-field-gap">
							<div className="input-group">
								{Object.keys(key_map).map((key: string, _index) => (
									<KeyInput
										key={key}
										key_identifier={key as unknown as WIIOTNSettingsKey}
										default_value={grab_default_key(key as unknown as number)}
										onKeyUpdate={(e, v) => console.log("e:%s, v:%s", e, v)}
									/>
								))}
							</div>
							<div className="input-group">
							</div>
							<div className="input-group">
							</div>
						</div>
					</div>
				</>
				: <h2 className="inter center-margin">Loading...</h2>}
		</div>
	)

}

export default Configure;
