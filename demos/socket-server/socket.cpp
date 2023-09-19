#include "socket.h"
#include <nlohmann/json.hpp>
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
		printf("Receiving data...\n");
		buffer[bytes_received] = '\0';
	
		//parse json
		json buffer_json = json::parse(buffer);

		//check if json parsed without error
		if(buffer_json.is_discarded()) {
			printf("Error parsing json\n");
			break;
		}

		//print buffer_json
		printf("Message:%s", buffer_json.dump().c_str());

		//push into vector
		WIIOTN::ConnectedClient client = {};
		client.id = clients_size; 
		client.socket = m_socket;
		client.address = sender_address;
		client.is_connected = true;


		bool has_new_key = buffer_json.contains("new");
		bool is_new = false;	
		if(has_new_key) {
			has_new_key = buffer_json["new"].get<bool>();
			for(const auto &client : m_connected_clients) {
				if(client.address.sin_addr.s_addr == sender_address.sin_addr.s_addr) {
					printf("User Already Connected\n");
					is_new = false;
					json message = {
						{"message", "User Already Connected"},
						{"id", client.id},
						{"already_connected", true},
						{"success", true}
					};
					sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&sender_address, sizeof(sender_address));
					break;
				}
			}
		}

		//add into vector
		if(clients_size == 0 || is_new) {
			m_connected_clients.push_back(client);
			printf("\nNew client connected\n");
			//send message to client that their connection was successful
			json message = {
				{"message", "Connection Successful"},
				{"id", client.id},
				{"already_connected", true},
				{"success", true}
			};
			sendto(m_socket, message.dump().c_str(), message.dump().length(), 0, (struct sockaddr*)&sender_address, sizeof(sender_address));
		}
		else {
			for(const auto &client : m_connected_clients) {
				if(client.address.sin_addr.s_addr == sender_address.sin_addr.s_addr) {
					printf("Client already connected\n");
					if (buffer_json.contains("buttons_pressed")) {
					  const auto keys_pressed = handle_sinput(buffer_json["buttons_pressed"].get<int>());	
					  const auto controller_report = m_virtual_controller.controllerReportFactory(keys_pressed);
					  m_virtual_controller.submitInput(controller_report);
					}
					else {
					  m_virtual_controller.submitInput(m_virtual_controller.controllerReportFactory(WIIOTN_VC::BindedKeys::BREAK));
					}

					break;
				}
				else
					m_connected_clients.push_back(client);
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
