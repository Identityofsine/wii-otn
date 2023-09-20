import WIIOTNMessage from "../obj/interface";
import { SockAddrIn } from "./App";

export function sendConnectClause(sock_info: SockAddrIn): void {
	window.electron.ipcRenderer.sendMessage('udp-connect-request', sock_info);
}

export function sendDisconnectClause(id: number) {
	const wiiotn_packet: WIIOTNMessage = {
		id: id,
		type: 'disconnect',
		new: false,
		name: '',
	}
	window.electron.ipcRenderer.sendMessage('udp-disconnect-request', JSON.stringify(wiiotn_packet));
}

