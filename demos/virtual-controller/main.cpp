#include <Windows.h>
#include <iostream>
#include <stdio.h>
#include <ViGEm/Client.h>

#pragma comment(lib, "setupapi.lib")

void run() {
  // Initialize the client context
  const auto client = vigem_alloc();
  // check if client connected
  if (!client) {
    printf("Failed to allocate memory!\n");
    return;
  } else {
    printf("Memory Allocated!\n");
  }

  // send a handle to our driver
  const auto bus_return_value = vigem_connect(client);
  if (!VIGEM_SUCCESS(bus_return_value)) {
    // print error code out in hex
    std::cout << "Failed to connect to driver! Error: " << std::hex
              << bus_return_value << std::endl;
    return;
  } else {
    printf("Congrats!, You are connected to driver!\n");
  }

  //
  // initialize controller
  //
  const auto pad = vigem_target_x360_alloc(); // allocate memory for controller

  //
  // push pad to vigemBus
  //
  const auto pad_return_value =
      vigem_target_add(client, pad); // push controller to vigemBus)

  //
  // check if controller was pushed to vigemBus
  //
  if (!VIGEM_SUCCESS(pad_return_value)) {
    printf("Failed to add virtual pad to client! Error: %d\n",
           pad_return_value);
    return;
  } else {
    printf("Virtual pad added to client!\n");
  }

  //
  // pause execution until user-input
  //
  printf("Press enter to disconnect...\n");
  getchar();
  printf("Disconnecting from driver...\n");

  //
  // disconnect pads from computer, free resources (disconnect virtual device)
  //
  vigem_target_remove(client, pad);
  //
  // free Memory
  //
  vigem_target_free(pad);
  //
  // adding a sleep to demonstrate driver disconnection
  //
  Sleep(2000);
  printf("Disconnecting from bus...\n");
  //
  // finish up and disconnect from driver
  //
  vigem_disconnect(client);
  //
  // free memory
  //
  vigem_free(client);
  printf("Exit!\n");
}

int main() {
  //
  // welcome message
  //
  printf("Hello World, Controller Virtualization!\n");
  run();
  return 0;
}
