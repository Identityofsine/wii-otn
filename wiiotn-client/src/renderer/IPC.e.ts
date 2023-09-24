import { Channels } from "../main/preload";


//maybe have a type for each channel ?
/*
 * export interface IPCMessageInterface [key in Channels]: (data: any) => void) {
 * 	//do something
 * 	}
 *
 *
 *
 */

export type IPCMessageFunction<T extends any> = (data: T) => void;

export interface IPCInterface {
	addEventListener: (event: Channels, callback: (event: any) => void) => number;
	removeEventListener: (event: Channels, event_id: number) => void;
	send: (event: Channels, data: any) => void;
}



class IPCController {
	private static _instance = new IPCController();
	private event_map = new Map<Channels, { id: number, removeEventListener: () => void }[]>();
	private static ipc_renderer = window.electron.ipcRenderer;

	private constructor() {
		if (IPCController._instance) {
			throw new Error("Error: Instantiation failed: Use IPCController.getInstance() instead of new.");
		}
		IPCController._instance = this;
	}

	public static getInstance(): IPCController {
		return IPCController._instance;
	}

	public addEventListener(event: Channels, callback: (event: any) => void): number {
		if (!this.event_map.has(event)) {
			this.event_map.set(event, []);
		}
		const event_id = this.event_map.get(event)?.length ?? 0;
		const event_unlisten_function = IPCController.ipc_renderer.on(event, callback);

		this.event_map.get(event)?.push({ id: event_id, removeEventListener: event_unlisten_function });

		return event_id;
	}

	public addEvents(events: { [key in Channels | string]: ((event: any) => void)[] }): IPCBulkFunctions {
		const ipc_instance = this;
		const event_ids: { [key in Channels]: number[] } = {} as any;
		Object.keys(events).forEach((event) => {
			event_ids[event as Channels] = [];
			events[event as Channels].forEach((callback) => {
				event_ids[event as Channels].push(ipc_instance.addEventListener(event as Channels, callback));
			});
		});

		return {
			unsubscribeAll: () => {
				Object.keys(event_ids).forEach((event) => {
					event_ids[event as Channels].forEach((event_id) => {
						ipc_instance.removeEventListener(event as Channels, event_id);
					});
				});
			}
		}
	}

	public removeEventListener(event: Channels, event_id: number): void {
		const found_event = this.event_map.get(event)?.find((event) => event.id === event_id);
		if (found_event) found_event.removeEventListener();
		//cleanup
		this.event_map.set(event, this.event_map.get(event)?.filter((event) => event.id !== event_id) ?? []);
	}

	public send<T>(event: Channels, data: T): void {
		IPCController.ipc_renderer.sendMessage(event, JSON.stringify(data));
	}

}

export let getIPC = IPCController.getInstance;


type IPCBulkFunctions = {
	unsubscribeAll: () => void;
}

