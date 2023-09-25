import { Channels } from "../main/preload";

/**
 * @summary This interface defines the functions that are returned from the addEvents function
 */
export type IPCMessageFunction<T extends any> = (data: T) => void;


/**
 * @summary How the end-developer will interact with the IPCController
 */
export interface IPCInterface {
	addEventListener: (event: Channels, callback: (event: any) => void) => number;
	removeEventListener: (event: Channels, event_id: number) => void;
	send: (event: Channels, data: any) => void;
}


/**
 * @summary This singleton class allows the end-developer to interact with the IPCRenderer throughout the entire application, this makes it easy to call functions and logic from the electorn-backend while keeping a rigid and robust system.
 */
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

	/**
	 * @summary Add an event to the event_map, which is keyed by {Channels}, a type that defines all the possible messages in an IPCMessage
	 */
	public addEventListener(event: Channels, callback: (event: any) => void): number {
		if (!this.event_map.has(event)) {
			this.event_map.set(event, []);
		}
		const event_id = this.event_map.get(event)?.length ?? 0;
		const event_unlisten_function = IPCController.ipc_renderer.on(event, callback);

		this.event_map.get(event)?.push({ id: event_id, removeEventListener: event_unlisten_function });

		return event_id;
	}

	/**
	 * @summary This bulk event function allows for a x amount of events to be added,it returns a function that will unsubscribe all the events that were added
	 */
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

	/**
	 * @summary Remove an event from the event_map, which is keyed by {Channels}, a type that defines all the possible messages in an IPCMessage
	 */
	public removeEventListener(event: Channels, event_id: number): void {
		const found_event = this.event_map.get(event)?.find((event) => event.id === event_id);
		if (found_event) found_event.removeEventListener();
		//cleanup
		this.event_map.set(event, this.event_map.get(event)?.filter((event) => event.id !== event_id) ?? []);
	}

	/**
	 * @summary Send a message to the IPCMain, this will be picked up by the IPCMain and sent to the correct {Channels}
	 */
	public send<T>(event: Channels, data: T): void {
		console.log("[DEBUG] IPC Sending:%s [send<T>]", event);
		IPCController.ipc_renderer.sendMessage(event, JSON.stringify(data));
	}

}

export let getIPC = IPCController.getInstance;


type IPCBulkFunctions = {
	unsubscribeAll: () => void;
}

