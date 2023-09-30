
# Minimum required CMake version
cmake_minimum_required(VERSION 3.0)

# Project name
project(KernelDriver)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4 /WX")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} /W4 /WX")
set(WDK_INCLUDE_DIRS "C:/Program Files (x86)/Windows Kits/10/Include/10.0.22621.0/km")

#set include directories
include_directories(${WDK_INCLUDE_DIRS})

# Include the FindWDK module
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake"})
find_package(WDK REQUIRED)
# set WDK_ROOT

# print if wdK_found
message(STATUS "WDK_FOUND: ${WDK_FOUND}")
message(STATUS "WDK_ROOT: ${WDK_ROOT}")

# Define your driver project
wdk_add_driver(KernelDriver
    KMDF 1.15
		Driver.cpp
)


# Additional project-specific configuration can go here

# Optional: Set the output directory for the driver
set_target_properties(KernelDriver PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")

# Optional: Copy the driver to the output directory after build
add_custom_command(TARGET KernelDriver POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different "$<TARGET_FILE:KernelDriver>" "${CMAKE_BINARY_DIR}/bin"
)

