#include "socket.h"

#define DEFAULT_PORT 1337

int main() {
	//udp connection listening on port 1337 on 127.0.0.1
	WIIOTN::Socket socket(DEFAULT_PORT, "127.0.0.1", SOCK_DGRAM);
	socket.start();
	return 0;
}
