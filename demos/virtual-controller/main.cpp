#include <iostream>
#include <stdio.h>
#include "keyboardlistener.h"

#pragma comment(lib, "setupapi.lib")

using namespace WIIOTN_VC;
using namespace WIIOTN_KEYBOARD;

int main() {
  //
  // welcome message
  //
  printf("Hello World, Controller Virtualization!\n");

	VirtualController controller;
	KeyboardListener listener;
	listener.run(&controller);

  return 0;
}
