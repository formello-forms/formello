const { applyFilters } = wp.hooks;

export function getActions() {
	const actions = [
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
		},
	];

	applyFilters('formello.actions.list', '', actions);

	return actions;
}
