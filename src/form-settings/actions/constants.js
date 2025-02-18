import { ReactComponent as MailPoet } from '../../../assets/integrations/mailpoet.svg';
import { ReactComponent as Mailchimp } from '../../../assets/integrations/mailchimp.svg';
import { ReactComponent as Moosend } from '../../../assets/integrations/moosend.svg';
import { ReactComponent as ConvertKit } from '../../../assets/integrations/convertkit.svg';
import { ReactComponent as GetResponse } from '../../../assets/integrations/getresponse.svg';
import { ReactComponent as Brevo } from '../../../assets/integrations/brevo.svg';
import { ReactComponent as MailerLite } from '../../../assets/integrations/mailerlite.svg';
import { ReactComponent as Email } from '../../../assets/integrations/email.svg';
import { ReactComponent as WebHook } from '../../../assets/integrations/webhook.svg';
import { ReactComponent as Database } from '../../../assets/icons/database.svg';
import {
	post as FrontendPosting,
	login as Login,
	commentAuthorAvatar as Registration,
	lock as Password,
} from '@wordpress/icons';

export const icons = {
	ConvertKit,
	Mailchimp,
	MailPoet,
	Moosend,
	MailerLite,
	GetResponse,
	Brevo,
	Email,
	WebHook,
	FrontendPosting,
	Login,
	Registration,
	Password,
	Database,
};

export const integrations = [
	{
		async: true,
		type: 'email',
		name: 'Email',
		to: '',
		from: '',
		cc: '',
		bcc: '',
		replyTo: '',
		subject: '',
		message: '',
		advanced: false,
	},
	{
		async: true,
		type: 'ConvertKit',
		name: 'ConvertKit',
		apiUrl: 'https://www.convertkit.com/help/where-to-find-the-convertkit-api-key-groupid-and-documentation',
	},
	{
		async: true,
		type: 'GetResponse',
		name: 'GetResponse',
		apiUrl: 'https://www.getresponse.com/help/where-do-i-find-the-api-key.html',
	},
	{
		async: true,
		type: 'Mailchimp',
		name: 'Mailchimp',
		apiUrl: 'https://mailchimp.com/help/about-api-keys/',
	},
	{
		async: true,
		type: 'MailerLite',
		name: 'MailerLite',
		apiUrl: 'https://www.mailerlite.com/help/where-to-find-the-mailerlite-api-key-groupid-and-documentation',
	},
	{
		async: true,
		type: 'MailPoet',
		name: 'MailPoet',
	},
	{
		async: true,
		type: 'Moosend',
		name: 'Moosend',
		apiUrl: 'https://help.moosend.com/hc/en-us/articles/4403735862674-Find-the-API-key-of-your-account',
	},
	{
		async: true,
		type: 'Brevo',
		name: 'Brevo',
		apiUrl: 'https://developers.brevo.com/docs/getting-started',
	},
	{
		async: true,
		type: 'WebHook',
		name: 'WebHook',
		apiUrl: '',
		url: '',
		method: 'POST',
		additionalHeaders: false,
		fields: [],
		headers: [],
	},
	{
		async: false,
		type: 'frontend-posting',
		name: 'FrontendPosting',
		postarr: {
			post_type: 'post',
			post_title: '',
			post_content: '',
			post_excerpt: '',
			tax_input: [],
			meta_input: [],
		},
	},
	{
		async: false,
		type: 'login',
		name: 'Login',
		username: '{{fields.user_login}}',
		password: '{{fields.user_pass}}',
		remember: '{{fields.rememberme}}',
	},
	{
		async: false,
		type: 'registration',
		name: 'Registration',
		reg_type: 'simple',
		user_login: '{{fields.user_login}}',
		user_pass: '{{fields.user_pass}}',
		user_email: '{{fields.user_email}}',
	},
	{
		async: false,
		type: 'password',
		name: 'Password',
	},
];
