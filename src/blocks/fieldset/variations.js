/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'checkboxes',
		title: __( 'Checkboxes' ),
		description: __( 'Multiple choices' ),
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
		innerBlocks: [ 
			[ 'formello/input', { type: 'checkbox', name:'Option_1', label: 'Option 1' } ], 
			[ 'formello/input', { type: 'checkbox', name:'Option_1', label: 'Option 1' } ], 
			[ 'formello/input', { type: 'checkbox', name:'Option_1', label: 'Option 1' } ] 
		],
		scope: [ 'inserter' ],
	},
	{
		name: 'radios',
		title: __( 'Checkboxes' ),
		description: __( 'Multiple choices' ),
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
		innerBlocks: [
			[ 'formello/input', { type: 'radio', name:'Option_1', label: 'Option 1' } ], 
			[ 'formello/input', { type: 'radio', name:'Option_1', label: 'Option 1' } ], 
			[ 'formello/input', { type: 'radio', name:'Option_1', label: 'Option 1' } ] 
		],
		scope: [ 'inserter' ],
	}
];

export default variations;