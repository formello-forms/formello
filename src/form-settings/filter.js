import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import {
	getConstraints,
	getFieldsType,
	validate,
} from '../components/merge-tags/functions';

function validateAll( edits ) {
	const postType = select( 'core/editor' ).getCurrentPostType();

	if ( 'formello_form' !== postType ) {
		return Promise.resolve( edits );
	}

	const validation = validate();

	// if form is empty, always valid.
	if ( ! validation.names.length ) {
		return Promise.resolve( edits );
	}

	if ( ! validation.buttons.length ) {
		return Promise.reject( {
			message: __( 'Missing button', 'formello' ),
		} );
	}

	if ( validation.buttons.length > 1 ) {
		return Promise.reject( {
			message: __( 'You have more than one button', 'formello' ),
		} );
	}

	if ( validation.names.some( ( item ) => item === undefined ) ) {
		return Promise.reject( {
			message: __( 'One or more fields have no name', 'formello' ),
		} );
	}

	return Promise.resolve( edits );
}

addFilter( 'editor.preSavePost', 'editor', ( edits ) => validateAll( edits ) );

addFilter( 'editor.preSavePost', 'editor', ( edits ) => {
	const postType = select( 'core/editor' ).getCurrentPostType();
	const meta = select( 'core/editor' ).getCurrentPostAttribute( 'meta' );
	//const meta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );

	if ( 'formello_form' === postType ) {
		const fields = getFieldsType();
		const constraints = getConstraints();

		let newEdits;

		// There are already meta edits?
		if ( edits.meta ) {
			newEdits = {
				...edits,
				meta: {
					...edits.meta,
					_formello_settings: {
						...edits.meta._formello_settings,
						constraints,
						fields,
					},
				},
			};
		} else {
			// Add our meta if they're not there
			const newMeta = {
				...meta,
				_formello_settings: {
					...meta._formello_settings,
					constraints,
					fields,
				},
			};
			newEdits = {
				...edits,
				meta: newMeta,
			};
		}

		return Promise.resolve( newEdits );
	}

	return Promise.resolve( edits );
} );
