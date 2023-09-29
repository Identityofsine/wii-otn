cmake_minimum_required(VERSION 3.15)

project(Kernel)

# Specify the minimum version of Visual Studio and the Windows SDK required
set(CMAKE_SYSTEM_VERSION 10.0.18362.0)
set(CMAKE_GENERATOR_PLATFORM x64)

# Define the source files for your driver
set(DRIVER_SOURCE_FILES
    Driver.cpp
    Driver.h
)

# Remove the /MANIFEST option
string(REPLACE "/MANIFEST" "" CMAKE_EXE_LINKER_FLAGS ${CMAKE_EXE_LINKER_FLAGS})
string(REPLACE "/MANIFEST" "" CMAKE_SHARED_LINKER_FLAGS ${CMAKE_SHARED_LINKER_FLAGS})
string(REPLACE "/MANIFEST" "" CMAKE_MODULE_LINKER_FLAGS ${CMAKE_MODULE_LINKER_FLAGS})

string(REPLACE "/GR" "" CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS})

# Define the driver project
add_library(${PROJECT_NAME} SHARED ${DRIVER_SOURCE_FILES})

# Set driver-specific compiler and linker options
target_compile_options(${PROJECT_NAME} PRIVATE /kernel)
target_link_options(${PROJECT_NAME} PRIVATE /DRIVER)

# Specify include directories (e.g., WDK include directory)
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    "C:/Program Files (x86)/Windows Kits/10/Include/${CMAKE_SYSTEM_VERSION}/km"
)

# Specify the Windows Driver Kit libraries
target_link_libraries(${PROJECT_NAME} PRIVATE
    "C:/Program Files (x86)/Windows Kits/10/Lib/${CMAKE_SYSTEM_VERSION}/km/x64/wdf01000.lib"
)

# Set the driver properties and output file
set_target_properties(${PROJECT_NAME} PROPERTIES
    OUTPUT_NAME "${PROJECT_NAME}"
    SUFFIX ".sys"
)

# Copy the driver to the output directory
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy "$<TARGET_FILE:${PROJECT_NAME}>" "${CMAKE_BINARY_DIR}"
)

# Additional setup for driver signing, deployment, and installation goes here
# You may need to create an INF file and use tools like "Inf2Cat" and "signtool" to sign and install your driver.

