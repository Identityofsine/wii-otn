import * as HID from "node-hid";
import { WiiMote } from "./wiimote";


let wiimotes: WiiMote[] = [];

//list paths for debug
const devices = HID.devices();
devices.forEach((device) => { if (device.vendorId === 1406) wiimotes.push(new WiiMote(device.path!)); });



wiimotes.forEach((wiimote, index) => {
	wiimote.on('data', (data: Buffer) => {
	})
});


