import { createContext, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';
import PageContainer from './components/page-container/pagecontainer';
import Configure from './pages/configure';

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

export default function App() {

	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
		ip_address: '127.0.0.1',
		port: 1337,
		id: 0,
	});
	const [is_connected, setIsConnected] = useState<boolean>(false);

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

		return () => {
			//REMOVE IPC LISTENERS
			debug_listener();
			connect_listener();
			disconnect_listener();
		}
	}, [])

	return (
		<Router>
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
		</Router>
	);
}
