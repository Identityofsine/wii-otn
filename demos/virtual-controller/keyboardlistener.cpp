#include "keyboardlistener.h"
#define MIN_INPUT_DELAY 20

using namespace WIIOTN_VC;


WIIOTN_KEYBOARD::KeyboardListener::KeyboardListener() {
}

WIIOTN_KEYBOARD::KeyboardListener::~KeyboardListener() {	
}

void WIIOTN_KEYBOARD::KeyboardListener::run(VirtualController *controller, const int input_delay) {
	this->running = true;
	while(this->running) {
		//grab pressedKeys
 		const std::vector<WIIOTN_VC::BindedKeys> key_states = this->getPressedKeys();
		controller->submitInput(controller->controllerReportFactory(key_states));
		// check if break key is pressed 
		for (auto key_state : key_states) {
			printf("Key: %d\n", key_state);
			if(key_state == BindedKeys::BREAK) {
				this->running = false;
				break;
			}
		}
		//delay input, so the controller doesn't go crazy and not waste cpu cycles
		Sleep(MIN_INPUT_DELAY + input_delay);
		/*
		* No Input Clause
		*/
	}
}

std::vector<WIIOTN_VC::BindedKeys> WIIOTN_KEYBOARD::KeyboardListener::getPressedKeys() {

	std::vector<WIIOTN_VC::BindedKeys> pressed_keys;
	if (GetAsyncKeyState(VK_UP)) {
		pressed_keys.push_back(BindedKeys::DPAD_UP);
	}
	if (GetAsyncKeyState(VK_DOWN)) {
		pressed_keys.push_back(BindedKeys::DPAD_DOWN);
	}
	if (GetAsyncKeyState(VK_LEFT)) {
		pressed_keys.push_back(BindedKeys::DPAD_LEFT);
	}
	if (GetAsyncKeyState(VK_RIGHT)) {
		pressed_keys.push_back(BindedKeys::DPAD_RIGHT);
	}
	if (GetAsyncKeyState(VK_RETURN)) {
		pressed_keys.push_back(BindedKeys::START);
	}
	if (GetAsyncKeyState(VK_BACK)) {
		pressed_keys.push_back(BindedKeys::BACK);
	}

	// check for A, B, X, Y
	if (GetAsyncKeyState('A')) {
		pressed_keys.push_back(BindedKeys::A);
	}
	if (GetAsyncKeyState('B')) {
		pressed_keys.push_back(BindedKeys::B);
	}
	if (GetAsyncKeyState('X')) {
		pressed_keys.push_back(BindedKeys::X);
	}
	if (GetAsyncKeyState('Y')) {
		pressed_keys.push_back(BindedKeys::Y);
	}
	if(GetAsyncKeyState(VK_END)) {
		pressed_keys.push_back(BindedKeys::BREAK);
	}

	return pressed_keys;
}
