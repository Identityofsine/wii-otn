// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'udp-connect-request' | 'udp-message' | 'udp-error' | 'udp-connect-reply' | 'udp-disconnect-request' | 'udp-disconnect-reply' | 'debug-message' | 'fetch-settings' | 'fetch-settings-reply' | 'store-settings' | 'store-settings-reply' | 'udp-success-packet' | 'udp-ping';

const electronHandler = {
	ipcRenderer: {
		sendMessage(channel: Channels, ...args: unknown[]) {
			ipcRenderer.send(channel, ...args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
