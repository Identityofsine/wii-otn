
`vigem_connect` - Initializes the driver object and establishes a connection to the emulation bus driver. Returns an *error* (**`VIGEM_ERROR`**) if no compatible bus device has been found.

```C++
VIGEM_API VIGEM_ERROR vigem_connect(
	PVIGEM_CLIENT vigem
);
```

`vigem_alloc` - Allocates an object representing a driver connection, this returns a `PVIGEM_CLIENT` object, this is used with `vigem_connect` to start communication with the `Vigem Driver`.

```cpp
const PVIGEM_CLIENT client = vigem_alloc();
```
