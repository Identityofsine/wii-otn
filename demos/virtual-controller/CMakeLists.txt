cmake_minimum_required(VERSION 3.0)
set(CMAKE_SYSTEM_VERSION 10.0.0)
project(VirtualGameController)

#ccls necessary
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Add your source files
add_executable(VirtualControllerDemo main.cpp virtualcontroller.h virtualcontroller.cpp keyboardlistener.h keyboardlistener.cpp)

# Specify the path to the pre-built ViGEmClient.lib
set(VIGEMCLIENT_DLL_PATH "C:/Users/leade/software/wii-otn/lib/ViGEmClient/ViGEmClient.lib")
set(VIGEMCLIENT_INCLUDE_DIR "C:/Users/leade/software/wii-otn/lib/ViGEmClient/include")
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
