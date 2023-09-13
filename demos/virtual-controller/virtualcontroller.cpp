#include "virtualcontroller.h"
#include <stdexcept>

using namespace WIIOTN_VC;
/*
 * Constructor of VirtualController.
 * This function will initialize the client and target. Effectively connecting the Virtual Controller to the computer.
 * 
 */
WIIOTN_VC::VirtualController::VirtualController() {
	m_client = vigem_alloc();
	if(!m_client) 
		throw std::runtime_error("Failed to allocate memory!");	
	
	const auto vigem_client_status = vigem_connect(m_client);
	if(!VIGEM_SUCCESS(vigem_client_status))
		throw std::runtime_error("Failed to connect to driver!");
	m_target = vigem_target_x360_alloc();
	if(!m_target)
		throw std::runtime_error("Failed to allocate memory for controller!");
	const auto vigem_target_status = vigem_target_add(m_client, m_target);
	if(!VIGEM_SUCCESS(vigem_target_status))
		throw std::runtime_error("Failed to add virtual pad to client!");
}


/*
* Deconstructor of VirtualController, this function will free the memory of the client and target. Effectively disconnecting the Virtual Controller from the computer
*
*/
WIIOTN_VC::VirtualController::~VirtualController() {
	vigem_target_remove(m_client, m_target);
	vigem_target_free(m_target);
	vigem_disconnect(m_client);
	vigem_free(m_client);
}

const XUSB_REPORT WIIOTN_VC::VirtualController::controllerReportFactory(BindedKeys pressed_key) {

	//create empty controller_report
	XUSB_REPORT controller_report;
	
	//set all joystick values to 0
	controller_report.sThumbLX = controller_report.sThumbLY = controller_report.sThumbRX = controller_report.sThumbRY = 0;

	//switch statement to set the correct button
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
		case BindedKeys::A:
			controller_report.wButtons = XUSB_GAMEPAD_A;
			break;
		case BindedKeys::B:
			controller_report.wButtons = XUSB_GAMEPAD_B;
			break;
		case BindedKeys::X:
			controller_report.wButtons = XUSB_GAMEPAD_X;
			break;
		case BindedKeys::Y:
			controller_report.wButtons = XUSB_GAMEPAD_Y;
			break;
		default:
			controller_report.wButtons = 0;
			break;
	}

	return controller_report;
}

VIGEM_ERROR WIIOTN_VC::VirtualController::submitInput(const XUSB_REPORT controller_report) {
	return vigem_target_x360_update(m_client, m_target, controller_report);
}

