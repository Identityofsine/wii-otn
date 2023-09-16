
The `winsock` (or `Windows Sockets`) is a library present in every install of Windows. 

`winsock` allows the developer to create networked applications, such as client-server applications, using sockets. 

### To Include the `WinSock` Library

```cpp
//include winsock
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib") // this contains winsock functions
```

`"ws2_32.lib"` contains the `winsock` functions necessary for the linker to work.

### To Initialize `WinSock`

Before you can use `WinSock` functions, its mandatory that you initialize the `WinSock` library. 

**This should be done at the beginning of the program and cleanup should be performed at the end.**

```cpp
WSADATA wsaData; 

if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
    // Handle error
}
```

`WSADATA` contains data and information about the `WinSock` implementation, the `WSAStartUP` function ***populates*** the `wsaData` variable with states and statuses of the Socket Implementation 

`WSAStartup` function initializes the `WinSock` Library. `MAKEWORD(2,2)` seemingly creates a word (`a unit of data that can be moved between the processor and storage.` 

**`(2,2)` represents the version of `WinSock` you want to use.**

### Creating a Socket

Considering `WSAStartup` didn't return `0` during its initialization, we can create a `socket` object

```c++
SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
if (serverSocket == INVALID_SOCKET) {
    // Handle error
}
```

`socket` returns a `socket descriptor` if successful but if it for some reason fails, it will return a value of `INVALID_SOCKET` (The error can be grabbed by running `WSAGetLastError();`)

`socket` takes in a *pre-defined* integer under the guise of the style of `Address Family` you want to listen to. In this example, and most use cases you will be using `AF_INET` which is traditional `IPV4` Internet.

The other types include : 
- `AF_INET6`: This address family represents IPv6 (Internet Protocol version 6) addresses. IPv6 addresses are 128-bit numerical addresses and are designed to eventually replace IPv4 due to the exhaustion of available IPv4 addresses.
- `AF_UNIX` or `AF_LOCAL`: These address families are used for local inter-process communication (IPC) within a single system. Sockets created with these address families do not use network protocols like IP; instead, they use file system paths for communication.
- `AF_NETBIOS`: This address family is used for NetBIOS communication, which is a protocol suite used in some older Windows networking environments.
- `AF_IRDA`: This address family is used for infrared communication.

`socket` also allows for a setting of **UDP** or **TCP**. This is the second argument and in this example we are using `SOCK_STREAM` or **TCP**. 

> To use **UDP**: instead of using `SOCK_STREAM`, we opt for `SOCK_DGRAM` instead.

Lastly, `socket` has a *protocol* option. This protocol seems not to be very useful (***DEPENDING ON THE ADDRESS TYPE \[ARG-1|]***)

### Binding the Socket

Now that are server is created and is ready to send and receive packets, we need to bind it to an IP Address.

> This is obviously specific to the *Address Type* you are using (i.e : **AF_INET**)

First we need to set up a `socket` structure 
```cpp
struct sockaddr_in severAddr; // a Socket Structure
serverAddr.sin_family = AF_INET; //Note that this equal to our Address Type we initialized in our socket.
serverAddr.sin_addr.s_addr = INADDR_ANY; // our address
serverAddr.sin_port = htons(8337); // our port number
```

The `socket` structure is a `type` that contains simple properties that help the developer to input settings.

To actually utilize these settings, we can use the `bind` function :

```cpp

const int bind_response = bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)); 


//typically you can save space for complexity by passing bind(...) directly into the if statement 
if(bind_response = SOCKET_ERROR) {
	//Handle any errors
}

```

`bind` simply does what it says. `bind` takes in our socket instance, a casted `sockaddr` (which comes from sockaddr_in) [^1], and the last argument, an int, is the size of `sockAddr`


[^1]: In this code, `(struct sockaddr*)&serverAddr` tells the `bind` function that it should treat `serverAddr` as a generic socket address structure. The `sizeof(serverAddr)` argument specifies the size of the `serverAddr` structure, which is important for socket functions to correctly handle the memory layout.

###