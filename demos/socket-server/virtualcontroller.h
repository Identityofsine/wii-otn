#include "includes.h"
#include <ViGem/Client.h>
#pragma comment(lib, "setupapi.lib")

namespace WIIOTN_VC {

	enum BindedKeys {
		A,
		B,
		X,
		Y,
		DPAD_UP = VK_UP,
		DPAD_DOWN = VK_DOWN,
		DPAD_LEFT = VK_LEFT,
		DPAD_RIGHT = VK_RIGHT,
		START = VK_RETURN,
		BACK = VK_BACK,
		BREAK = VK_END 
	};



	class VirtualController {

	private:
		PVIGEM_CLIENT m_client; // bus_handle 
		PVIGEM_TARGET m_target; // controller_handle
	
	public: 
		VirtualController();	
		~VirtualController();
		const XUSB_REPORT controllerReportFactory(std::vector<BindedKeys> pressed_key); //handle multiple
		const XUSB_REPORT controllerReportFactory(BindedKeys pressed_key); //handle single keypress
		VIGEM_ERROR submitInput(const XUSB_REPORT controller_report);
	};

}


