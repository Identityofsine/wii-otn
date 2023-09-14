#include <stdio.h>
#include "virtualcontroller.h"

namespace WIIOTN_KEYBOARD {
	
	class KeyboardListener {
		private:
			bool running;
				

		public:
			KeyboardListener();
			~KeyboardListener();
			void run(WIIOTN_VC::VirtualController *controller);
	};

}
