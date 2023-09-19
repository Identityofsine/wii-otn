import React from 'react'
import { GenericIHDOM } from '../genericdom'
import '../../styles/button.scss';
type ButtonProps = {
	// props
	text? : string,
	onClick? : () => any,

} & GenericIHDOM 


function Button(props : ButtonProps) {
	return (
		<div className={`button flex center-flex border-box pointer ${props.className}`} onClick={props.onClick && props.onClick}>
			<span className='label neue select-none'>{props.text}</span>
		</div>
	)
}

export default Button