import * as HID from 'node-hid';

export class WiiMote extends HID.HID {
	constructor(path: string) {
		super(path);
		this.on('data', this.m_onData);
		this.w_init();
	}

	private w_init() {
		//report in 0x37 mode
		const enable_output: Buffer = Buffer.from([0x12, 0x00, 0x37])
		try {
			this.write(enable_output);
		} catch (e) {
			console.log("[ERROR]: This Controller Cannot Be Written to!");
		}
	}

	private u_returnButtons(hex_buttons: number, byte_index: number = 0): string[] {
		const buttons: string[] = [];
		if (byte_index === 0) {
			if (hex_buttons & 0x0001) buttons.push('left');
			if (hex_buttons & 0x0002) buttons.push('right');
			if (hex_buttons & 0x0004) buttons.push('down');
			if (hex_buttons & 0x0008) buttons.push('up');
			if (hex_buttons & 0x0010) buttons.push('plus');
		} else if (byte_index === 1) {
			if (hex_buttons & 0x0001) buttons.push('two');
			if (hex_buttons & 0x0002) buttons.push('one');
			if (hex_buttons & 0x0004) buttons.push('b');
			if (hex_buttons & 0x0008) buttons.push('a');
			if (hex_buttons & 0x0010) buttons.push('minus');
			if (hex_buttons & 0x0080) buttons.push('home');
		}
		return buttons;
	}

	private m_onData(data: Buffer) {
		//data <ID BB BB AA AA AA ... > :ID is the report ID BB is the buttons_pressed
		const buttons_bytes = data.slice(1, 3);
		const accelerometer_bytes = data.slice(3, 6);
		this.e_buttonData(buttons_bytes);
		this.e_accelerometerData(accelerometer_bytes);
	}

	private e_buttonData(data: Buffer) {
		const buttons_pressed: string[] = [...this.u_returnButtons(data[0]), ...this.u_returnButtons(data[1], 1)];
		if (buttons_pressed.length > 0)
			console.log(buttons_pressed);
	}

	//assume data is 3 bytes long
	private e_accelerometerData(data: Buffer) {
		const x = data[0];
		const y = data[1];
		const z = data[2];
		console.log(`x: ${x}, y: ${y}, z: ${z}`);
	}





}
