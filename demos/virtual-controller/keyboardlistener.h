#include <stdio.h>
#include <vector>
#include "virtualcontroller.h"

namespace WIIOTN_KEYBOARD {
	
	class KeyboardListener {
		private:
			bool running;
				

		public:
			KeyboardListener();
			~KeyboardListener();
			void run(WIIOTN_VC::VirtualController *controller, const int input_delay = 1000);
			std::vector<WIIOTN_VC::BindedKeys> getPressedKeys();
	};

}
