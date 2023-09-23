"use client";
import React, { useEffect } from 'react'
import '../../styles/dropdown.scss';

export interface Option<T> {
	value: T,
	label: string,
}

type DropDownProp<T> = {
	options?: Option<T>[] | [],
	defaultValue?: Option<T> | null,
	caption_text?: string,
	onChange?: (value: Option<T>) => void,
} & React.ComponentPropsWithRef<any>;

function Dropdown<T>(props: DropDownProp<T>) {
	const [selected, setSelected] = React.useState<Option<T> | null>(props.defaultValue || null);
	const [is_open, setIsOpen] = React.useState<boolean>(false);


	useEffect(() => {
		props.onChange && props.onChange(selected as Option<T>);
	}, [selected])

	const toggle_open = () => {
		setIsOpen(!is_open);
	}

	const change_selected = (new_option: Option<T>) => {
		setSelected(new_option);
		setIsOpen(false);
	}

	return (
		<div className={`dropdown neue relative select-none ${props.className}`} >
			<div onClick={toggle_open} className='pointer select-none'>
				<span className='absolute caption-text red caption-position'>{props.caption_text}</span>
				{/* <IHIcon icon='triangle-down' className='arrow-icon absolute' /> */}
				<span className='current-option exact-line-height select-none'>{selected?.label}</span>

			</div>
			<div className={`dropdown-options fill-container ${is_open ? 'open' : ''}`}>
				{props.options?.map((option: Option, index: number) => (
					<div className='option' onClick={() => change_selected(option)}>
						<span>{option.label}</span>
					</div>
				))}
			</div>
		</div >
	)
}

export default Dropdown
