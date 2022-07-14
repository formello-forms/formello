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
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path color="#1e72bd" d="M10 2s3 2 7 2c0 11-7 14-7 14S3 15 3 4c4 0 7-2 7-2zm0 8h5s1-1 1-5c0 0-5-1-6-2v7H5c1 4 5 7 5 7v-7z"/></g></svg>,
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
		name: 'password',
		title: __( 'Password' ),
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path color="#1e72bd" d="M16.95 2.58c1.96 1.95 1.96 5.12 0 7.07-1.51 1.51-3.75 1.84-5.59 1.01l-1.87 3.31-2.99.31L5 18H2l-1-2 7.95-7.69c-.92-1.87-.62-4.18.93-5.73 1.95-1.96 5.12-1.96 7.07 0zm-2.51 3.79c.74 0 1.33-.6 1.33-1.34 0-.73-.59-1.33-1.33-1.33-.73 0-1.33.6-1.33 1.33 0 .74.6 1.34 1.33 1.34z"/></g></svg>,
		attributes: {
			name: 'password',
			type: 'password',
			label: 'Password',
			pattern: '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*',
			validation: 'Please choose a password that includes at least 1 uppercase character, 1 lowercase character, and 1 number.'
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
		variation.attributes.advanced = false;
	}
	if ( variation.isActive ) {
		return;
	}
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
