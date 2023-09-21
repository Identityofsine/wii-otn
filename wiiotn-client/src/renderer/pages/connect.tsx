/* eslint-disable prettier/prettier */
import { useContext, useEffect } from 'react';
import { ConnectionContext, SockAddrIn } from '../App';
import Button from '../components/button/Button';
import TextInput from '../components/textinput/TextInput';
import '../styles/pages/connect.scss';
import { useNavigate } from 'react-router-dom';
import { sendConnectClause } from '../socket_functions';


type ConnectProps = {
	SocketInfo: SockAddrIn;
	SetSocketInfo: (sock_addr: SockAddrIn) => void;
}

function Connect(props: ConnectProps) {

	const navigate = useNavigate();
	const connection_context = useContext(ConnectionContext);

	useEffect(() => {
		window.electron.ipcRenderer.on('udp-connect-reply', (event: any) => {
			if (event.success && event.success == true) {
				connection_context.setState(true);
				navigate('/control');
				props.SetSocketInfo({ ...props.SocketInfo, id: event.id })
			}
		});
	}, [])

	const submit_ipaddress = () => {
		sendConnectClause(props.SocketInfo);
	}

	return (
		<div className="fit-width center-margin inter connect-page">
			<h2 className="h2-label no-margin" >Connect</h2>
			<div className="input-field center-margin">
				<div className="flex column input-gap margin-top">
					<TextInput placeholder="IP Address" input_type="text" defaultValue={props.SocketInfo.ip_address} onChange={(e) => props.SetSocketInfo({ ...props.SocketInfo, ip_address: e })} />
					<TextInput placeholder="Port" input_type="number" rules={{ max_length: 5, max_value: 25555 }} defaultValue={props.SocketInfo.port} onChange={(e) => props.SetSocketInfo({ ...props.SocketInfo, port: e as unknown as number })} />
				</div>
				<Button text="Connect" className="margin-top" onClick={submit_ipaddress} />
			</div>
		</div>
	)
}

export default Connect;
