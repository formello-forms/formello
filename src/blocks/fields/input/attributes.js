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
		default: '',
	},
	label: {
		type: 'string',
		default: 'Input Text',
	},
	description: {
		type: 'string',
		default: '',
	},
	placeholder: {
		type: 'string',
	},
	value: {
		type: 'string',
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
		default: false,
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
	},
	supported: {
		type: 'array',
		default: ['maxlength', 'minlength', 'pattern', 'placeholder', 'readonly', 'required']
	},
	settings: {
		type: 'object',
		default: formello.settings
	}
};
