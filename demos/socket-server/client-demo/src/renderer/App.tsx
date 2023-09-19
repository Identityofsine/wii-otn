import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './app.scss';
import Connect from './pages/connect';


export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Connect />} />
			</Routes>
		</Router>
	);
}
