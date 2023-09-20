import { createContext, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';
import Control from './pages/control';

export type SockAddrIn = {
	ip_address: string;
	port: number;
	id: number;
};


export default function App() {

	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
		ip_address: '127.0.0.1',
		port: 1337,
		id: 0,
	});

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Connect SocketInfo={sock_addr} SetSocketInfo={setSockAddr} />} />
				<Route path="/control" element={<Control socket_id={sock_addr.id} />} />
			</Routes>
		</Router>
	);
}
