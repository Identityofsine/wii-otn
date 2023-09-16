cmake_minimum_required(VERSION 3.0)
set(CMAKE_SYSTEM_VERSION 10.0.0)
project(VirtualGameController)

#ccls necessary
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Add your source files
add_executable(VirtualControllerDemo main.cpp virtualcontroller.h virtualcontroller.cpp keyboardlistener.h keyboardlistener.cpp)

#ARM64 support
if(CMAKE_SYSTEM_PROCESSOR STREQUAL "ARM64")
    set(ARM64_BUILD TRUE)
else()
    set(ARM64_BUILD FALSE)
endif()

message(STATUS "CPU ARCH: ${CMAKE_SYSTEM_PROCESSOR}")

if (ARM64_BUILD)

	# Specify the path to the pre-built ARM64 ViGEmClient.lib
	set(VIGEMCLIENT_DLL_PATH "${CMAKE_SOURCE_DIR}/../../lib/ViGEmClient/ARM64/ViGEmClient.lib")
	message(STATUS "ARM64: ViGEmClient.dll path: ${VIGEMCLIENT_DLL_PATH}")

else ()
	# Specify the path to the pre-built ViGEmClient.lib
	set(VIGEMCLIENT_DLL_PATH "${CMAKE_SOURCE_DIR}/../../lib/ViGEmClient/ViGEmClient.lib")
	message(STATUS "x86: ViGEmClient.dll path: ${VIGEMCLIENT_DLL_PATH}")
endif()

set(VIGEMCLIENT_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/../../lib/ViGEmClient/include")
set(_SETUP_API "setupapi.lib")

# Link your executable to the pre-built ViGEmClient.lib
target_link_libraries(VirtualControllerDemo ${VIGEMCLIENT_DLL_PATH})
target_link_libraries(VirtualControllerDemo ${_SETUP_API})

# Specify the path to the headers of the ViGEmClient library
target_include_directories(VirtualControllerDemo PUBLIC ${VIGEMCLIENT_INCLUDE_DIR})


# Specify the directory where CMake should look for the DLL at runtime
set_target_properties(VirtualControllerDemo PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
)
