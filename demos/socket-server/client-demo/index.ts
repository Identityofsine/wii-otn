import * as dgram from "dgram";

//create udp socket client, send a basic JSON message to the server, and print the response to the console.


const server_address: string = "127.0.0.1";
const server_port: string = "1337";

//basic message, acting as a wii mote
interface WIIOTNMessage {
	buttons_pressed: number, //should be binary encoded 01101110, each bit represents a buttons_pressed
	accelerometer_x: number,
	accelerometer_y: number,
	accelerometer_z: number,
	accelerometer_pitch: number,
	accelerometer_roll: number,
	accelerometer_yaw: number,
	ir_sensor_1_x: number,
	ir_sensor_1_y: number,
	ir_sensor_2_x: number,
	ir_sensor_2_y: number,
}

//create a socket
const client = dgram.createSocket("udp4");


//create a message
const basic_message: WIIOTNMessage = {
	buttons_pressed: 0b01101110,
	accelerometer_x: 0,
	accelerometer_y: 0,
	accelerometer_z: 0,
	accelerometer_pitch: 0,
	accelerometer_roll: 0,
	accelerometer_yaw: 0,
	ir_sensor_1_x: 0,
	ir_sensor_1_y: 0,
	ir_sensor_2_x: 0,
	ir_sensor_2_y: 0,
}

//listen for messages
client.on("message", (msg, rinfo) => {
	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

//send the basic_message
client.send(JSON.stringify(basic_message), parseInt(server_port), server_address, (err) => {
	if (err) {
		console.error(err);
	}
});

//create a loop to send messages every 1000msg
setInterval(() => {
	client.send(JSON.stringify(basic_message), parseInt(server_port), server_address, (err) => {
		if (err) {
			console.error(err);
		}
	});
}, 1000);

//dont terminate program until user input


//close the socket


