import { SVG, Rect } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	Checkbox,
	GDPR,
	Input,
	Hidden,
	Range,
	Password,
	Email,
	Url,
	Clock,
	Calendar,
	Color,
	Tel,
	Number as NumberField,
	Radio,
} from '../../icons/icons';

const variations = [
	{
		name: 'text-field',
		title: __( 'Text' ),
		description: __( 'A basic single-line text field.', 'formello' ),
		icon: Input,
		attributes: { type: 'text', name: 'text' },
		scope: [ 'transform' ],
		isDefault: true,
	},
	{
		name: 'hidden',
		title: __( 'Hidden' ),
		description: __( 'Display hidden field.', 'formello' ),
		icon: Hidden,
		attributes: { type: 'hidden' },
		scope: [ 'inserter' ],
	},
	{
		name: 'checkbox',
		title: __( 'Checkbox' ),
		description: __( 'A simple checkbox input.' ),
		icon: Checkbox,
		attributes: { type: 'checkbox', name: 'my_choice' },
		scope: [ 'inserter' ],
	},
	{
		name: 'radio',
		title: __( 'Radio' ),
		description: __( 'A simple radio input.' ),
		icon: Radio,
		attributes: { type: 'radio', name: 'my_choice' },
		scope: [ 'block' ],
	},
	{
		name: 'gdpr',
		title: __( 'GDPR' ),
		icon: GDPR,
		attributes: {
			name: 'gdpr',
			type: 'checkbox',
			label: __(
				'I agree with the Terms of service and Privacy policy',
				'formello'
			),
			required: true,
		},
		scope: [ 'inserter' ],
	},
	{
		name: 'range',
		title: __( 'Range' ),
		icon: Range,
		attributes: { type: 'range', name: 'range' },
		scope: [ 'inserter' ],
	},
	{
		name: 'email',
		title: __( 'Email' ),
		description: __( 'Used for email addresses.' ),
		icon: Email,
		attributes: { type: 'email', name: 'email' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'number',
		title: __( 'Number' ),
		icon: NumberField,
		attributes: { type: 'number', name: 'number' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'color',
		title: __( 'Color' ),
		icon: Color,
		attributes: { type: 'color', name: 'color' },
		scope: [ 'inserter' ],
	},
	{
		name: 'date',
		title: __( 'Date' ),
		icon: Calendar,
		attributes: { type: 'date', name: 'date' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'time',
		title: __( 'Time' ),
		icon: Clock,
		attributes: { type: 'time', name: 'time' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'tel',
		title: __( 'Tel' ),
		icon: Tel,
		attributes: { type: 'tel', name: 'phone' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'url',
		title: __( 'Url' ),
		icon: Url,
		attributes: { type: 'url', name: 'url' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'inputbutton',
		title: __( 'Input with button' ),
		icon: (
			<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<Rect
					x="4.75"
					y="15.25"
					width="6.5"
					height="14.5"
					transform="rotate(-90 4.75 15.25)"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<Rect
					x="14"
					y="10"
					width="4"
					height="4"
					rx="1"
					fill="currentColor"
				/>
			</SVG>
		),
		attributes: {
			type: 'email',
			label: 'Email',
			name: 'email',
			withButton: true,
		},
		innerBlocks: [ [ 'formello/button', { noWrapper: true } ] ],
		scope: [ 'inserter' ],
	},
	{
		name: 'password',
		title: __( 'Password' ),
		icon: Password,
		attributes: {
			type: 'password',
			name: 'password',
			pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`,
			validation:
				'Please choose a password that includes at least 1 uppercase character, 1 lowercase character, 1 special character, and 1 number.',
		},
		scope: [ 'inserter' ],
	},
];

/**
 * Add `isActive` function to all `embed` variations, if not defined.
 * `isActive` function is used to find a variation match from a created
 *  Block by providing its attributes.
 */
variations.forEach( ( variation ) => {
	if ( 'file' === variation.name ) {
		variation.attributes.value = undefined;
	}
	if ( 'radio' !== variation.name || 'checkbox' !== variation.name ) {
		variation.attributes.checked = undefined;
	}
	if ( 'date' === variation.name ) {
		variation.attributes.flatpickr = {
			noCalendar: false,
		};
	}
	if ( 'time' === variation.name ) {
		variation.attributes.flatpickr = {
			noCalendar: true,
			enableTime: true,
		};
	}
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
