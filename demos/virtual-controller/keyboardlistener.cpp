#include "keyboardlistener.h"

using namespace WIIOTN_VC;

WIIOTN_KEYBOARD::KeyboardListener::KeyboardListener() {
}

WIIOTN_KEYBOARD::KeyboardListener::~KeyboardListener() {	
}

void WIIOTN_KEYBOARD::KeyboardListener::run(VirtualController *controller) {
	this->running = true;
	while(this->running) {
		// get live-input (outside window)
		if (GetAsyncKeyState(VK_UP)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::DPAD_UP));
		}
		if (GetAsyncKeyState(VK_DOWN)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::DPAD_DOWN));
		}
		if (GetAsyncKeyState(VK_LEFT)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::DPAD_LEFT));
		}
		if (GetAsyncKeyState(VK_RIGHT)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::DPAD_RIGHT));
		}
		if (GetAsyncKeyState(VK_RETURN)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::START));
		}
		if (GetAsyncKeyState(VK_BACK)) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::BACK));
		}

		// check for A, B, X, Y
		if (GetAsyncKeyState('A')) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::A));
		}
		if (GetAsyncKeyState('B')) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::B));
		}
		if (GetAsyncKeyState('X')) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::X));
		}
		if (GetAsyncKeyState('Y')) {
			controller->submitInput(controller->controllerReportFactory(BindedKeys::Y));
		}
		if (GetAsyncKeyState(VK_END)) {
			this->running = false;
			break;
		}

		/*
		* No Input Clause
		*/
		Sleep(10);
		controller->submitInput(controller->controllerReportFactory(BindedKeys::BREAK));
	}
}


