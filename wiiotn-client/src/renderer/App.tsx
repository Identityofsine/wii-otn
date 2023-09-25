import { createContext, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';
import PageContainer from './components/page-container/pagecontainer';
import Configure from './pages/configure';
import useGamePadHook from './hooks/useGamepadListener';
import { ControllerSettings, WIIOTNSettings } from '../storage';
import { ControllerHandler } from './hooks/useGamePad';
import { getIPC } from './IPC.e';
import { getSettings } from './hooks/useSettings';

/**
 * @summary Socket Address In, for keeping socket data typesafe
 */
export type SockAddrIn = {
	ip_address: string;
	port: number;
	id: number;
};


/**
 * @summary This is used for state contexts throughout the app
 */
export interface StateModifier<T> {
	state: T;
	setState: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * many of these contexts will be changed or removed in the future
 */
export const ConnectionContext = createContext<StateModifier<boolean>>({ state: false, setState: () => { } });
export const SocketContext = createContext<StateModifier<SockAddrIn>>({ state: { ip_address: '', port: 0, id: 0 }, setState: () => { } });
export const SettingsContext = createContext<StateModifier<{ type: 'controller', settings: WIIOTNSettings } | {}>>({ state: {}, setState: () => { } });

export default function App() {

	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
		ip_address: '127.0.0.1',
		port: 1337,
		id: 0,
	});
	const [is_connected, setIsConnected] = useState<boolean>(false);
	const [user_settings, setUserSettings] = useState<{ type: 'controller', settings: WIIOTNSettings } | {}>(getSettings().getSettings() ?? {});
	//initalize game_pad
	const _game_pad = useRef(ControllerHandler.getInstance());


	useEffect(() => {

		const _bulk_ipc_functions = getIPC().addEvents({
			'udp-connect-reply': [((event: any) => {
				console.log("[DEBUG -- udp-connect-reply] Event OBJ: ", event);
				setIsConnected(event?.success);
				setSockAddr({ ...sock_addr, id: event.id });
			})],
			'udp-disconnect-reply': [((_event: any) => {
				setIsConnected(false);
				setSockAddr({ ...sock_addr, id: 0 });
			})],
		})

		setUserSettings(getSettings().getSettings() ?? {});

		return () => {
			//REMOVE IPC LISTENERS
			_bulk_ipc_functions.unsubscribeAll();
		}
	}, [])

	useEffect(() => {
		console.log('[DEBUG] user_settings updated : ', user_settings);
	}, [user_settings])

	return (
		<Router>
			<SettingsContext.Provider value={{ state: user_settings, setState: setUserSettings }}>
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
			</SettingsContext.Provider>
		</Router>
	);
}
