export const config = {
	bouncer: {
		disableSubmit: true,
		customValidations: {
			valueMismatch( field ) {
				// Look for a selector for a field to compare
				// If there isn't one, return false (no error)
				const selector = field.getAttribute( 'data-bouncer-match' );
				if ( ! selector ) {
					return false;
				}

				// Get the field to compare
				const otherField = field.form.querySelector(
					'[name=' + selector + ']'
				);
				if ( ! otherField ) {
					return false;
				}

				// Compare the two field values
				// We use a negative comparison here because if they do match, the field validates
				// We want to return true for failures, which can be confusing
				return otherField.value !== field.value;
			},
		},
		messageCustom: 'data-bouncer-message', // The data attribute to use for custom error messages
		messages: {
			valueMismatch( field ) {
				const customMessage = field.getAttribute(
					'data-bouncer-mismatch-message'
				);
				return customMessage
					? customMessage
					: 'Please make sure the fields match.';
			},
		},
	},
	tinyMce: {
		selector: 'textarea.formello-advanced',
		setup: ( editor ) => {
			editor.on( 'change', () => {
				window.tinymce.triggerSave();
			} );
		},
		menubar: false,
		plugins: [
			'advlist autolink lists link image charmap print preview anchor',
			'searchreplace visualblocks code fullscreen',
			'insertdatetime media table paste code help wordcount',
		],
		toolbar:
			'formatselect | ' +
			'bold italic underline | bullist numlist  | ' +
			'alignleft aligncenter alignright alignjustify | link unlink | undo redo',
		content_style:
			'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
	},
};
