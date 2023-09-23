import { useEffect, useRef, useState } from "react";


interface OnGamePadConnectedProps {
	onGamePadConnected: (game_pad: Gamepad) => void;
}

export default function useGamePadHook(props: OnGamePadConnectedProps) {

	const [game_pad, setGamePad] = useState<Gamepad | null>(null);
	const listener_ref = useRef<Function[] | null>(null);

	useEffect(() => {
		const gamePadListener = (e: GamepadEvent) => {
			if (e.gamepad) {
				setGamePad(e.gamepad);
				props.onGamePadConnected(e.gamepad);
			}
		}
		window.addEventListener('gamepadconnected', gamePadListener);
		return () => {
			window.removeEventListener('gamepadconnected', gamePadListener);
		};
	}, [])

	const addEventListener = (listener: Function) => {
		if (listener_ref.current === null) {
			listener_ref.current = [];
		}
		listener_ref.current.push(listener);
	}

	const removeEventListener = (listener: Function) => {
		if (listener_ref.current !== null) {
			const index = listener_ref.current.indexOf(listener);
			if (index !== -1) {
				listener_ref.current.splice(index, 1);
			}
		}
	}

	return [game_pad, addEventListener, removeEventListener] as const;

}
