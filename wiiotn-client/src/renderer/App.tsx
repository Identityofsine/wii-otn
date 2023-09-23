import { createContext, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';
import PageContainer from './components/page-container/pagecontainer';
import Configure from './pages/configure';
import { ControllerSettings, WIIOTNSettings } from '../storage';
import { WIIOTNController } from '../obj/interface';
import { static_settings } from '../storage/exports';
import useGamePad from './hooks/useGamePad';
import useGamePadHook from './hooks/useGamepadListener';

export type SockAddrIn = {
	ip_address: string;
	port: number;
	id: number;
};

export interface StateModifier<T> {
	state: T;
	setState: React.Dispatch<React.SetStateAction<T>>;
}

export const ConnectionContext = createContext<StateModifier<boolean>>({ state: false, setState: () => { } });
export const SocketContext = createContext<StateModifier<SockAddrIn>>({ state: { ip_address: '', port: 0, id: 0 }, setState: () => { } });
export const SettingsContext = createContext<StateModifier<ControllerSettings>>({ state: {}, setState: () => { } });

export const XboxControllerContext = createContext<{ addEventListener: (listener: Function) => void, removeEventListener: (listener: Function) => void }>({ addEventListener: () => { }, removeEventListener: () => { } });

export default function App() {

	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
		ip_address: '127.0.0.1',
		port: 1337,
		id: 0,
	});
	const [is_connected, setIsConnected] = useState<boolean>(false);
	const [user_settings, setUserSettings] = useState<ControllerSettings>({});
	const game_pad = useGamePadHook({ onGamePadConnected: (game_pad: Gamepad) => { useGamePad(game_pad.index) } });


	useEffect(() => {
		//IPC REPLY HANDLERS
		const debug_listener = window.electron.ipcRenderer.on('debug-message', (event: any) => {
			console.log(event)
		});
		const connect_listener = window.electron.ipcRenderer.on('udp-connect-reply', (event: any) => {
			console.log("[DEBUG -- udp-connect-reply] Event OBJ: ", event);
			setIsConnected(event?.success);
			setSockAddr({ ...sock_addr, id: event.id });
		});
		const disconnect_listener = window.electron.ipcRenderer.on('udp-disconnect-reply', (event: any) => {
			setIsConnected(false);
			setSockAddr({ ...sock_addr, id: 0 });
		});
		//request settings
		window.electron.ipcRenderer.sendMessage('fetch-settings', 'controller');
		const settings_listener = window.electron.ipcRenderer.on('fetch-settings-reply', (event: any) => {
			const settings_response: { type: 'controller', settings: any } = event as any;
			if (settings_response.type === 'controller') {
				setUserSettings(settings_response!.settings as ControllerSettings);
				console.log("[DEBUG -- fetch-settings-reply] Settings: ", settings_response!.settings as ControllerSettings);
			}
		});

		return () => {
			//REMOVE IPC LISTENERS
			debug_listener();
			connect_listener();
			disconnect_listener();
			settings_listener();
		}
	}, [])

	useEffect(() => {
		console.log('[DEBUG] user_settings updated : ', user_settings);
	}, [user_settings])

	return (
		<Router>
			<SettingsContext.Provider value={{ state: user_settings, setState: setUserSettings }}>
				<XboxControllerContext.Provider value={{ addEventListener: game_pad[1], removeEventListener: game_pad[2] }}>
					<SocketContext.Provider value={{ state: sock_addr, setState: setSockAddr }}>
						<ConnectionContext.Provider value={{ state: is_connected, setState: setIsConnected }}>
							<PageContainer>
								<Routes>
									<Route path="/" element={<Connect SocketInfo={sock_addr} SetSocketInfo={setSockAddr} />} />
									<Route path="/control" element={<Control socket_id={sock_addr.id} />} />
									<Route path="/configure" element={<Configure />} />
								</Routes>
							</PageContainer>
						</ConnectionContext.Provider>
					</SocketContext.Provider>
				</XboxControllerContext.Provider>
			</SettingsContext.Provider>
		</Router>
	);
}
