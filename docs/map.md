### JSON Packet
```json
{
  "accelerometer_pitch": 0,
  "accelerometer_roll": 0,
  "accelerometer_x": 0,
  "accelerometer_y": 0,
  "accelerometer_yaw": 0,
  "accelerometer_z": 0,
  "buttons_pressed": 0,
  "id": 0,
  "ir_sensor_1_x": 0,
  "ir_sensor_1_y": 0,
  "ir_sensor_2_x": 0,
  "ir_sensor_2_y": 0,
  "name": "",
  "new": false,
  "type": "controller"
}
```

### Reinvisioned JSON
```ts
{
	"id": number,
	"name": string,
	"type": "controller",
	"controller": "keyboard" | "xbox",
	"lThumbX": number,
	"lThumbY": number,
	"rThumbX": number,
	"rThumbY": number,
	"buttons_pressed": number,
	"lTrigger": number,
	"rTrigger": number
}
```


### Mapping of external buttons
```text
--TILT
left-trigger = tilt_backward
right-trigger = tilt_forward
left-bumper = tilt_left
right-bumper = tilt_right

--SHAKE
lThumbX = Shake_X
lThumbY = Shake_Y
lThumb_Click + lThumb_X = Shake_Z

--POINT
rThumbX = Point_X
rThumbY = Point_Y

--Swing
rThumbDown + rThumbY+ = Swing_UP
rThumbDown + rThumbY- = Swing_DOWN
rThumbDown + rThumbX- = Swing_LEFT
rThumbDown + rThumbX+ = Swing_RIGHT
```
