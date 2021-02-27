/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'basic',
		title: __( 'Basic' ),
		description: __( 'Basic form' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
				/>
			</SVG>
		),
		isDefault: true,
		innerBlocks: [ [ 'formello/input' ], [ 'formello/button' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'contact',
		title: __( 'Contact' ),
		description: __( 'A simple contact form' ),
		icon: (
			<SVG xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 48 48" width="48">
				<Path d="m37 17c0-1.1-.9-2-2-2h-22c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2zm-2 0-11 7-11-7zm0 16h-22v-14l11 7 11-7z" />
			</SVG>
		),
		innerBlocks: [ 
			[ 'formello/input', { type: 'text', label: 'Name' } ],
			[ 'formello/input', { type: 'email', label: 'Email', required: true } ], 
			[ 'formello/input', { type: 'text', label: 'Subject' } ],
			[ 'formello/input', { type: 'textarea', label: 'Message' } ], 
			[ 'formello/button', { txt: 'Send' } ] 
		],
		scope: [ 'block' ],
	},
	{
		name: 'event',
		title: __( 'Event' ),
		description: __( 'Bokk event form' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z"
				/>
			</SVG>
		),
		innerBlocks: [ 
			[ 'core/columns', {}, [
			    [ 'core/column', {}, [ [ 'formello/input', { type: 'text', label: 'Name' } ] ] ],
			    [ 'core/column', {}, [ [ 'formello/input', { type: 'text', label: 'Name' } ] ] ]
			] ],
			[ 'formello/input', { type: 'email', label: 'Email', required: true } ], 
			[ 'formello/input', { type: 'tel', label: 'Phone', required: true } ], 
			[ 'core/columns', {}, [
			    [ 'core/column', {}, [ [ 'formello/input', { type: 'date', label: 'Date', required: true } ] ] ],
			    [ 'core/column', {}, [ [ 'formello/input', { type: 'time', label: 'Hour' } ] ] ]
			] ],
			[ 'formello/input', { type: 'textarea', label: 'Message' } ], 
			[ 'formello/button', { txt: 'Book appointment' } ] 
		],
		scope: [ 'block' ],
	}
];

export default variations;