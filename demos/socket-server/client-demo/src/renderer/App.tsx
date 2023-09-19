import { createContext, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './app.scss';
import Connect from './pages/connect';

export type SockAddrIn = {
  ip_address: string;
  port: number;
};


export default function App() {
  
	const [sock_addr, setSockAddr] = useState<SockAddrIn>({
    ip_address: '127.0.0.1',
    port: 1337,
  });



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connect SocketInfo={sock_addr} SetSocketInfo={setSockAddr}/>} />
      </Routes>
    </Router>
  );
}
