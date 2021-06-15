const {
	applyFilters,
} = wp.hooks;
import getIcon from '../../../utils/get-icon';

export function getActions(){
	let actions = [
		{
			type: 'email',
			title: 'Email',
			to: '',
			from: '',
			replyTo: '',
			subject: '',
			message: '',
			active: true
		},
		{
			type: 'mailchimp',
			title: 'Mailchimp',
			key: '',
			list: '',
			email_address: '',
			merge_fields: {},
			active: false
		},
		{
			type: 'webhooks',
			title: 'Web Hooks',
			url: '',
			method: 'POST',
			options: [],
			active: false
		}
	]

	return applyFilters( 'formello.actions.list', '', actions )

}