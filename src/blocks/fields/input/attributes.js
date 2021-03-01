export default {
	type: {
		type: 'string',
		default: 'text',
	},
	id: {
		type: 'string',
	},
	name: {
		type: 'string',
	},
	label: {
		type: 'string',
		default: 'Input Text',
	},
	description: {
		type: 'string',
	},
	placeholder: {
		type: 'string',
	},
	value: {
		type: 'string',
		default: ''
	},
	validation: {
		type: 'string',
	},
	fieldClass: {
		type: 'string',
	},
	labelAlign: {
		type: 'string',
	},
	labelVAlign: {
		type: 'string',
	},
	labelClass: {
		type: 'string',
	},
	descriptionClass: {
		type: 'string',
	},
	required: {
		type: 'boolean',
		default: false,
	},
	checked: {
		type: 'boolean',
	},
	markRequired: {
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
	tooltip: {
		type: 'string',
		default: '',
	},
	hasTooltip: {
		type: 'boolean',
		default: false,
	},
	cols: {
		type: 'number',
	},
	rows: {
		type: 'number',
		default: 5
	},
	minlength: {
		type: 'number',
	},
	maxlength: {
		type: 'number',
	},
	pattern: {
		type: 'string',
	},
	min: {
		type: 'number',
	},
	max: {
		type: 'number',
	},
	step: {
		type: 'number',
	}
};
