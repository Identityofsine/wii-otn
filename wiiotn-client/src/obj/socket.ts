/* eslint-disable */
import { Socket, createSocket } from 'dgram';
import WIIOTNMessage from './interface';

/**
 * @summary Interface for the Socket class, this defines how the user will interact with the socket
 */
export interface SocketInterface {
	sendMessage: (message: WIIOTNMessage) => void;
}

class Queue {
	private queued_events: Function[] = [];
	private is_processing: boolean = false;

	constructor() {

	}

	enqueue(event: Function) {
		this.queued_events.push(event);
		this.q_start();
	}

	dequeue() {
		this.queued_events.shift();
	}

	q_start() {
		if (this.is_processing) return;
		this.is_processing = true;
		for (let i = 0; i < this.queued_events.length; i++) {
			if (this.queued_events.length === 0) break;
			const found_function = this.queued_events.pop();
			if (found_function) {
				found_function();
			}
		}
		this.is_processing = false;
	}


}

/**
 * @summary Simple Socket Object that implements the SocketInterface, this keeps the connection going and sends messages to the server
 * @warning This is not intended to be used in the frontend/renderer, only in the backend/main(electron)
 */
export default class WIISocket implements SocketInterface {
	private socket: Socket;
	private ip: string;
	private port: number;
	private socket_queue: Queue;

	constructor(ip: string, port: number) {
		//construct socket
		this.socket = createSocket('udp4');
		this.ip = ip;
		this.port = port;
		this.socket_queue = new Queue();
	}


	sendMessage(message: WIIOTNMessage, onError?: (err: Error) => void) {
		this.socket_queue.enqueue(() => {
			this.socket.send(JSON.stringify(message), this.port, this.ip, (err) => {
				if (err) {
					if (onError) onError(err);
				}
			});
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
