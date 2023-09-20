import { createContext, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';
import PageContainer from './components/page-container/pagecontainer';

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
		window.electron.ipcRenderer.on('udp-connect-reply', (event: any) => { });
		window.electron.ipcRenderer.on('udp-disconnect-reply', (event: any) => {
			setIsConnected(false);
			setSockAddr({ ...sock_addr, id: 0 });
		});
	}, [])

	return (
		<Router>
			<SocketContext.Provider value={{ state: sock_addr, setState: setSockAddr }}>
				<ConnectionContext.Provider value={{ state: is_connected, setState: setIsConnected }}>
					<PageContainer>
						<Routes>
							<Route path="/" element={<Connect SocketInfo={sock_addr} SetSocketInfo={setSockAddr} />} />
							<Route path="/control" element={<Control socket_id={sock_addr.id} />} />
						</Routes>
					</PageContainer>
				</ConnectionContext.Provider>
			</SocketContext.Provider>
		</Router>
	);
}
