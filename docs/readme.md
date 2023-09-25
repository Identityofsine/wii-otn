# WiiOTN - Wii Offline to Online

> WiiOTN, short for Wii Offline to Online, is an ambitious project aimed at enabling users to emulate Nintendo Wii games on their computers while seamlessly connecting with friends for online multiplayer gaming experiences.

Many beloved party and local multiplayer titles, such as Wii Sports, Mario Party, Super Mario Bros. Wii, Monopoly, and other classics, were originally designed for in-person gatherings. However, their offline nature has left online and long-distance friendships longing for a solution.

Join us in the quest to bring these iconic titles into the online realm, allowing you to relive the joy and nostalgia of gaming nights with virtual companions.

## Goals and Ambitions
WiiOTN strives to provide a reliable platform for playing local multiplayer games designed for the Nintendo Wii.

> While not its primary focus, WiiOTN has the versatility to accommodate games with multi-controller support, similar to Steam Remote Play Together. However, WiiOTN is tailored for use with Dolphin and Nintendo Wii games.

WiiOTN comprises two essential components: a server and a client. The server runs on the host's computer, enabling them to stream their game directly to connected clients (players). The server efficiently captures controller data from various sources, including Keyboard + Mouse, Xbox Controllers, and WiiMotes, and translates it using the [*VigemBus*](https://github.com/nefarius/ViGEmBus) Virtual Driver.

The WiiOTN Client scans the user's system to identify connected gamepads and WiiMotes. It can translate Mouse + Keyboard Input into a gamepad, effectively simulating a WiiMote. The client aims to deliver low-latency live-streaming, providing both audio and video from the host's game.

#### Planned/Done Implementations
- [x] Initialized Virtual Controllers
- [x] Creation of Frontend App
- [x] Development of Socket Server
- [x] Keyboard Translation Layer
- [x] Controller Translation Layer ( Buttons )
- [x] Controller Translation Layer ( Joystick )
- [ ] Wiimote Translation Layer ( Buttons )
- [ ] Wiimote Translation Layer ( IR Sensor )
- [ ] Wiimote Translation Layer ( Accelerometers )
- [ ] Streaming Layer (C++)
- [ ] Streaming Reception Layer (TypeScript + Electron)
- [ ] UI/UX Enhancements

## Current State

Presently, WiiOTN is compatible only with Keyboard and Controller (including Joysticks) inputs and does not support streaming.

In the upcoming weeks or months, we intend to deliver a complete Wii Offline to Online experience. As of now, you can get a glimpse of the potential.

To play with friends using WiiOTN, you will need to screen-share your game through a medium of your choice. We recommend using **Discord**.

> **NOTE:** Input lag is currently influenced by the **Discord** stream quality. To minimize lag, we suggest streaming your desktop instead of the game itself.

### Tested Games

- **Super Mario Bros. Wii** - Fully functional and playable
- **Mario Party 8** - Functional and Playable
- **Wii Sports** - Functional: Boxing is unplayable, Tennis has minor issues, Golf lacks precision, Bowling works flawlessly.

## Building and Usage

### Server 

> **Note:** Building and running the server are currently supported only on Windows.

To build the server (located at `./demos/socket-server`):

- [Install Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
- Install CMake
> **NOTE:** In case of compiler errors, use the `-G 'Visual Studio xx'` flag in CMake to generate project files.

```powershell
### Build Script
.\build.bat

### Manual Build
cd demos\socket-server
mkdir build
cd build
cmake .. #generate project files
cmake --build .

# Run the build
Debug\socket-server-demo.exe 0.0.0.0
```
>**NOTE:** You may encounter a "ViGEmClient.dll missing" error. In such cases, simply copy `ViGEmClient.dll` from `~/lib/ViGEmClient` into `~/demos/socket-server/build/Debug`.

### Client

> _The Client is cross-platform_

Client files are located in `~/wiiotn-client`.

##### To Run

> **NOTE:** Ensure you have `nodejs` installed on your computer.

- Navigate to `~/wiiotn-client`
- Run `npm install`
- Execute `npm start` to launch the application.

#### To Build

Follow the steps mentioned in the "To Run" section but, instead of `npm start`, execute `npm run package`. The build files will be placed in `~/wiiotn-client/release`.

### Libraries

- [ViGEmClient](https://github.com/nefarius/ViGEmClient)
- [nlohmann/json](https://github.com/nlohmann/json)

Explore and contribute to the WiiOTN project to help us bring local games online.