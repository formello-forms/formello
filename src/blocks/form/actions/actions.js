import { applyFilters } from '@wordpress/hooks';
import { ReactComponent as Icon } from '../../../../assets/integrations/email.svg';

export function getActions() {
	const actions = [
		{
			icon: Icon,
			type: 'email',
			title: 'Email',
			async: true,
			to: '',
			from: '',
			cc: '',
			bcc: '',
			replyTo: '',
			subject: '',
			message: '',
		},
	];

	applyFilters( 'formello.actions.list', '', actions );

	return actions;
}
