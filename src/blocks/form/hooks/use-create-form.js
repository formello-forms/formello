/**
 * WordPress dependencies
 */
import { serialize } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useCallback } from '@wordpress/element';

export const CREATE_FORM_SUCCESS = 'success';
export const CREATE_FORM_ERROR = 'error';
export const CREATE_FORM_PENDING = 'pending';
export const CREATE_FORM_IDLE = 'idle';

export default function useCreateForm() {
	const [ status, setStatus ] = useState( CREATE_FORM_IDLE );
	const [ value, setValue ] = useState( null );
	const [ error, setError ] = useState( null );

	const { saveEntityRecord, editEntityRecord } = useDispatch( coreStore );

	// This callback uses data from the two placeholder steps and only creates
	// a new Form when the user completes the final step.
	const create = useCallback(
		async ( title = null, blocks = [], postStatus = 'formello-private' ) => {
			// Guard against creating Forms without a title.
			// Note you can pass no title, but if one is passed it must be
			// a string otherwise the title may end up being empty.
			if ( title && typeof title !== 'string' ) {
				setError(
					'Invalid title supplied when creating Form.'
				);
				setStatus( CREATE_FORM_ERROR );
				throw new Error(
					`Value of supplied title argument was not a string.`
				);
			}

			setStatus( CREATE_FORM_PENDING );
			setValue( null );
			setError( null );

			const record = {
				title,
				content: serialize( blocks ),
				status: postStatus,
				excerpt: '',
			};

			// Return affords ability to await on this function directly
			return saveEntityRecord( 'postType', 'formello_form', record )
				.then( ( response ) => {
					setValue( response );
					setStatus( CREATE_FORM_SUCCESS );

					// Set the status to publish so that the Form block
					// shows up in the multi entity save flow.
					if ( postStatus !== 'formello-private' ) {
						editEntityRecord(
							'postType',
							'formello_form',
							response.id,
							{
								title: 'Form-' + response.id,
								status: 'formello-private',
							}
						);
					}

					return response;
				} )
				.catch( ( err ) => {
					setError( err?.message );
					setStatus( CREATE_FORM_ERROR );
					throw new Error( 'Unable to save new Form', {
						cause: err,
					} );
				} );
		},
		[ saveEntityRecord, editEntityRecord ]
	);

	return {
		create,
		status,
		value,
		error,
		isIdle: status === CREATE_FORM_IDLE,
		isPending: status === CREATE_FORM_PENDING,
		isSuccess: status === CREATE_FORM_SUCCESS,
		isError: status === CREATE_FORM_ERROR,
	};
}
