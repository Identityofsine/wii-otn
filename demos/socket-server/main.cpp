#include "socket.h"

#define DEFAULT_PORT 1337

//args 
int main(int argc, char** argv) {
	
	const char* ipAddress = "127.0.0.1";

	//ip address arg
	if (argc > 1) {
    // Check if an IP address argument is provided
    ipAddress = argv[1];   
	}

	printf("Starting Socket Server on %s:1337\n", ipAddress);

	WIIOTN::Socket socket(DEFAULT_PORT, ipAddress, SOCK_DGRAM);
	socket.start();
	return 0;
}
