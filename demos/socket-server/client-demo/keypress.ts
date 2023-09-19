import WIIOTNMessage from "./interface";
import Socket from "./socket";

const runKeyListener = () => {
	var stdin = process.stdin;

	// without this, we would only get streams once enter is pressed
	stdin.setRawMode(true);

	// resume stdin in the parent process (node app won't quit all by itself
	// unless an error or process.exit() happens)
	stdin.resume();

	// i don't want binary, do you?
	stdin.setEncoding('utf8');

	// on any data into stdin
	stdin.on('data', function(key) {
		// ctrl-c ( end of text )
		if (key as unknown as string === '\u0003') {
			process.exit();
		}

		let template_message: WIIOTNMessage = {
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

		//key maps to a button press
		/*
		* 00000000 - nothing pressed - no key
		* 00000001 - A - a
		* 00000010 - B - b
		* 00000100 - X - x
		* 00001000 - Y - y
		* 00010000 - DPAD UP - up-arrow
		* 00100000 - DPAD DOWN - down-arrow
		* 01000000 - DPAD LEFT - left-arrow
		* 10000000 - DPAD RIGHT - right-arrow
		* 00001001 - PLUS - enter	
		* 00001010 - MINUS - backspace
		*/

		function mapKeyToBit(key: string) {
			switch (key) {
				case 'a':
					return 1;
				case 'b':
					return 2;
				case 'x':
					return 4;
				case 'y':
					return 8;
				case 'o':
					return 16;
				case 'l':
					return 32;
				case 'k':
					return 64;
				case ';':
					return 128;
				case 'Enter':
					return 9;
				case 'Backspace':
					return 10;
				default:
					return 0;
			}
		}

		// write the key to stdout all normal like
		const binary_number = mapKeyToBit(key.toString());
		template_message.buttons_pressed = binary_number;
		console.log(template_message.buttons_pressed);
		new Socket().sendMessage(template_message);
		//delay and send blank
		setTimeout(() => {
			template_message.buttons_pressed = 0;
			new Socket().sendMessage(template_message);
		}, 250);
	});
}

export default runKeyListener;

runKeyListener();
