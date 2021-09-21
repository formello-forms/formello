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
			cc: '',
			bcc: '',
			replyTo: '',
			subject: '',
			message: '',
			active: true
		}
	]

	applyFilters( 'formello.actions.list', '', actions )

	return actions

}