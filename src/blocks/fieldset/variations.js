/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { 
	Checkboxes,
	Radios
} from '../../icons/icons';

const variations = [
	{
		name: 'checkboxes',
		title: __( 'Checkboxes' ),
		description: __( 'Multiple choices' ),
		icon: Checkboxes,
		innerBlocks: [
			[
				'formello/input',
				{ type: 'checkbox', name: 'Option_1', label: 'Option 1' },
			],
			[
				'formello/input',
				{ type: 'checkbox', name: 'Option_2', label: 'Option 2' },
			],
			[
				'formello/input',
				{ type: 'checkbox', name: 'Option_3', label: 'Option 3' },
			],
		],
		scope: [ 'inserter', 'block' ],
	},
	{
		name: 'radios',
		title: __( 'Multiple choice' ),
		description: __( 'Multiple choices' ),
		icon: Radios,
		innerBlocks: [
			[
				'formello/input',
				{ type: 'radio', name: 'option', label: 'Option 1' },
			],
			[
				'formello/input',
				{ type: 'radio', name: 'option', label: 'Option 2' },
			],
			[
				'formello/input',
				{ type: 'radio', name: 'option', label: 'Option 3' },
			],
		],
		scope: [ 'inserter', 'block' ],
	},
];

export default variations;
