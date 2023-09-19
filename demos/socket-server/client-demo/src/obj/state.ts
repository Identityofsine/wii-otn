/**
 * Create a state object
 */
function createState<T>(default_value: T | undefined = undefined) {
	let state: T = default_value as T;
	let listeners: ((new_state: T) => void)[] = [];
	const getState = () => state;

	const setState = (newState: T | ((old_state: T) => T)) => {
		if (typeof newState === 'function')
			state = (newState as (old_state: T) => T)(state);
		else
			state = newState as T;
		listeners.forEach(listener => listener(state));
	};

	const addListener = (listener: (arg: any) => void) => {
		listeners.push(listener);
	};

	return {
		getState,
		setState,
		addListener
	};

}

export default createState;
