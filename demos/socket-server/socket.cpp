#include "socket.h"
#include <nlohmann/json.hpp>
#include <stdio.h>
#include <chrono>

using RequestType = SocketUtils::RequestType;
using namespace SocketUtils;

WIIOTN::Socket::Socket(const int port, const char* ip, const int protocol) : m_port(port), m_ip(ip), m_protocol(protocol) {
	WSADATA wsaData;
	// Initialize WinSock2
	if(WSAStartup(MAKEWORD(2,2),&wsaData) != 0) {
		printf("WSAStartup failed --- error: %d\n", WSAGetLastError());
		WSACleanup();
	}
	// Create a socket
	m_socket = socket(AF_INET, SOCK_DGRAM, 0);
	if(m_socket == INVALID_SOCKET) {
		printf("Create socket failed --- error: %d\n", WSAGetLastError());
		WSACleanup();
	}
	//socket settings
	m_addr_settings.sin_family = AF_INET;
	m_addr_settings.sin_port = htons(m_port);
	m_addr_settings.sin_addr.s_addr = inet_addr(m_ip);
}

WIIOTN::Socket::~Socket() {
	closesocket(m_socket);
	WSACleanup();
}

using json = nlohmann::json;

void WIIOTN::Socket::t_ping_loop() {
	while(1) {
		this->sendPings();
	}
}

void WIIOTN::Socket::t_main_loop() {
	while(1) {
		int bytes_received;
		char buffer[1025];
		int buffer_length = 1024;
		struct sockaddr_in sender_address;
		int sender_address_size = sizeof(sender_address);
		const int clients_size = (int)m_connected_clients.size();

		bytes_received = recvfrom(m_socket, buffer, buffer_length, 0, (struct sockaddr*)&sender_address, &sender_address_size);
		if(bytes_received == SOCKET_ERROR) {
			printf("recvfrom failed --- user most likely crashed -- error: %d\n", WSAGetLastError());
			continue;
		}
		buffer[bytes_received] = '\0';
	
		//parse json
		json buffer_json = json::parse(buffer);

		//check if json parsed without error
		if(buffer_json.is_discarded()) {
			printf("Error parsing json\n");
			continue;
		}

		RequestType request_type = assignRequest(buffer_json);
		/* Check if connection type is disconnect */
		if(request_type == RequestType::DISCONNECT) {
			this->sendDisconnectPacket(buffer_json);
			continue;
		}


		WIIOTN::ConnectedClient client;


		bool is_new = isNew(buffer_json);	
		int client_id = clients_size;
		if(buffer_json.contains("id")) {
		  client_id = buffer_json["id"].get<int>();
		  client = this->clientFactory(sender_address, client_id);
		} 
		else 
		  client = this->clientFactory(sender_address, clients_size);

		if(clients_size == 0 || is_new) {
			//m_connected_clients.push_back(client);
			//m_virtual_controller.connectController();
			this->addClient(&client);
			printf("\nNew client connected, id: %d, ip:%s\n", client.id, inet_ntoa(client.address.sin_addr));
			json message = connectionFactory(client.id, is_new, true);
			this->sendClient(client, message);
		}
		else {
			for(ConnectedClient *client : m_connected_clients) {
				if(client->id == client_id) {
					//check if client is pinging server
					this->handlePingPacket(client);
					this->handleInput(client, buffer_json);
					this->sendSuccessPacket(client);
					break;
				}
				//printf("ID : %d, IP : %s\n", client->id, inet_ntoa(client->address.sin_addr));
			}
		}	
	}
}

void WIIOTN::Socket::start() {
	//bind socket
	const int bind_response = bind(m_socket, (sockaddr*)&m_addr_settings, sizeof(m_addr_settings));
	this->m_max_ping_delay = 1000; //nanoseconds
	this->m_client_ping_disconnect = 5;
	if(bind_response == SOCKET_ERROR) {
		printf("Bind failed --- error: %d\n", WSAGetLastError());
		closesocket(m_socket);
		WSACleanup();
	}
	t_ping_thread = std::thread(&WIIOTN::Socket::t_ping_loop, this);
	t_main_thread = std::thread(&WIIOTN::Socket::t_main_loop, this);
	//udp server
	while(1) {
	}
}


void WIIOTN::Socket::pingClients() {
	for(ConnectedClient *client : m_connected_clients) {
		if(client->is_connected) {
			if(this->pingClient(client) == SOCKET_ERROR) {
				printf("Client disconnected, id: %d\n", client->id);
				this->removeClient(client->id);
			} else if(client->ping_count < m_client_ping_disconnect){
				printf("Client pinged, id: %d, ping_count:%d\n", client->id, client->ping_count);
				client->ping_count++;
			} else {
				printf("Client disconnected, id: %d\n", client->id);
				this->sendDisconnectPacket(client);
				this->removeClient(client->id);
			}
		}
	}
}

void WIIOTN::Socket::sendSuccessPacket(WIIOTN::ConnectedClient* client) {
	json message = {
		{"type", "success"},
		{"id", client->id},
		{"success", true},
	};
	sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&client->address, sizeof(client->address));
}

bool WIIOTN::Socket::handleInput(WIIOTN::ConnectedClient* client, const json buffer_json) {
	this->handlePing(client);
	
	std::vector<WIIOTN_VC::BindedKeys> key_pressed = {};
	WIIOTN_VC::ThumbstickPosition joystick_position = m_virtual_controller.getThumbstickPosition(client->id);	
	if(buffer_json.contains("axis")) {
		joystick_position = getThumbStick(buffer_json["axis"]);
	}
	if(buffer_json.contains("buttons_pressed")) {
		key_pressed = handle_sinput(buffer_json["buttons_pressed"].get<int>());
	}
	m_virtual_controller.setThumbstickPosition(client->id, joystick_position);
	const auto controller_report = m_virtual_controller.controllerReportFactory(key_pressed, joystick_position);

	try {
		m_virtual_controller.submitInput(client->id, controller_report);
		return true;
	} catch (const std::exception& e) {
		printf("[ERROR] Error: %s[Socket::handleInput]\n", e.what());
		return false;
	}
	return false;
}

const std::vector<WIIOTN_VC::BindedKeys> WIIOTN::handle_sinput(const int input_flags) {
	//binary flag operations to check which keys are pressed	
	/*
	* 00000000 - nothing pressed
	* 00000001 - A
	* 00000010 - B
	* 00000011 - X
	* 00000100 - Y
	* 00000101 - DPAD UP
	* 00000110 - DPAD DOWN
	* 00000111 - DPAD LEFT
	* 00001000 - DPAD RIGHT
	* 00001001 - PLUS
	* 00001010 - MINUS
	*/
	std::vector<WIIOTN_VC::BindedKeys> keys_pressed;
	if (input_flags & 0x0001)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::A);

	if (input_flags & 0x0002)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::B);

	if (input_flags & 0x0004)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::X);

	if (input_flags & 0x0008)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::Y);

	if (input_flags & 0x0010)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_UP);

	if (input_flags & 0x0020)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_DOWN);

	if (input_flags & 0x0040)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_LEFT);

	if (input_flags & 0x0080)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_RIGHT);

	if (input_flags & 0x0100)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::START);

	if (input_flags & 0x0200)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::BACK);

	if (input_flags & 0x0400)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::LB);

	if (input_flags & 0x0800)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::RB);

	if (input_flags & 0x1000)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::LTD);

	if (input_flags & 0x2000)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::RTD);

	if (input_flags & 0x4000)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::HOME);

	if (input_flags & 0x8000)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::LT);

	if (input_flags & 0x10000)
		keys_pressed.push_back(WIIOTN_VC::BindedKeys::RT);

	//for (const auto &key : keys_pressed)
		//printf("Key pressed: %d\n", key);

	return keys_pressed;
}

WIIOTN::ConnectedClient WIIOTN::Socket::clientFactory(const sockaddr_in address, const int id) {
	WIIOTN::ConnectedClient client = {};
	client.id = id;
	client.socket = m_socket;
	client.address = address;
	client.is_connected = true;
	return client;
}

void WIIOTN::Socket::addClient(WIIOTN::ConnectedClient* client) {
	client->id = (int)m_connected_clients.size();
	m_connected_clients.push_back(client);
	m_virtual_controller.connectController();
}

WIIOTN::ConnectedClient* WIIOTN::Socket::removeClient(WIIOTN::ConnectedClient client) {
	WIIOTN::ConnectedClient* removed_client = nullptr;
	for(auto i_client = m_connected_clients.begin(); i_client != m_connected_clients.end(); i_client++) {
		removed_client = m_connected_clients[i_client - m_connected_clients.begin()];
		if(removed_client->id == client.id) {
			m_connected_clients.erase(i_client);
			break;
		}
	}
	return removed_client;
}

WIIOTN::ConnectedClient* WIIOTN::Socket::removeClient(const int client_id) {
	WIIOTN::ConnectedClient* removed_client = nullptr;
	for(auto i_client = m_connected_clients.begin(); i_client != m_connected_clients.end(); i_client++) {
		removed_client = m_connected_clients[i_client - m_connected_clients.begin()];
		if(removed_client->id == client_id) {
			m_connected_clients[i_client - m_connected_clients.begin()]->is_connected = false;
			m_connected_clients.erase(i_client);
			//remove controller
			m_virtual_controller.disconnectController(client_id);
			break;
		}
	}
	return removed_client;
}

bool WIIOTN::Socket::isClientConnected(const int client_id) {
	for(auto i_client = m_connected_clients.begin(); i_client != m_connected_clients.end(); i_client++) {
		if(m_connected_clients[i_client - m_connected_clients.begin()]->id == client_id) {
			return m_connected_clients[i_client - m_connected_clients.begin()]->is_connected;
		}
	}
	return false;
}

int WIIOTN::Socket::sendClient(const WIIOTN::ConnectedClient client, const json message) {
	return sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&client.address, sizeof(client.address));
}

int WIIOTN::Socket::pingClient(WIIOTN::ConnectedClient* client) {
	json message = {
		{"type", "ping"},
		{"message", "ping"},
		{"id", client->id},
		{"success", true}
	};
	return sendClient(*client, message);
}

bool WIIOTN::Socket::handlePing(WIIOTN::ConnectedClient* client, const json buffer_json) {
	bool has_ping_key = buffer_json.contains("ping");
	bool is_ping = false;
	if(has_ping_key) is_ping = buffer_json["ping"].get<bool>();
	if(is_ping) {
		client->ping_count = 0;
		return true;
	}
	return false;
};


bool WIIOTN::Socket::handlePing(WIIOTN::ConnectedClient* client) {
	return true;
}

void WIIOTN::Socket::sendPings() {
	//send a ping every 10 seconds
	const unsigned long miliseconds = std::chrono::system_clock::now().time_since_epoch() / std::chrono::milliseconds(1);
	if(miliseconds - this->m_last_ping > this->m_max_ping_delay) {
		this->pingClients();
		this->m_last_ping = miliseconds;
	}
}

void WIIOTN::Socket::sendDisconnectPacket(const json buffer_json) {
	if(!buffer_json.contains("id")) return;
	const int client_id = buffer_json["id"].get<int>();
	bool is_present = this->isClientConnected(client_id);	
	if(!is_present) return;
	printf("Client disconnected, id: %d\n", buffer_json["id"].get<int>());
	json message = {
		{"type", "disconnect"},
		{"id", client_id},
		{"success", true},
	};
	this->sendClient(*this->removeClient(client_id), message);
}

void WIIOTN::Socket::sendDisconnectPacket(WIIOTN::ConnectedClient* client) {
	const int client_id = client->id;
	bool is_present = this->isClientConnected(client_id);	
	if(!is_present) return;
	printf("Client disconnected, id: %d\n", client_id);
	json message = {
		{"type", "disconnect"},
		{"id", client_id},
		{"success", true},
	};
	this->sendClient(*this->removeClient(client_id), message);
}

//this function is only ran when the client responds with a message type of 'ping'
void WIIOTN::Socket::handlePingPacket(WIIOTN::ConnectedClient* client) {
	client->ping_count = 0;
	client->last_ping = std::chrono::system_clock::now().time_since_epoch().count();
}

bool WIIOTN::isNew(json incoming_data) {
	bool has_new_key = incoming_data.contains("new");
	bool is_new = false;
	if(has_new_key) is_new = incoming_data["new"].get<bool>();
	return is_new;
}

bool WIIOTN::isTypeKeyPresent(json buffer_json) {
	bool has_type_key = buffer_json.contains("type");
	bool is_type = false;
	if(has_type_key) is_type = buffer_json["type"].get<std::string>() == "input";
	return is_type;
}

json WIIOTN::connectionFactory(const int client_id, const bool is_new, const bool success) {
	json message = {
		{"type", "connection"},
		{"message", "Connection Successful"},
		{"id", client_id},
		{"already_connected", is_new},
		{"success", success}
	};
	return message;
}

WIIOTN_VC::ThumbstickPosition WIIOTN::getThumbStick(json incoming_data) {
	
	short l_joystick_x = 0;
	short l_joystick_y = 0;
	short r_joystick_x = 0;
	short r_joystick_y = 0;

	if(incoming_data.contains("l_joystick_x")) l_joystick_x = incoming_data["l_joystick_x"]["m_value"].get<short>();
	if(incoming_data.contains("l_joystick_y")) l_joystick_y = incoming_data["l_joystick_y"]["m_value"].get<short>();
	if(incoming_data.contains("r_joystick_x")) r_joystick_x = incoming_data["r_joystick_x"]["m_value"].get<short>();
	if(incoming_data.contains("r_joystick_y")) r_joystick_y = incoming_data["r_joystick_y"]["m_value"].get<short>();

	WIIOTN_VC::ThumbstickPosition thumbstick_position = {	
		l_joystick_x,
		l_joystick_y,
		r_joystick_x,
		r_joystick_y
	};
	return thumbstick_position;
}



namespace SocketUtils {

	RequestType assignRequest(const json buffer_json) {
		if(buffer_json.contains("type")) {
			std::string type = buffer_json["type"].get<std::string>();
			if(type == "disconnect") return RequestType::DISCONNECT;
			if(type == "input") return RequestType::INPUT;
			if(type == "connection") return RequestType::CONNECT;
			if(type == "ping") return RequestType::PING;
		}
		return RequestType::TYPE_UNKNOWN;
	} 

	short mapPercentageToShort(const short percentage) {
		short new_value = percentage;	

    short result = static_cast<short>(new_value * 32767);
	
    return result;
}
	
}
