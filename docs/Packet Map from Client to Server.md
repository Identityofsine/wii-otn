
### New JSO
```ts
{
	"id": number,
	"name": string,
	"type": "controller",
	axis: {
	  "l_thumb_x": number,
	  "l_thumb_y": number,
	  "r_thumb_x": number,
	  "r_thumb_y": number,
	}
	"buttons_pressed": number,
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
