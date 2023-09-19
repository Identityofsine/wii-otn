#include "virtualcontroller.h"
#include <vector>
#pragma comment(lib,"ws2_32.lib")


namespace WIIOTN {


	struct ConnectedClient {
		SOCKET socket;
		SOCKADDR_IN address;
		bool is_connected;
		int id;
			
	};

	class Socket{
		private:
			const int m_port;
			const char* m_ip;
			SOCKET m_socket;
			SOCKADDR_IN m_addr_settings;
			const int m_protocol;
			WIIOTN_VC::VirtualController m_virtual_controller;
			std::vector<ConnectedClient> m_connected_clients;	
			
		public:
			Socket(const int port, const char* ip, const int protocol);
			~Socket();
			void start();	
	};	

	const std::vector<WIIOTN_VC::BindedKeys> handle_sinput(const int input_flags);
	
	

}
