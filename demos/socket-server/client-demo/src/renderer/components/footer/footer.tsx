import { useContext } from 'react';
import '../../styles/footer.scss'
import Button from '../button/Button';
import { ConnectionContext, SocketContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { sendDisconnectClause } from '../../socket_functions';

function Footer() {
	const is_connected_context = useContext(ConnectionContext);
	const socket_context = useContext(SocketContext);
	const navigate = useNavigate();

	const button_action = () => {
		if (!is_connected_context.state) {
		} else {
			sendDisconnectClause(socket_context.state.id);
		}
		navigate('/');
	}

	return (
		<div className="footer flex fill-container fill-height align-center border-box">
			<Button text={!is_connected_context.state ? "Connect" : "Disconnect"} className="button" onClick={() => button_action()} />
		</div>
	)

}

export default Footer;
