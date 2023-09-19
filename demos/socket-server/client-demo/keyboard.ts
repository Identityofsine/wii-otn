import * as process from 'process';
import * as readline from 'readline';
import createState from './state';

export namespace KeyboardListener {

	export class KeyboardListener {

		private listeners: { keypress?: ((key: number) => void)[], keyup?: (() => void)[] } = { keypress: [], keyup: [] };
		private std_input = process.stdin;
		private interval_id: NodeJS.Timeout | null = null;
		public current_key = createState<number>();


		constructor() {
			readline.emitKeypressEvents(this.std_input);
			if (process.stdin.isTTY)
				this.std_input.setRawMode(true);

			//on any data into stdin
			this.std_input.on('data', (key: Buffer) => {
				if (this.interval_id)
					clearTimeout(this.interval_id);

				const buffer_int = key.readInt8();
				if (this.listeners.keypress)
					this.listeners.keypress.forEach(listener => listener(buffer_int));
				if (buffer_int === 3)
					process.exit();
				this.current_key.setState(buffer_int);

				//on keyup
				this.interval_id = setTimeout(() => {
					this.current_key.setState(0);
					if (this.listeners.keyup)
						this.listeners.keyup.forEach(listener => listener());
				}, this.interval_id ? 200 : 2000);
			});
		}

		addListener(event: 'keypress' | 'keyup', listener: (...arg0: any) => void) {
			this.listeners[event].push(listener);
		}
	}
}
