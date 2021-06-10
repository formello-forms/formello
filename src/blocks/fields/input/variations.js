/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import getIcon from '../../../utils/get-icon';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'text',
		title: __( 'Text field' ),
		description: __( 'Text field' ),
		icon: getIcon('text'),
		attributes: {
			name: 'text',
			type: 'text',
			label: 'Text Input',
			checked: undefined
		},
		scope: [ 'block', 'transform' ],
	},
	{
		name: 'hidden',
		title: __( 'Hidden' ),
		description: __( 'Hidden field' ),
		icon: getIcon('hidden'),
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
		description: __( 'Checkbox field' ),
		icon: getIcon('checkbox'),
		attributes: {
			name: 'checkbox',
			type: 'checkbox',
			label: 'Input Checkbox',
			placeholder: undefined
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'radio',
		title: __( 'Radio' ),
		description: __( 'Radio field' ),
		icon: getIcon('radio'),
		attributes: {
			name: 'radio',
			type: 'radio',
			label: 'Input Radio',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'range',
		title: __( 'Range' ),
		description: __( 'Range field' ),
		icon: getIcon('range'),
		attributes: {
			name: 'range',
			type: 'range',
			label: 'Input Range',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'email',
		title: __( 'Email' ),
		description: __( 'Email field' ),
		icon: getIcon('email'),
		attributes: {
			name: 'email',
			type: 'email',
			label: 'Input Email',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'number',
		title: __( 'Number' ),
		description: __( 'Number input' ),
		icon: getIcon('number'),
		attributes: {
			name: 'number',
			type: 'number',
			label: 'Input Number',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'color',
		title: __( 'Color' ),
		description: __( 'Color input' ),
		icon: getIcon('color'),
		attributes: {
			name: 'color',
			type: 'color',
			label: 'Input Color',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'date',
		title: __( 'Date' ),
		description: __( 'Date input' ),
		icon: getIcon('date'),
		attributes: {
			name: 'date',
			type: 'date',
			label: 'Input Date',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'time',
		title: __( 'Time' ),
		description: __( 'Time input' ),
		icon: getIcon('time'),
		attributes: {
			name: 'time',
			type: 'time',
			label: 'Input Time',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'tel',
		title: __( 'Tel' ),
		description: __( 'Tel input' ),
		icon: getIcon('tel'),
		attributes: {
			name: 'tel',
			type: 'tel',
			label: 'Input Tel',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'url',
		title: __( 'Url' ),
		description: __( 'Url input' ),
		icon: getIcon('url'),
		attributes: {
			name: 'url',
			type: 'url',
			label: 'Input URL',
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'inputbutton',
		title: __( 'Input with button' ),
		description: __( 'Display an input with a button on same row.' ),
		icon: getIcon( 'input-button' ),
		attributes: {
			name: 'email',
			type: 'email',
			label: 'Email',
			checked: undefined,
			withButton: true
		},
		innerBlocks: [ [ 'formello/button' ] ],
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'rangeoutput',
		title: __( 'Input range with value' ),
		description: __( 'Display an output field with the value of the range selected.' ),
		icon: getIcon( 'range' ),
		attributes: {
			name: 'range',
			type: 'range',
			label: 'Range',
			checked: undefined,
			withOutput: true
		},
		scope: [ 'block', 'inserter', 'transform' ],
	},
	{
		name: 'textarea',
		title: __( 'Textarea' ),
		description: __( 'Multiline textarea' ),
		icon: getIcon('textarea'),
		attributes: {
			type: 'textarea',
			label: 'Textarea',
			cols: 3,
			rows: 5,
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
	if ( 'rangeoutput' !== variation.name ) variation.attributes.withOutput = false;
	if ( 'inputbutton' !== variation.name ) variation.attributes.withButton = false;
	if ( variation.isActive ) return;
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type ===
		variationAttributes.type;
} );

export default variations;
