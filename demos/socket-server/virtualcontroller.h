#include <Windows.h>
#include <vector>
#include <ViGem/Client.h>

namespace WIIOTN_VC {

	enum BindedKeys {
		A,
		B,
		X,
		Y,
		DPAD_UP,
		DPAD_DOWN,
		DPAD_LEFT, 
		DPAD_RIGHT,
		START,
		BACK,
		LB,
		RB,
		LTD,
		RTD,
		HOME,
		BREAK, 
	};

	struct ThumbstickPosition {
		short l_thumb_x;	
		short l_thumb_y;
		short r_thumb_x;
		short r_thumb_y;
	};


	struct ControllerHandle {
		int id;
		PVIGEM_TARGET target;
		ThumbstickPosition thumbstick_position;
	};

	class VirtualController {

	private:
		PVIGEM_CLIENT m_client; // bus_handle 
		std::vector<ControllerHandle> m_targets; // controller_handle
	
	public: 
		VirtualController();	
		~VirtualController();
		const XUSB_REPORT controllerReportFactory(std::vector<BindedKeys> pressed_key, ThumbstickPosition thumbstick_position); //handle multiple
		const XUSB_REPORT controllerReportFactory(BindedKeys pressed_key, ThumbstickPosition thumbstick_position); //handle single keypress
		VIGEM_ERROR submitInput(const int controller_id, const XUSB_REPORT controller_report);
		bool connectController();
		bool disconnectController(const int controller_id);	
		ThumbstickPosition getThumbstickPosition(const int controller_id);
		void setThumbstickPosition(const int controller_id, ThumbstickPosition thumbstick_position);

	};

}


