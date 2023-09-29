
To start working with *WDK* and **HIDs** you need to import a few headers into your project.

> **NOTE:** Mind you that you will need the **WDK** installed on your computer.

### Headers Needed
- **hidclass.h**
- **hidpddi.h**
- **hidpi.h**
- **hidsdi.h**
- **hidspicx.h**
- **kbdmou.h**
- **ntdd8042.h**
- **vhf.h**


### Overview on HIDs

**Human Interface Devices** or **HID(s)** is a device class definition aimed to replace `PS/2` style connectors with a generic USB driver to support **HID** devices such as keyboards, mice, game controllers, and so on.

Before **HID**, hardware innovation required either overloading data in an existing protocol or creating non-standard hardware with its own specialized driver (which creates massive headaches for the developer, user, and system engineer.) 

**HID** devices include a broad range of devices such as alphanumeric displays, barcode readers, volume controls, sensors, mice, game controllers, etc.

#### HID Concepts

**HID** consists of two fundamental concepts, a report descriptor and reports

##### Reports

Applications and **HID** devices exchange data through reports. There are three report types.

|Report Type|Description|
|------------|-------------------------------|
|Input Report|Data send from the **HID** device to the application, typically when the state of a control changes.|
|Output Report|Data sent from the application to the **HID** device, for example to the LEDs on a keyboard.
|Feature Report|Data that can be manually read and written, and are typically related to the configuration information|







