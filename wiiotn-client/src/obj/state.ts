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

	const removeListener = (listener: (arg: any) => void) => {
		listeners = listeners.filter(l => l !== listener);
	};

	return {
		getState,
		setState,
		addListener,
		removeListener
	};

}

export function useConservativeState<T>(default_value: T | undefined) {
	const current_state = createState(default_value);

	const setState = (new_value: T) => {
		/* compare current_state and previous_state and create a new object that only contains changed data*/
		type TJSON = { [key: string]: any };
		let new_state: T | TJSON = { ...current_state.getState() };

		Object.keys(new_state as TJSON).forEach(key => {
			if ((new_state as TJSON)[key] === (current_state.getState() as TJSON)[key])
				delete (new_state as TJSON)[key];
		});

		current_state.setState({ ...new_value });
	}

	return {
		getState: current_state.getState,
		setState,
		addListener: current_state.addListener,
		removeListener: current_state.removeListener
	}

}

export default createState;
