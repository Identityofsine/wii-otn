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

interface IUseStateOptions<T> {
	ignore?: (keyof T)[];
}

export function useConservativeState<T>(default_value: T | undefined, options?: IUseStateOptions<T>) {
	const current_state = createState(default_value);

	const setState = (new_value: T | ((old_state: T) => T)) => {
		/* compare current_state and previous_state and create a new object that only contains changed data*/

		type TJSON = { [key: string]: any };
		let new_state: T | TJSON;

		if (typeof new_value === 'function')
			new_state = (new_value as (old_state: T) => T)(current_state.getState());
		else
			new_state = new_value as T;


		Object.keys(new_state as TJSON).forEach(key => {
			if (options?.ignore?.includes(key as keyof T)) return;
			if ((new_state as TJSON)[key] === (current_state.getState() as TJSON)[key])
				delete (new_state as TJSON)[key];
		});

		current_state.setState({ ...new_state });
	}

	return {
		getState: current_state.getState,
		setState,
		addListener: current_state.addListener,
		removeListener: current_state.removeListener
	}

}

export function useStrictState<T>(default_value: T | undefined, options?: IUseStateOptions<T>) {
	const current_state = createState<T>(default_value);


	type TJSON = { [key: string]: any };
	let new_state: T | TJSON;

	const m_checkKeys = (value_in_check: TJSON): boolean => {
		let is_same = true;
		Object.keys(value_in_check).forEach(key => {
			if (options?.ignore?.includes(key as keyof T)) return;
			if ((value_in_check as TJSON)[key] !== (current_state.getState() as TJSON)[key])
				is_same = false;
		});
		return is_same;
	}

	const setState = (new_value: T | ((old_state: T) => T)) => {
		if (typeof new_value === 'function')
			new_state = (new_value as (old_state: T) => T)(current_state.getState());
		else
			new_state = new_value as TJSON;

		let blank_state = {} as T;
		//only replace the state if the new state is different from the old state (by each key)
		Object.keys(new_state as TJSON).forEach(key => {
			if (options?.ignore?.includes(key as keyof T)) return;
			if ((new_state as TJSON)[key] !== (current_state.getState() as TJSON)[key])
				(blank_state as TJSON)[key] = (new_state as TJSON)[key];
		});

		if (Object.keys(blank_state as TJSON).length > 0)
			current_state.setState((old_state) => { return { ...old_state, ...blank_state } });


	}

	return {
		getState: current_state.getState,
		setState,
		addListener: current_state.addListener,
		removeListener: current_state.removeListener
	}

}

export default createState;
