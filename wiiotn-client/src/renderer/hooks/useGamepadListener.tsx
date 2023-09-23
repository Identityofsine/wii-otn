import { useEffect, useRef, useState } from "react";
import useGamePad, { UseGamePadReturn } from "./useGamePad";



export default function useGamePadHook() {

	const [game_pad, setGamePad] = useState<Gamepad | null>(null);
	const gamepad_entity = useRef<UseGamePadReturn | null>(null);

	useEffect(() => {
		const gamePadListener = (e: GamepadEvent) => {
			if (e.gamepad && !gamepad_entity.current) {
				setGamePad(e.gamepad);
				gamepad_entity.current = useGamePad(e.gamepad.index);
			}
		}
		window.addEventListener('gamepadconnected', gamePadListener);
		return () => {
			window.removeEventListener('gamepadconnected', gamePadListener);
		};
	}, [])


	const addEventListener = (event_name: string, listener: (button: number) => void) => {
		if (gamepad_entity.current) {
			gamepad_entity.current.addEventListener(event_name, listener);
		}
	}

	const removeEventListener = (event_name: string) => {
		if (gamepad_entity.current) {
			gamepad_entity.current.removeEventListener(event_name);
		}
	}

	return [game_pad, addEventListener, removeEventListener] as const;

}
