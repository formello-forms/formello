import { Formello } from './form';
import Bouncer from 'formbouncerjs'

var validate = new Bouncer('.wp-block-formello-form', {
	disableSubmit: true
});

document.addEventListener('DOMContentLoaded', function () {
	const forms = document.querySelectorAll('.wp-block-formello-form');

	if (!forms.length) {
		return;
	}

	forms.forEach((block) => {
		new Formello(block);
	});
});


