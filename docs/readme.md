# WiiOTN
> Wii Offline to Online

WiiOTN or Wii Offline to Online is a work in progress system that would allow you to emulate Nintendo Wii games on your computer and be able to have your friends connect and play with you. 

Many beloved party and local multiplayer titles such as Wii Sports, Mario Party, Super Mario Bros. Wii, Monopoly, and similar classics are designed and created for in-person gatherings. However, these *fun for all* titles have been left to time due to them being confined to offline play, leaving online and long-distance friendships wanting for a solution.

Join us in bringing these iconic titles to the online realm, where you can relive the fun and nostalgia of gaming nights with your virtual companions. 

## Goals and Ambitions
WiiOTN will be a sure way to be able to play local multiplayer games for the Nintendo Wii.

>While not intended, WiiOTN can be used to play any game that has multi-controller support (similar to Steam Remote Play Together), however Wii-OTN is specialized for Dolphin and Nintendo Wii games.

WiiOTN has two parts, a server and a client. The server will be able to launch on the hosts computer and allow them to stream their game directly to their connected clients(players). The server will intercept packets of controller data from all types (Keyboard + Mouse, Xbox Controllers, and WiiMotes) and translate them appropriately to a Virtual Driver using [*VigemBus*](https://github.com/nefarius/ViGEmBus). 

WiiOTN Client will be able to listen to the user's system and find connected gamepads and WiiMotes. The client will be able to translate Mouse + Keyboard Input to a gamepad and allow them to act as a WiiMote. While all of this is happening, the client should be able to interpret a live-stream with minimal latency to provide both audio and video of the host's game.

#### Planned/Done Implementations
- [x] Initialized Virtual Controllers
- [x] Create Frontend App
- [x] Create Socket Server
- [x] Keyboard Translation Layer
- [x] Controller Translation Layer ( Buttons )
- [x] Controller Translation Layer ( Joystick )
- [ ] Wiimote Translation Layer ( Buttons )
- [ ] Wiimote Translation Layer ( IR Sensor )
- [ ] Wiimote Translation Layer ( Accelerometers )
- [ ] Streaming Layer (C++)
- [ ] Streaming Reception Layer (TS + Electron)
- [ ] UI/UX Revamp.

## Current State

Currently WiiOTN only works with Keyboard and Controller(Joysticks including), without streaming unfortunately. 

In the next coming weeks or months, efforts will be made to provide a full Wii Offline to Online experience but as of now, we can only get a taste of what it would be like.

In-order to actually play with your friends using WiiOTN, you would have to screen-share your game using any medium you want. We recommend using **Discord.**

>**NOTE:** Input Lag is currently very dependent on the **Discord** Stream, we recommend streaming your desktop instead of your game, the lag seems to be tolerable.

### Tested Games

**Super Mario Bros. Wii** - Fully functional and playable
**Mario Party 8** - Functional and Playable
**Wii Sports** - Functional: Boxing is unplayable, Tennis is janky, Golf has no precision, Bowling works perfectly.


## Building and Using

## Server 

>**Note:** Building and Running the Server is only supported for Windows currently.

To build the current server (*located at ./demos/socket-server*):
- [Install Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
- Install CMake
> **NOTE:** If you get any compiler errors, make sure to generate the project files using the `-G 'Visual Studio xx'` flag in CMake.

```powershell


### Manually
cd demos\socket-server
mkdir build
cd build
cmake .. #generate project files
cmake --build .

#run build
Debug\socket-server-demo.exe 0.0.0.0
```

### Libraries
- [ViGEmClient](https://github.com/nefarius/ViGEmClient)
- [nlohmann/json](https://github.com/nlohmann/json)