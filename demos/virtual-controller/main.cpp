#include <iostream>
#include <stdio.h>
#include "keyboardlistener.h"

#pragma comment(lib, "setupapi.lib")

using namespace WIIOTN_VC;
using namespace WIIOTN_KEYBOARD;

int main(int argc, char* argv[]) {
  //
  // welcome message
  //
  printf("Hello World, Controller Virtualization!\n");

	VirtualController controller;
	KeyboardListener listener;
	listener.run(&controller, 0);

  return 0;
}
