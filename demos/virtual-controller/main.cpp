#include <Windows.h>
#include <iostream>
#include <stdio.h>
#include <ViGEm/Client.h>

#pragma comment(lib, "setupapi.lib")

//set simple keyboard keys as easy to read enums

enum BindedKeys {
	DPAD_UP = VK_UP,
	DPAD_DOWN = VK_DOWN,
	DPAD_LEFT = VK_LEFT,
	DPAD_RIGHT = VK_RIGHT,
	START = VK_RETURN,
	BACK = VK_BACK,
	BREAK = VK_END 
};

const XUSB_REPORT controllerReportFactory(BindedKeys pressed_key) {
	//create a blank XUSB_REPORT to pass to the controller
	XUSB_REPORT controller_report = {};

	//set joysticks to nill
	controller_report.sThumbLX = controller_report.sThumbLY = controller_report.sThumbRX = controller_report.sThumbRY = 0;

	//switch statement
	switch (pressed_key) {
		case BindedKeys::START:
			controller_report.wButtons = XUSB_GAMEPAD_START;
			break;
		case BindedKeys::BACK:
			controller_report.wButtons = XUSB_GAMEPAD_BACK;
			break;
		case BindedKeys::DPAD_UP:
			controller_report.wButtons = XUSB_GAMEPAD_DPAD_UP;
			break;
		case BindedKeys::DPAD_DOWN:
			controller_report.wButtons = XUSB_GAMEPAD_DPAD_DOWN;
			break;
		case BindedKeys::DPAD_LEFT:
			controller_report.wButtons = XUSB_GAMEPAD_DPAD_LEFT;
			break;
		case BindedKeys::DPAD_RIGHT:
			controller_report.wButtons = XUSB_GAMEPAD_DPAD_RIGHT;
			break;
		default:
			controller_report.wButtons = 0;
			break;
	}
	
	return controller_report;
}

void run() {
  // Initialize the client context
  const auto client = vigem_alloc();
  // check if client connected
  if (!client) {
    printf("Failed to allocate memory!\n");
    return;
  } else {
    printf("Memory Allocated!\n");
  }

  // send a handle to our driver
  const auto bus_return_value = vigem_connect(client);
  if (!VIGEM_SUCCESS(bus_return_value)) {
		//print value in hex
    std::cout << "Failed to connect to driver! Error: " << std::hex
              << bus_return_value << std::endl;
    return;
  } else {
    printf("Congrats!, You are connected to driver!\n");
  }

  //
  // initialize controller
  //
  const auto pad = vigem_target_x360_alloc(); // allocate memory for controller

  //
  // push pad to vigemBus
  //
  const auto pad_return_value = vigem_target_add(client, pad); // push controller to vigemBus)

  //
  // check if controller was pushed to vigemBus
  //
  if (!VIGEM_SUCCESS(pad_return_value)) {
    printf("Failed to add virtual pad to client! Error: %d\n", pad_return_value);
    return;
  } else {
    printf("Virtual pad added to client!\n");
  }


	printf("Currently running a loop, press END to quit!\n");
	//map keyboard to Controller
	bool break_key_pressed = false;
	while(!break_key_pressed) {

		//exit program key // Escape
		if(GetAsyncKeyState(BindedKeys::BREAK)) {
			printf("Exiting program!\n");
			break_key_pressed = true;
			break;
		}
		
		//start key // Enter
		if(GetAsyncKeyState(BindedKeys::START)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::START);
				
			vigem_target_x360_update(client, pad, controller_report);
		}
		//back key // Backspace
		if(GetAsyncKeyState(BindedKeys::BACK)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::BACK);
			vigem_target_x360_update(client, pad, controller_report);
		}
		//dpad up // Arrow VK_UP
		if(GetAsyncKeyState(BindedKeys::DPAD_UP)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::DPAD_UP);
			vigem_target_x360_update(client, pad, controller_report);
		}
		//dpad down // Arrow VK_DOWN
		if(GetAsyncKeyState(BindedKeys::DPAD_DOWN)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::DPAD_DOWN);
			vigem_target_x360_update(client, pad, controller_report);
		}
		//dpad left // Arrow VK_LEFT
		if(GetAsyncKeyState(BindedKeys::DPAD_LEFT)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::DPAD_LEFT);
			vigem_target_x360_update(client, pad, controller_report);
		}
		//dpad right // Arrow VK_RIGHT
		if(GetAsyncKeyState(BindedKeys::DPAD_RIGHT)) {
			const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::DPAD_RIGHT);
			vigem_target_x360_update(client, pad, controller_report);
		}
		//sleep for 10ms
		Sleep(10);
		//reset controllert to blank
		const XUSB_REPORT controller_report = controllerReportFactory(BindedKeys::BREAK);
		vigem_target_x360_update(client, pad, controller_report);
		
	}

  //
  // disconnect pads from computer, free resources (disconnect virtual device)
  //
  vigem_target_remove(client, pad);
  //
  // free Memory
  //
  vigem_target_free(pad);
  //
  // adding a sleep to demonstrate driver disconnection
  //
  Sleep(2000);
  printf("Disconnecting from bus...\n");
  //
  // finish up and disconnect from driver
  //
  vigem_disconnect(client);
  //
  // free memory
  //
  vigem_free(client);
  printf("Exit!\n");
}

int main() {
  //
  // welcome message
  //
  printf("Hello World, Controller Virtualization!\n");
  run();
  return 0;
}
