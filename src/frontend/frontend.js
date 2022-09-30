import { Formello } from './form';
import Bouncer from 'formbouncerjs';

new Bouncer( '.wp-block-formello-form', {
	disableSubmit: true,
	customValidations: {
		valueMismatch: function (field) {

			// Look for a selector for a field to compare
			// If there isn't one, return false (no error)
			var selector = field.getAttribute('data-bouncer-match');
			if (!selector) return false;

			// Get the field to compare
			var otherField = field.form.querySelector( '[name=' + selector + ']' );
			if (!otherField) return false;

			// Compare the two field values
			// We use a negative comparison here because if they do match, the field validates
			// We want to return true for failures, which can be confusing
			return otherField.value !== field.value;

		}
	},
	messages: {
		missingValue: formello.settings.messages.missingValue,
		patternMismatch: formello.settings.messages.patternMismatch,
		outOfRange: formello.settings.messages.outOfRange,
		wrongLength: formello.settings.messages.wrongLength,
		valueMismatch: function (field) {
			var customMessage = field.getAttribute('data-bouncer-mismatch-message');
			return customMessage ? customMessage : 'Please make sure the fields match.'
		}
	}
} );

document.addEventListener( 'DOMContentLoaded', function() {
	const forms = document.querySelectorAll( '.wp-block-formello-form' );

	if ( ! forms.length ) {
		return;
	}

	forms.forEach( ( block ) => {
		new Formello( block );
	} );
} );
