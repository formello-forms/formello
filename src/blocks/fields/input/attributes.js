export default {
	type: {
		type: 'string',
		default: 'text'
	},
	id: {
		type: 'string'
	},
	name: {
		type: 'string'
	},
	label: {
		type: 'string',
		default: 'Input Text'
	},
	description: {
		type: 'string',
		default: ''
	},
	placeholder: {
		type: 'string',
		default: ''
	},
	value: {
		type: 'string',
		default: ''
	},
	validation: {
		type: 'string',
		default: ''
	},
	fieldClass: {
		type: 'string',
		default: ''
	},
	labelVAlign: {
		type: 'string',
		default: ''
	},
	labelClass: {
		type: 'string',
		default: ''
	},
	descriptionClass: {
		type: 'string',
		default: ''
	},
	required: {
		type: 'boolean',
		default: false,
	},
	disabled: {
		type: 'boolean',
		default: false
	},
	readOnly: {
		type: 'boolean',
		default: false
	},
	checked: {
		type: 'boolean',
		default: false
	},
	markRequired: {
		type: 'boolean',
		default: false
	},
	showHelp: {
		type: 'boolean',
		default: false
	},
	help: {
		type: 'string',
		default: ''
	},
	tooltip: {
		type: 'string',
		default: ''
	},
	hasTooltip: {
		type: 'boolean',
		default: false,
	},
	cols: {
		type: 'number',
		default: ''
	},
	rows: {
		type: 'number',
		default: ''
	},
	minlength: {
		type: 'number',
		default: ''
	},
	maxlength: {
		type: 'number',
		default: ''
	},
	pattern: {
		type: 'string',
		default: ''
	},
	min: {
		type: 'number',
		default: ''
	},
	max: {
		type: 'number',
		default: ''
	},
	step: {
		type: 'number',
		default: '',
	}
};
