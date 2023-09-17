#include "virtualcontroller.h"
#include <iostream>

#define SLEEP_TIME 400

int main() {
  // return value
	//
	//
	
	//create virtual controller
	WIIOTN_VC::VirtualController virtual_controller;
	printf("Virtual Controller created\n");
	
	bool continue_loop = true;
	while(continue_loop) {
		if(GetAsyncKeyState(VK_END)) {
			continue_loop = false;
			break;
		}
		//create controller report
		if(GetAsyncKeyState(VK_UP)) {
			//add a controller
			try {
				virtual_controller.connectController();
				printf("Controller connected\n");
			} catch (std::runtime_error& e) {
				printf("Failed to connect controller\n");
			}
		}

		Sleep(SLEEP_TIME);
	}
	

  return 0;
}
