cmake_minimum_required(VERSION 3.0)
project(VirtualGameController)

# Add your source files
add_executable(VirtualControllerDemo main.cpp)

# Specify the path to the pre-built ViGEmClient.dll
set(VIGEMCLIENT_DLL_PATH "C:/Users/leade/software/wii-otn/lib/ViGEmClient/VigemClient.lib")

# Link your executable to the pre-built ViGEmClient.dll
target_link_libraries(VirtualControllerDemo PRIVATE ${VIGEMCLIENT_DLL_PATH})

# Specify the directory where CMake should look for the DLL at runtime
set_target_properties(VirtualControllerDemo PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
)
