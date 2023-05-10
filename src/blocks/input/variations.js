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
		icon: Input,
		description: __( 'Create basic single-line text fields.', 'formello' ),
		attributes: {
			name: 'text',
			type: 'text',
			label: 'Text Input',
			checked: undefined,
		},
		scope: [ 'block', 'transform' ],
	},
	{
		name: 'hidden',
		title: __( 'Hidden' ),
		description: __( 'Create basic single-line text fields.', 'formello' ),
		icon: Hidden,
		attributes: {
			name: 'hidden',
			type: 'hidden',
			label: 'Hidden Input',
			required: false,
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'checkbox',
		title: __( 'Checkbox' ),
		icon: Checkbox,
		attributes: {
			name: 'checkbox',
			type: 'checkbox',
			label: 'Checkbox',
			placeholder: undefined,
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'radio',
		title: __( 'Radio' ),
		icon: Radio,
		attributes: {
			name: 'radio',
			type: 'radio',
			label: 'Radio',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'gdpr',
		title: __( 'GDPR' ),
		icon: GDPR,
		attributes: {
			name: 'checkbox',
			type: 'checkbox',
			label: __(
				'I agree with the Terms of service and Privacy policy',
				'formello'
			),
			required: true,
		},
		scope: [ 'block', 'inserter' ],
	},
	{
		name: 'range',
		title: __( 'Range' ),
		icon: Range,
		attributes: {
			name: 'range',
			type: 'range',
			label: 'Range',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'email',
		title: __( 'Email' ),
		icon: Email,
		attributes: {
			name: 'email',
			type: 'email',
			label: 'Email',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'number',
		title: __( 'Number' ),
		icon: NumberField,
		attributes: {
			name: 'number',
			type: 'number',
			label: 'Number',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'color',
		title: __( 'Color' ),
		icon: Color,
		attributes: {
			name: 'color',
			type: 'color',
			label: 'Color',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'date',
		title: __( 'Date' ),
		icon: Calendar,
		attributes: {
			name: 'date',
			type: 'date',
			label: 'Date',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'time',
		title: __( 'Time' ),
		icon: Clock,
		attributes: {
			name: 'time',
			type: 'time',
			label: 'Time',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'tel',
		title: __( 'Tel' ),
		icon: Tel,
		attributes: {
			name: 'tel',
			type: 'tel',
			label: 'Tel',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'url',
		title: __( 'Url' ),
		icon: Url,
		attributes: {
			name: 'url',
			type: 'url',
			label: 'URL',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'inputbutton',
		title: __( 'Input with button' ),
		icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
			<Rect x="14" y="10" width="4" height="4" rx="1" fill="currentColor" />
		</SVG>,
		attributes: {
			type: 'email',
			label: 'Email',
			withButton: true,
		},
		innerBlocks: [
			[ 'formello/button' ],
		],
		scope: [ 'block', 'inserter' ],
	},
	{
		name: 'password',
		title: __( 'Password' ),
		icon: Password,
		attributes: {
			type: 'password',
			pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$',
			validation: 'Please choose a password that includes at least 1 uppercase character, 1 lowercase character, and 1 number.',
		},
		scope: [ 'block', 'inserter', 'transform' ],
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
	if ( 'date' !== variation.name ) {
		variation.attributes.advanced = false;
	}
	if ( variation.isActive ) {
		return;
	}
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
