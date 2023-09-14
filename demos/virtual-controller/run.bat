@echo off

setlocal

rem set build folder
set buildFolder=build
set exeName=VirtualControllerDemo.exe

rem check if build folder exists
if not exist %buildFolder% (
	echo Build folder doesn't exist, consider running build.bat
	goto end
)

rem check if exe exists
if not exist %buildFolder%\Debug\%exeName% (
	echo Executable doesn't exist, consider running build.bat
	goto end
)

echo Running %exeName%

echo.
%buildFolder%\Debug\%exeName%





:end
endlocal
