
>**NOTE:** Make Sure You Have WDK Installed on your computer!

>**NOTE:** This Document Is Designed To Work With `CMake`

## Project Structure 

First let's setup our CMake Project under the guise of a Driver Project

- Create a Directory for our Project "KernelDriver"
- Create our CMake File

```CMake
cmake_minimum_required(VERSION 3.0)
project(KernelDriver)

set(CMAKE_CXX_STANDARD 17)

# Specify the source files for your driver
set(SOURCES
    Driver.c
)

# Add the Windows Driver Kit (WDK) include directories
include_directories(
    "$ENV{WDK_INC_PATH}"
)

# Add the Windows Driver Kit (WDK) libraries
link_directories(
    "$ENV{WDK_LIB_PATH}"
)

# Create the driver project
add_library(${PROJECT_NAME} SHARED ${SOURCES})

# Set the target properties
set_target_properties(${PROJECT_NAME} PROPERTIES
    PREFIX ""
    SUFFIX ".sys"
)

# Link the necessary libraries
target_link_libraries(${PROJECT_NAME}
    wdf01000.lib
)

# Set the driver properties
set(WDF_DRIVER_FLAGS "WdfDriverInitNonPnpDriver")

set(WDF_DRIVER_INCLUDEDIRS
    ${CMAKE_CURRENT_SOURCE_DIR}
)

set(WDF_DRIVER_SRCS
    ${SOURCES}
)

set(WDF_ADDITIONAL_DRIVER_FLAGS
    "-km:TestDriver.wdf"
)

include("$ENV{WDK_TEMPLATE_PATH}/Wdf/WdfDriver.cmake")
```

> This `CMakeLists.txt` file defines our Driver Project, specifies source files, and adds necessary WDK include Directories and Libraries.

## Driver.c

In our newly created folder, create a file (or `touch`) : `driver.c`

We are going to make a simple Hello World Application using drivers!

#### First, Our Includes.

```c
#include <ntdkk.h>
#include <wdf.h>
```

#### Second, Our Callbacks

```c
DRIVER_INITIALIZE DriverEntry;
EVT_WDF_DRIVER_DEVICE_ADD KM_HELLOWORLD_EVT_DEVICE_ADD; //we will define this later
```

#### Third, Let's Start With Our DriverEntry Function

```c++
NTSTATUS DriverEntry(
	_In_ PDRIVER_OBJECT DriverObject,
	_In_ PUNICODE_STRING RegistryPath
) {
	//Initialize driver configuration object
	WDF_DRIVER_CONFIG config;
	NTSTATUS status; //placeholder

	//Let's Scream Hello World from DriverEntry
	KdPrintEx(( DPFLTR_IHVDRIVER_ID, DPFLTR_INFO_LEVEL, "[DEBUG] HELLO WORLD [DriverEntry]\n"));
	WDF_DRIVER_CONFIG_INIT(&config, KM_HELLOWORLD_EVT_DEVICE_ADD); //we added this earlier in our callbacks
		
	// ... other init code that you choose to have
	status = WdfDriverCreate(DriverObject, RegistryPath, WDF_NO_OBJECT_ATTRIBUTES, &config, WDF_NO_HANDLE); //How did we go?
	return status;
}
```

The possible return types of status lie within `NTSTATUS`, a 32-bit number that is masked to represent [error codes](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55)

However for Windows Drivers, the range is much more concise 

|ENUM|Description|Range|
|------|------------|------|
|NT_SUCCESS|Evaluates to **TRUE** if the return value specified by *Status* is a success type `(0 - 0x3FFFFFFF)` or an informational type `(0x400000000 - 0x7FFFFFFF)`| (0 - 0x3FFFFFFF) && (0 - 0x40000000 - 0x7FFFFFFF)|
|NT_INFORMATION|Evaluates to **TRUE** if the return value specified by *Status* is an informational type `(0x40000000 - 0x7FFFFFFF)`| `(0x40000000 - 0x7FFFFFFF)`|
|NT_WARNING|Evaluates to **TRUE** if the return value specified by *Status* is a warning type|`(0x80000000 - 0xBFFFFFFF)`|
|NT_ERROR|Evaluates to **TRUE** if the return value specified by *Status* is an error type `(0xC0000000 - 0xFFFFFFFF)`| `(0x40000000 - 0x7FFFFFFF)`|

### Fourth, Let's Define Our Friend

Earlier we defined a `KM_HELLOWORLD_EVT_DEVICE_ADD` variable with no initialization; lets fix that.

```cpp
NTSTATUS KM_HELLOWORLD_EVT_DEVICE_ADD(
	_IN_ WDFDRIVER driver,
	_Inout_ PWDFDEVICE_INIT DeviceInit
) {

	//We aren't using hte driver object,
	//so we need to makr it as unreferenced
	UNREFERENCED_PARAMETER(Driver);
	NTSTATUS status; //placeholder for return

	//Allocate the device Object
	WDFDEVICE h_device; 
	
	//Print Hello World For Us
	KdPrintEx((DPFLTR_IHVDRIVER_ID, DPFLTR_INFO_LEVEL, "[DEBUG]Hello World![KM_HELLOWORLD_EVT_DEVICE_ADD]\n"));

	//... init data
	status = WdfDeviceCreate(&DeviceInit, WDF_NO_OBJECT_ATTRIBUTES, &hDevice);

	return status;
}
```