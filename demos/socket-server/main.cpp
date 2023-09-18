#include <stdio.h>
#include <ws2tcpip.h>
#include <WinSock2.h>
#pragma comment(lib,"ws2_32.lib")

#define DEFAULT_PORT 1337

int main() {

	WSADATA wsaData;

	// Initialize WinSock2
	if(WSAStartup(MAKEWORD(2,2),&wsaData) != 0) {
		printf("WSAStartup failed --- error: %d\n", WSAGetLastError());
		WSACleanup();
		return 1;
	}

	// Create a socket
	SOCKET serverSocket = socket(AF_INET, SOCK_DGRAM, 0);
	if(serverSocket == INVALID_SOCKET) {
		printf("Create socket failed --- error: %d\n", WSAGetLastError());
		WSACleanup();
		return 1;
	}

	//socket settings
	sockaddr_in socket_address;
	socket_address.sin_family = AF_INET;
	socket_address.sin_port = htons(1337);
	socket_address.sin_addr.s_addr = INADDR_ANY;

	//bind socket
	const int bind_response = bind(serverSocket, (sockaddr*)&socket_address, sizeof(socket_address));
	
	if(bind_response == SOCKET_ERROR) {
		printf("Bind failed --- error: %d\n", WSAGetLastError());
		closesocket(serverSocket);
		WSACleanup();
		return 1;
	}
	

	return 0;
}
