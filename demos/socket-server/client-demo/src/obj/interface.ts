
export default interface WIIOTNMessage {
	name: string,
	new: boolean,
}

export interface WIIOTNPing {
	name: string,
	ping: boolean,
}


export interface WIIOTNController extends WIIOTNMessage {
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

export const empty_wii_controller: WIIOTNController = {
	name: '',
	new: false,
	buttons_pressed: 0,
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

//map of buttons_pressed
//
export const key_map: { [key: number]: number } = {
	65: 1,
	66: 2,
	88: 4,
	89: 8,
	38: 16,
	40: 64,
	37: 32,
	39: 128,
	8: 256,
	13: 512,
};
