import { useContext, useState } from 'react';
import { ConnectionContext, SocketContext } from '../../App';
import '../../styles/sidemenu.scss';
import { useLocation, useNavigate } from 'react-router-dom';


function SideMenu() {
	const is_connected_context = useContext(ConnectionContext);
	const socket_context = useContext(SocketContext);
	const [left_page, setLeftPage] = useState<{ left_page: boolean, last_page: string }>({ left_page: false, last_page: "" });
	const navigate = useNavigate();
	const location = useLocation();

	const switchPage = (page: string) => {
		const current_page = location.pathname === "/" ? "/index.html" : location.pathname;
		setLeftPage((_old_state) => { return { left_page: true, last_page: current_page } });
		navigate(page);
	};

	const comeBack = () => {
		const last_page = left_page.last_page === "/index.html" ? "/" : left_page.last_page;
		setLeftPage((_old_state) => { return { left_page: false, last_page: "" } });
		navigate(last_page);
	};


	return (
		<div className="sidemenu relative inter center-margin fit-width overflow-hidden flex column">
			<h2 className="label inter center-text">WIIOTN</h2>
			<div className="stats flex column fit-width stats-gap center-margin">
				<span className="title center-margin">Stats:</span>
				<div className="stat flex">
					<span className="label">Connected:</span>
					<span className="value">{is_connected_context.state ? "Yes" : "No"}</span>
				</div>
				<div className="stat flex">
					<span className="label">Socket ID:</span>
					<span className="value">{socket_context.state.id}</span>
				</div>
			</div>
			<div className="links flex column center-margin">
				{left_page.left_page ?
					<span className="label center-margin bold pointer" onClick={comeBack}>Go Back</span>
					:
					<span className="label center-margin bold pointer" onClick={() => switchPage('/configure')}>Configure</span>
				}
			</div>
		</div>
	)
}

export default SideMenu;
