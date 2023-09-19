import * as dgram from "dgram";
import WIIOTNMessage from "./interface";

const server_address: string = "127.0.0.1";
const server_port: string = "1337";

//basic message, acting as a wii mote


//create a socket
const client = dgram.createSocket("udp4");

//listen for messages
client.on("message", (msg, rinfo) => {
	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

//send the basic_message
client.send(JSON.stringify({ new: true }), parseInt(server_port), server_address, (err) => {
	if (err) {
		console.error(err);
	}
});


export interface SocketInterface {
	sendMessage: (message: WIIOTNMessage) => void;
}

export default class Socket implements SocketInterface {
	sendMessage(message: WIIOTNMessage): void {
		client.send(JSON.stringify(message), parseInt(server_port), server_address, (err) => {
			if (err) {
				console.error(err);
			}
		});
	}
}
