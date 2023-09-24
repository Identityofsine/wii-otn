import { createContext, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';
import PageContainer from './components/page-container/pagecontainer';
import Configure from './pages/configure';
import useGamePadHook from './hooks/useGamepadListener';
import { ControllerSettings, WIIOTNSettings } from '../storage';

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
export const SettingsContext = createContext<StateModifier<WIIOTNSettings | {}>>({ state: {}, setState: () => { } });
export const XboxControllerContext = createContext({ addEventListener: (_event_name: string, _event: (button_pressed: number[]) => void) => { }, removeEventListener: (_event: string) => { } });

export default function App() {

	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
		ip_address: '127.0.0.1',
		port: 1337,
		id: 0,
	});
	const [is_connected, setIsConnected] = useState<boolean>(false);
	const [user_settings, setUserSettings] = useState<WIIOTNSettings | {}>({});
	const game_pad = useRef(useGamePadHook());


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
		const disconnect_listener = window.electron.ipcRenderer.on('udp-disconnect-reply', (_event: any) => {
			setIsConnected(false);
			setSockAddr({ ...sock_addr, id: 0 });
		});
		//request settings
		window.electron.ipcRenderer.sendMessage('fetch-settings', JSON.stringify({ type: 'controller', controller: 'all' }));
		const settings_listener = window.electron.ipcRenderer.on('fetch-settings-reply', (event: any) => {
			let settings_response: { settings: WIIOTNSettings } = event as any;
			setUserSettings(settings_response.settings as WIIOTNSettings);
			console.log("[DEBUG -- fetch-settings-reply] Settings: ", settings_response);
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
				<XboxControllerContext.Provider value={{ addEventListener: game_pad.current[1], removeEventListener: game_pad.current[2] }}>
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
