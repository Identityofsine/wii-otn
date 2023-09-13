project(ViGEmClient)

# Define the source files for the DLL
add_library(ViGEmClient SHARED
    vigemclient_source1.cpp
    vigemclient_source2.cpp
    # ... add more source files as needed
)

# Set any necessary include directories for your DLL
target_include_directories(ViGEmClient PRIVATE
    ${CMAKE_SOURCE_DIR}/include  # Include directories for header files
)

# Set any compiler flags or options for your DLL if needed
# target_compile_options(ViGEmClient PRIVATE ...)

# Link any necessary libraries to your DLL
# target_link_libraries(ViGEmClient PRIVATE ...)

# Specify where to place the DLL after building (e.g., in the project's binary directory)
set_target_properties(ViGEmClient PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
)
