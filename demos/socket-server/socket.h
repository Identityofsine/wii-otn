#include "virtualcontroller.h"
#include <nlohmann/json.hpp>
#include <vector>
#include <string>
#pragma comment(lib,"ws2_32.lib")


using json = nlohmann::json;

namespace SocketUtils {

	enum class RequestType {
		TYPE_MISSING = -1,
		TYPE_UNKNOWN,
		CONNECT,
		DISCONNECT,
		INPUT,
		PING
	};

	RequestType assignRequest(json request_json);
	short mapPercentageToShort(const short percentage);
}

namespace WIIOTN {

	struct ConnectedClient {
		SOCKET socket;
		SOCKADDR_IN address;
		bool is_connected;
		int id;
		int ping_count;
		long long last_ping;
	};

	class Socket{
		private:
			/* SOCKET SETTINGS */
			const int m_port;
			const char* m_ip;
			SOCKET m_socket;
			SOCKADDR_IN m_addr_settings;
			const int m_protocol;
			int m_max_ping_delay;
			long long m_last_ping = 0;
			/* */
			WIIOTN_VC::VirtualController m_virtual_controller;
			std::vector<ConnectedClient*> m_connected_clients;	
			WIIOTN::ConnectedClient clientFactory(sockaddr_in sender_address, int client_size);	
			void addClient(WIIOTN::ConnectedClient* client); 
			ConnectedClient* removeClient(WIIOTN::ConnectedClient client);
			ConnectedClient* removeClient(const int client_id);
			bool isClientConnected(const int client_id);
			int sendClient(WIIOTN::ConnectedClient client, const json message); 
			int pingClient(WIIOTN::ConnectedClient* client);
			bool handlePing(WIIOTN::ConnectedClient* client, const json buffer_json);
			bool handlePing(WIIOTN::ConnectedClient* client);	
			bool handleInput(WIIOTN::ConnectedClient* client, const json buffer_json);
			void pingClients();
			void sendSuccessPacket(WIIOTN::ConnectedClient* client);
			void sendPings();
			void handlePingPacket(WIIOTN::ConnectedClient* client);
			void sendDisconnectPacket(const json buffer_json);
			void sendDisconnectPacket(WIIOTN::ConnectedClient* client);
			
			

		public:
			Socket(const int port, const char* ip, const int protocol);
			~Socket();
			void start();	
	};	

	const std::vector<WIIOTN_VC::BindedKeys> handle_sinput(const int input_flags);
	bool isNew(json incoming_data);
	bool isValidResponse(json incoming_data);
	json connectionFactory(const int client_id, const bool is_new, const bool success);
	bool isTypeKeyPresent(json incoming_data);
	WIIOTN_VC::ThumbstickPosition getThumbStick(json incoming_data);

}
