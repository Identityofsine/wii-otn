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

}


/*
* Deconstructor of VirtualController, this function will free the memory of the client and target. Effectively disconnecting the Virtual Controller from the computer
*
*/
WIIOTN_VC::VirtualController::~VirtualController() {

	//run loop to remove all targets ( controller handles )
	for(auto controller_handle : m_targets) {
		vigem_target_remove(m_client, controller_handle.target);
		vigem_target_free(controller_handle.target);
	}

	vigem_disconnect(m_client);
	vigem_free(m_client);
}

const XUSB_REPORT WIIOTN_VC::VirtualController::controllerReportFactory(std::vector<BindedKeys> pressed_keys) {

	//create empty controller_report
	XUSB_REPORT controller_report;
	
	//set all joystick values to 0
	controller_report.sThumbLX = controller_report.sThumbLY = controller_report.sThumbRX = controller_report.sThumbRY = 0;

	//[0,255]
	controller_report.bLeftTrigger = controller_report.bRightTrigger = 0 ;

	controller_report.wButtons = 0;
	
	//loop through all pressed_keys and flag controller_report accordingly
	for (auto pressed_key : pressed_keys) {	
		switch(pressed_key) {
			case A:
				controller_report.wButtons |= XUSB_GAMEPAD_A;
				break;
			case B:
				controller_report.wButtons |= XUSB_GAMEPAD_B;
				break;
			case X:
				controller_report.wButtons |= XUSB_GAMEPAD_X;
				break;
			case Y:
				controller_report.wButtons |= XUSB_GAMEPAD_Y;
				break;
			case DPAD_UP:
				controller_report.wButtons |= XUSB_GAMEPAD_DPAD_UP;
				break;
			case DPAD_DOWN:
				controller_report.wButtons |= XUSB_GAMEPAD_DPAD_DOWN;
				break;
			case DPAD_LEFT:
				controller_report.wButtons |= XUSB_GAMEPAD_DPAD_LEFT;
				break;
			case DPAD_RIGHT:
				controller_report.wButtons |= XUSB_GAMEPAD_DPAD_RIGHT;
				break;
			case START:
				controller_report.wButtons |= XUSB_GAMEPAD_START;
				break;
			case BACK:
				controller_report.wButtons |= XUSB_GAMEPAD_BACK;
				break;
			default:
				break;
		}

	}
	return controller_report;
}

//overload for single inputs
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



VIGEM_ERROR WIIOTN_VC::VirtualController::submitInput(const int controller_id, const XUSB_REPORT controller_report) {

	if(controller_id >= m_targets.size())
		throw std::runtime_error("Invalid controller_id!");

	const auto controller_handle = m_targets[controller_id].target;
	//check if controller_handle is valid
	if(!controller_handle)
		throw std::runtime_error("Invalid controller_handle!");

	return vigem_target_x360_update(m_client, controller_handle, controller_report);
}

bool WIIOTN_VC::VirtualController::connectController() {
	//create new controller
	const auto new_controller = vigem_target_x360_alloc();
	if(!new_controller)
		return false;

	const int new_controller_id = m_targets.size();
	
	//create new controller handle
	const ControllerHandle new_controller_handle = { new_controller_id, new_controller };
	
	//add to controller array
	m_targets.push_back(new_controller_handle);
	
	//add to vigem client
	const auto vigem_target_status = vigem_target_add(m_client, new_controller);
	if(!VIGEM_SUCCESS(vigem_target_status))
		return false;
	
	return true;

}

bool WIIOTN_VC::VirtualController::disconnectController(const int controller_id) {
	//check if controller_id is valid
	if(controller_id >= m_targets.size())
		return false;

	//remove controller from vigem client
	const auto controller_handle = m_targets[controller_id].target;
	const auto vigem_target_status = vigem_target_remove(m_client, controller_handle);
	if(!VIGEM_SUCCESS(vigem_target_status))
		return false;

	//free controller_handle
	vigem_target_free(controller_handle);

	//remove controller_handle from m_targets
	for(auto it = m_targets.begin(); it != m_targets.end(); it++) {
		if(it->id == controller_id) {
			m_targets.erase(it);
			break;
		}
	}
	return true;
}
