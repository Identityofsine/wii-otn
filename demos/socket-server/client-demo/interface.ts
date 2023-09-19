export default interface WIIOTNMessage {
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
