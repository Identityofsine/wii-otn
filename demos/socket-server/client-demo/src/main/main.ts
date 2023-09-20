/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import WIISocket from '../obj/socket';
import { SockAddrIn } from '../renderer/App';

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let socket: WIISocket | undefined = undefined;

let socket_id: number = -1;

let mainWindow: BrowserWindow | null = null;

function setupSocketInstance(socket_instance: WIISocket, event: Electron.IpcMainEvent) {
	socket_instance.addListener('message', (msg: Buffer) => {

		const msg_obj = JSON.parse(msg.toString());

		if (!msg_obj.type) return;

		if (msg_obj.type === 'connection') {
			event.reply('udp-connect-reply', { "success": msg_obj.success, "id": msg_obj.id })
			socket_id = msg_obj.id;
		}

		if (msg_obj.type === 'controller') {
			event.reply('udp-message', {});
		}

		if (msg_obj.type === 'ping') {
			event.reply('udp-message', {});
		}

		if (msg_obj.type === 'disconnect') {
			event.reply('udp-disconnect-reply', { "success": msg_obj.success, "id": msg_obj.id });
			socket_id = msg_obj.id;
		}

		//generic sender
		if (mainWindow) {
			mainWindow.webContents.send('udp-message', msg);
		}
	});
	socket_instance.addListener('error', (err) => {
		console.log("Error: ", err);
		event.reply('udp-error', err);
		event.reply('udp-connect-reply', { "success": false });
	});
}


ipcMain.on('udp-connect-request', async (event, arg: SockAddrIn) => {
	console.log("UDP connect request received: ", arg);
	socket = new WIISocket(arg.ip_address, arg.port);
	setupSocketInstance(socket, event);
	socket.sendMessage({ name: 'connect', new: true }, (err) => {
		event.reply('udp-connect-reply', { "success": false });
	});
});

ipcMain.on('udp-message', async (event, arg) => {
	if (socket) {
		socket.sendMessage(JSON.parse(arg));
	}
});

ipcMain.on('udp-disconnect-request', async (event, arg) => {
	if (socket) {
		socket.sendMessage(JSON.parse(arg));
	}
});


if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	// require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload,
		)
		.catch(console.log);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath('icon.png'),
		webPreferences: {
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../.erb/dll/preload.js'),
		},
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		//disconnect from socket
		if (socket) {
			socket.sendMessage({ type: 'disconnect', id: socket_id, name: '', new: false });
		}
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: 'deny' };
	});

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app
	.whenReady()
	.then(() => {
		createWindow();
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});
	})
	.catch(console.log);
