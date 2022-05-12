import { __ } from '@wordpress/i18n';
import getIcon from '../../utils/get-icon';

const variations = [
	{
		name: 'text input',
		title: __( 'Text' ),
		icon: getIcon( 'text' ),
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
		icon: getIcon( 'hidden' ),
		attributes: {
			name: 'hidden',
			type: 'hidden',
			label: 'Hidden Input',
			hasTooltip: false,
			required: false,
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'checkbox',
		title: __( 'Checkbox' ),
		icon: getIcon( 'checkbox' ),
		attributes: {
			name: 'checkbox',
			type: 'checkbox',
			label: 'Checkbox',
			placeholder: undefined,
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'gdpr',
		title: __( 'GDPR' ),
		icon: 'shield',
		attributes: {
			name: 'checkbox',
			type: 'checkbox',
			label: __(
				'I agree with the Terms of service and Privacy policy',
				'formello'
			),
			required: true,
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'radio',
		title: __( 'Radio' ),
		icon: getIcon( 'radio' ),
		attributes: {
			name: 'radio',
			type: 'radio',
			label: 'Radio',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'range',
		title: __( 'Range' ),
		icon: getIcon( 'range' ),
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
		icon: getIcon( 'email' ),
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
		icon: getIcon( 'number' ),
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
		icon: getIcon( 'color' ),
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
		icon: getIcon( 'date' ),
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
		icon: getIcon( 'time' ),
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
		icon: getIcon( 'tel' ),
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
		icon: getIcon( 'url' ),
		attributes: {
			name: 'url',
			type: 'url',
			label: 'URL',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'inputbutton',
		title: __( 'with button' ),
		description: __( 'Display an with a button on same row.' ),
		icon: getIcon( 'input-button' ),
		attributes: {
			name: 'email',
			type: 'email',
			label: 'Email',
			checked: undefined,
			withButton: true,
		},
		innerBlocks: [ [ 'formello/button' ] ],
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'textarea',
		title: __( 'Textarea' ),
		icon: getIcon( 'textarea' ),
		attributes: {
			type: 'textarea',
			label: 'Textarea',
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
	if ( 'rangeoutput' !== variation.name ) {
		variation.attributes.withOutput = false;
	}
	if ( 'inputbutton' !== variation.name ) {
		variation.attributes.withButton = false;
	}
	if ( 'radio' !== variation.name || 'checkbox' !== variation.name ) {
		variation.attributes.checked = undefined;
	}
	if ( 'textarea' !== variation.name ) {
		variation.attributes.enableRtf = false;
	}
	if ( 'date' !== variation.name ) {
		variation.attributes.advancedDate = false;
	}
	if ( variation.isActive ) {
		return;
	}
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
