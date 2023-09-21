import { useContext } from 'react';
import { ConnectionContext, SocketContext } from '../../App';
import '../../styles/sidemenu.scss';

function SideMenu() {
	const is_connected_context = useContext(ConnectionContext);
	const socket_context = useContext(SocketContext);

	return (
		<div className="sidemenu relative inter center-margin fit-width overflow-hidden flex column">
			<h2 className="label inter center-text">WIIOTN</h2>
			<div className="stats flex column fit-width stats-gap">
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
		</div>
	)
}

export default SideMenu;
