cmake_minimum_required(VERSION 3.12)  
set(CMAKE_SYSTEM_VERSION 10.0.0)

project(socket-server-demo)
# Add the executable target
add_executable(socket-server-demo main.cpp socket.h socket.cpp virtualcontroller.h virtualcontroller.cpp includes.h)

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

set(NLOHMAN_JSON_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/../../lib/nlohman_json")

# Link your executable to the pre-built ViGEmClient.lib
target_link_libraries(socket-server-demo ${VIGEMCLIENT_DLL_PATH})
target_link_libraries(socket-server-demo ${_SETUP_API})


# Specify the path to the headers of the ViGEmClient library
target_include_directories(socket-server-demo PUBLIC ${VIGEMCLIENT_INCLUDE_DIR})

target_include_directories(socket-server-demo PUBLIC ${NLOHMAN_JSON_INCLUDE_DIR})

# Specify the directory where CMake should look for the DLL at runtime
set_target_properties(socket-server-demo PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
)

