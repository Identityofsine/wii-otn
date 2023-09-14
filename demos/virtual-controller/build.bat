@echo off
setlocal

set BUILD_DIR=build

rem Check if the build folder exists
if not exist %BUILD_DIR% (
    mkdir %BUILD_DIR%
    cd %BUILD_DIR%
    cmake ..
    if %errorlevel% neq 0 (
        echo CMake configuration failed. Exiting.
        exit /b %errorlevel%
    )
    cmake --build .
    if %errorlevel% neq 0 (
        echo Build failed. Exiting.
        exit /b %errorlevel%
    )
) else (
    cd %BUILD_DIR%
    cmake ..
    if %errorlevel% neq 0 (
        echo CMake configuration failed. Exiting.
        exit /b %errorlevel%
    )
    cmake --build .
    if %errorlevel% neq 0 (
        echo Build failed. Exiting.
        exit /b %errorlevel%
    )
)

echo Build completed successfully.

endlocal
