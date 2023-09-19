import * as dgram from "dgram";
import WIIOTNMessage from "./interface";


export interface SocketInterface {
	sendMessage: (message: WIIOTNMessage) => void;
}

export default class Socket implements SocketInterface {

	private socket: dgram.Socket;
	private ip: string;
	private port: number;

	constructor(ip: string, port: number) {
		//construct socket
		this.socket = dgram.createSocket("udp4");
		this.ip = ip;
		this.port = port;

	}

	sendMessage(message: WIIOTNMessage) {
		this.socket.send(JSON.stringify(message), this.port, this.ip, (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	/**
	* events.EventEmitter
	* 1. close
	* 2. connect
	* 3. error
	* 4. listening
	* 5. message
	*/
	addListener(event: 'close' | 'connect' | 'error' | 'listening' | 'message', listener: (message: any) => void) {
		this.socket.on(event, listener);
	}

}
