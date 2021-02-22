import { __ } from '@wordpress/i18n';

export default {
	id: {
		type: 'number',
	},
	blockId: {
		type: 'number',
	},
	name: {
		type: 'string',
		default: '',
	},
	successMessage: {
		type: 'string',
		default: 'Success',
	},
	errorMessage: {
		type: 'string',
		default: 'Error',
	},
	redirectUrl: {
		type: 'string',
		default: '',
	},
	recaptchaEnabled: {
		type: 'boolean',
		default: false,
	},
	storeSubmissions: {
		type: 'boolean',
		default: false,
	},
	hide: {
		type: 'boolean',
		default: false,
	},
	constraints: {
		type: 'array'
	},
	fields: {
		type: 'array'
	},
	formSettings: {
		type: 'object',
	},
	settings: {
		type: 'object',
		default: formello.settings
	},
	asRow: {
		type: 'boolean',
		default: false
	}
};
