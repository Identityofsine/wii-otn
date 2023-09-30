/* eslint-disable */
import { Socket, createSocket } from 'dgram';
import WIIOTNMessage from './interface';

/**
 * @summary Interface for the Socket class, this defines how the user will interact with the socket
 */
export interface SocketInterface {
	sendMessage: (message: WIIOTNMessage) => void;
}

/**
 * @summary Simple Socket Object that implements the SocketInterface, this keeps the connection going and sends messages to the server
 * @warning This is not intended to be used in the frontend/renderer, only in the backend/main(electron)
 */
export default class WIISocket implements SocketInterface {
	private socket: Socket;
	private ip: string;
	private port: number;
	private queue: WIIOTNMessage[] = [];

	constructor(ip: string, port: number) {
		//construct socket
		this.socket = createSocket('udp4');
		this.ip = ip;
		this.port = port;
	}

	sendMessage(message: WIIOTNMessage, onError?: (err: Error) => void) {
		this.socket.send(JSON.stringify(message), this.port, this.ip, (err) => {
			if (err) {
				if (onError) onError(err);
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
	addListener(
		event: 'close' | 'connect' | 'error' | 'listening' | 'message',
		listener: (message: any) => void,
	) {
		this.socket.on(event, listener);
	}
}
