import { __ } from '@wordpress/i18n';

export default {
	type: {
		type: 'string',
		default: 'text',
	},
	id: {
		type: 'string',
		default: 'field',
	},
	name: {
		type: 'string',
		default: __( 'select', 'formello' ),
	},
	label: {
		type: 'string',
		default: __( 'Select field', 'formello' ),
	},
	options: {
		type: 'array',
		default: [
			{
	    		value: '',
	    		label: 'Select an option',
	    		default: true
	    	},
			{
	    		value: '1',
	    		label: 'One'
	    	},
	    	{
	    		value: '2',
	    		label: 'Two'
	    	},
	    	{
	    		value: '3',
	    		label: 'Three'
	    	},
		],
	},
	multiple: {
		type: 'boolean',
		default: false,
	},
	hasDefault: {
		type: 'boolean',
		default: true,
	},
	selectedOpt: {
		type: 'array',
		default: [],
	},
	fieldClass: {
		type: 'string',
		default: '',
	},
	labelAlign: {
		type: 'string',
	},
	labelVAlign: {
		type: 'string',
	},
	labelClass: {
		type: 'string',
		default: '',
	},
	required: {
		type: 'boolean',
		default: false,
	},
	showHelp: {
		type: 'boolean',
		default: false,
	},
	help: {
		type: 'string',
		default: '',
	},
	hasTooltip: {
		type: 'boolean',
		default: false,
	},
	tooltip: {
		type: 'string',
		default: '',
	},
};
