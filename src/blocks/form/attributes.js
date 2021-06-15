import { __ } from '@wordpress/i18n';

export default {
	id: {
		type: 'number',
	},
	name: {
		type: 'string',
		default: '',
	},
	successMessage: {
		type: 'string',
		default: '',
	},
	errorMessage: {
		type: 'string',
		default: '',
	},
	redirectUrl: {
		type: 'string',
		default: '',
	},
	recaptchaEnabled: {
		type: 'boolean',
		default: false,
	},
	recaptchaVersion: {
		type: 'number',
		default: 3,
	},
	labelIsBold: {
		type: 'boolean',
		default: false,
	},
	labelAlign: {
		type: 'string',
		default: '',
	},
	storeSubmissions: {
		type: 'boolean',
		default: true,
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
	asRow: {
		type: 'boolean',
		default: false
	},
	actions: {
		type: 'array',
		default: []
	}
};
