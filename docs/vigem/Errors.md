`VIGEM_ERROR` : Values that represent ViGEm errors

```cpp
		//
		// API succeeded.
		// 
		VIGEM_ERROR_NONE = 0x20000000,
		//
		// A compatible bus driver wasn't found on the system.
		// 
		VIGEM_ERROR_BUS_NOT_FOUND = 0xE0000001,
		//
		// All device slots are occupied, no new device can be spawned.
		// 
		VIGEM_ERROR_NO_FREE_SLOT = 0xE0000002,
		VIGEM_ERROR_INVALID_TARGET = 0xE0000003,
		VIGEM_ERROR_REMOVAL_FAILED = 0xE0000004,
		//
		// An attempt has been made to plug in an already connected device.
		// 
		VIGEM_ERROR_ALREADY_CONNECTED = 0xE0000005,
		//
		// The target device is not initialized.
		// 
		VIGEM_ERROR_TARGET_UNINITIALIZED = 0xE0000006,
		//
		// The target device is not plugged in.
		// 
		VIGEM_ERROR_TARGET_NOT_PLUGGED_IN = 0xE0000007,
		//
		// It's been attempted to communicate with an incompatible driver version.
		// 
		VIGEM_ERROR_BUS_VERSION_MISMATCH = 0xE0000008,
		//
		// Bus driver found but failed to open a handle.
		// 
		VIGEM_ERROR_BUS_ACCESS_FAILED = 0xE0000009,
		VIGEM_ERROR_CALLBACK_ALREADY_REGISTERED = 0xE0000010,
		VIGEM_ERROR_CALLBACK_NOT_FOUND = 0xE0000011,
		VIGEM_ERROR_BUS_ALREADY_CONNECTED = 0xE0000012,
		VIGEM_ERROR_BUS_INVALID_HANDLE = 0xE0000013,
		VIGEM_ERROR_XUSB_USERINDEX_OUT_OF_RANGE = 0xE0000014,
		VIGEM_ERROR_INVALID_PARAMETER = 0xE0000015,
		//
		// The API is not supported by the driver.
		// 
		VIGEM_ERROR_NOT_SUPPORTED = 0xE0000016,
		//
		// An unexpected Win32 API error occurred. Call GetLastError() for details.
		// 
		VIGEM_ERROR_WINAPI = 0xE0000017,
		//
		// The specified timeout has been reached.
		// 
		VIGEM_ERROR_TIMED_OUT = 0xE0000018,
		VIGEM_ERROR_IS_DISPOSING = 0xE0000019,
```