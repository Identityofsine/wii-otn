#include "socket.h"
#include <stdio.h>

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

void WIIOTN::Socket::start() {
	//bind socket
	const int bind_response = bind(m_socket, (sockaddr*)&m_addr_settings, sizeof(m_addr_settings));
	if(bind_response == SOCKET_ERROR) {
		printf("Bind failed --- error: %d\n", WSAGetLastError());
		closesocket(m_socket);
		WSACleanup();
	}
	//udp server
	while(1) {
		int bytes_received;
		char buffer[1025];
		int buffer_length = 1024;
		struct sockaddr_in sender_address;
		int sender_address_size = sizeof(sender_address);

		const int clients_size = (int)m_connected_clients.size();



		bytes_received = recvfrom(m_socket, buffer, buffer_length, 0, (struct sockaddr*)&sender_address, &sender_address_size);
		if(bytes_received == SOCKET_ERROR) {
			printf("recvfrom failed --- error: %d\n", WSAGetLastError());
			break;
		}
		buffer[bytes_received] = '\0';
	
		//parse json
		json buffer_json = json::parse(buffer);

		//check if json parsed without error
		if(buffer_json.is_discarded()) {
			printf("Error parsing json\n");
			break;
		}
		//printf("Message:%s", buffer_json.dump().c_str());

		/*
		WIIOTN::ConnectedClient client = {};
		client.id = clients_size; 
		client.socket = m_socket;
		client.address = sender_address;
		client.is_connected = true;
		*/
		const auto client = this->clientFactory(sender_address, clients_size);

		/*
		bool has_new_key = buffer_json.contains("new");
		bool is_new = false;
		if(has_new_key) is_new = buffer_json["new"].get<bool>();
		*/
		bool is_new = isNew(client, buffer_json);	
		int client_id = client.id;
		if(buffer_json.contains("id")) client_id = buffer_json["id"].get<int>();

		/*
		if(has_new_key) {
			is_new = buffer_json["new"].get<bool>();
			for(const auto &i_client : m_connected_clients) {
				if(client.address.sin_addr.s_addr == sender_address.sin_addr.s_addr) {
					printf("User Already Connected, address : %s");
					is_new = false;
					json message = {
						{"type", "connection"},
						{"message", "User Already Connected"},
						{"id", i_client.id},
						{"already_connected", true},
						{"success", true}
					};
					sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&sender_address, sizeof(sender_address));
					break;
				}
			}
		}
		*/

		//add into vector
		if(clients_size == 0 || is_new) {
			//m_connected_clients.push_back(client);
			//m_virtual_controller.connectController();
			this->addClient(client);
			printf("\nNew client connected, id: %d\n", client.id);

			//send message to client that their connection was successful
			/*
			json message = {
				{"type", "connection"},
				{"message", "Connection Successful"},
				{"id", client.id},
				{"already_connected", true},
				{"success", true}
			};
			*/
			json message = connectionFactory(client.id, is_new, true);

			sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&sender_address, sizeof(sender_address));
		}
		else {
			for(const auto &client : m_connected_clients) {
				if(client.id == client_id) {
					printf("\nClient already connected\n");
					if (buffer_json.contains("buttons_pressed")) {
					  const auto keys_pressed = handle_sinput(buffer_json["buttons_pressed"].get<int>());	
					  const auto controller_report = m_virtual_controller.controllerReportFactory(keys_pressed);
					  m_virtual_controller.submitInput(client.id, controller_report);
						printf("ID : %d, used controller\n", client.id);
					}
					else {
					  m_virtual_controller.submitInput(client.id, m_virtual_controller.controllerReportFactory(WIIOTN_VC::BindedKeys::BREAK));
					}

					break;
				}
				printf("ID : %d, IP : %s\n", client.id, inet_ntoa(client.address.sin_addr));
			}
		}
	}
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
	if (input_flags & 0b00000001)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::A);

	if (input_flags & 0b00000010)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::B);

	if (input_flags & 0b00000100)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::X);

	if (input_flags & 0b00001000)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::Y);

	if (input_flags & 0b00010000)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_UP);

	if (input_flags & 0b00100000)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_DOWN);

	if (input_flags & 0b01000000)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_LEFT);

	if (input_flags & 0b10000000)
    keys_pressed.push_back(WIIOTN_VC::BindedKeys::DPAD_RIGHT);

	for (const auto &key : keys_pressed)
		printf("Key pressed: %d\n", key);

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

void WIIOTN::Socket::addClient(WIIOTN::ConnectedClient client) {
	m_connected_clients.push_back(client);
	m_virtual_controller.connectController();
}

WIIOTN::ConnectedClient WIIOTN::Socket::removeClient(WIIOTN::ConnectedClient client) {
	for(auto i_client = m_connected_clients.begin(); i_client != m_connected_clients.end(); i_client++) {
		if(i_client->id == client.id) {
			m_connected_clients.erase(i_client);
			break;
		}
	}
	return client;
}

WIIOTN::ConnectedClient WIIOTN::Socket::removeClient(const int client_id) {
	for(auto i_client = m_connected_clients.begin(); i_client != m_connected_clients.end(); i_client++) {
		if(i_client->id == client_id) {
			m_connected_clients.erase(i_client);
			break;
		}
	}
	return clientFactory(sockaddr_in(), -1);
}

int WIIOTN::Socket::sendClient(const WIIOTN::ConnectedClient client, const json message) {
	return sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&client.address, sizeof(client.address));
}

int WIIOTN::Socket::pingClient(WIIOTN::ConnectedClient* client) {
	if(client->ping_count >= 5) {
		printf("Client %d disconnected\n", client->id);
		client->is_connected = false;
		client->ping_count = 0;
		return -1;
	}
	json message = {
		{"type", "ping"},
		{"message", "ping"},
		{"id", client->id},
		{"success", true}
	};
	client->ping_count += 1;
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

bool isNew(const WIIOTN::ConnectedClient client, const json buffer_json) {
	bool has_new_key = buffer_json.contains("new");
	bool is_new = false;
	if(has_new_key) is_new = buffer_json["new"].get<bool>();
	return is_new;
}
