@echo off
setlocal

set BUILD_DIR=build
set DLL_DIR= ..\..\..\lib\ViGEmClient\ViGEmClient.dll

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
		rem copy the DLL to the build folder
		copy %DLL_DIR% Debug
		echo DLL copied to build folder.
)

echo Build completed successfully.

endlocal
