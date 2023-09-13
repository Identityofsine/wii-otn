
>The `ViGEmClient` provides a small library exposing a simple API for creating and "feeding" (periodically updating it with new input data) virtual game controllers through [`ViGEmBus`](https://github.com/nefarius/ViGEmBus)

[ViGEmBus](https://github.com/nefarius/ViGEmBus)

[ViGEmClient](https://github.com/nefarius/ViGEmClient)

### Basic API Header Calls

```c
// The ViGEm API
//
#include <ViGEm/Client.h>

//
// Link against SetupAPI
//
#pragma comment(lib, "setupapi.lib")
```


To start our journey, we need to initialize the API call : `vigem_alloc` which gives you an opaque handle to the underlying `vigemBUS` driver :

```cpp
//client --> vigem_alloc()
const auto client = vigem_alloc();

//failure to launch (not enough memory?)
if (client == nullptr)
{
	std::cerr << "Uh, not enough memory to do that?!" << std::endl;
    return -1;
} else {
	std::cout << "Hello délicieux ram!" << std::endl;	
	//...
}

```

Now that we have `client` ready to go, we can connect to our driver! 

```cpp
const auto retval = vigem_connect(client);
//retval is our handle to our driver!

if (!VIGEM_SUCCESS(retval))
{
    std::cerr << "ViGEm Bus connection failed with error code: 0x" << std::hex << retval << std::endl;
    return -1;
}
```

With this handle, `retval`, we're prepared to spawn (connect) and feed (supply with periodic input updates) one or many emulated controller devices. So let's spawn an Xbox 360 controller!

```cpp
//
// Allocate handle to identify new pad
const auto pad = vigem_target_x360_alloc();

// pad only exists in memory for now, we need to let our handle know about 'pad'

// Add client to the bus, this equals a plug-in event
const auto pir = vigem_target_add(client, pad);

//
// Error handling
if (!VIGEM_SUCCESS(pir))
{
    std::cerr << "Target plugin failed with error code: 0x" << std::hex << pir << std::endl;
    return -1;
}
```

For this example, lets create a program that acts as a unnecessary middle man between a real X360 Controller.

First let us import `XInput.h`:
```cpp
#include <Xinput.h>
```

Our code would look like : 
```cpp
// Grab the input from a physical X36ß pad in this example
XInputGetState(0, &state);

//
// The XINPUT_GAMEPAD structure is identical to the XUSB_REPORT structure
// so we can simply take it "as-is" and cast it.
//
// Call this function on every input state change e.g. in a loop polling
// another joystick or network device or thermometer or... you get the idea.
//
vigem_target_x360_update(client, pad, *reinterpret_cast<XUSB_REPORT*>(&state.Gamepad));

//
// We're done with this pad, free resources (this disconnects the virtual device)
//
vigem_target_remove(client, pad);
vigem_target_free(pad);

```

Once we are done with using `vigem`, we can then start ending our business with `vigem` and our handler

```cpp
//disconnects application from vigem
vigem_disconnect(client);
vigem_free(client);
```