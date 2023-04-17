/**
 * WordPress dependencies
 */
import {
	store as coreStore,
	useResourcePermissions,
} from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default function useForm( ref ) {
	const permissions = useResourcePermissions( 'formello_form', ref );

	return useSelect(
		( select ) => {
			const {
				canCreate,
				canUpdate,
				canDelete,
				isResolving,
				hasResolved,
			} = permissions;

			const {
				formelloForms,
				isResolvingFormelloForms,
				hasResolvedFormelloForms,
			} = selectForms( select );

			const {
				formelloForm,
				isFormelloFormResolved,
				isFormelloFormMissing,
			} = selectExistingForm( select, ref );

			return {
				formelloForms,
				isResolvingFormelloForms,
				hasResolvedFormelloForms,

				formelloForm,
				isFormelloFormResolved,
				isFormelloFormMissing,

				canSwitchFormelloForm: ref
					? formelloForms?.length > 1
					: formelloForms?.length > 0,

				canUserCreateFormelloForm: canCreate,
				isResolvingCanUserCreateFormelloForm: isResolving,
				hasResolvedCanUserCreateFormelloForm: hasResolved,

				canUserUpdateFormelloForm: canUpdate,
				hasResolvedCanUserUpdateFormelloForm: ref
					? hasResolved
					: undefined,

				canUserDeleteFormelloForm: canDelete,
				hasResolvedCanUserDeleteFormelloForm: ref
					? hasResolved
					: undefined,
			};
		},
		[ ref, permissions ]
	);
}

function selectForms( select ) {
	const { getEntityRecords, hasFinishedResolution, isResolving } =
		select( coreStore );

	const args = [
		'postType',
		'formello_form',
		{ per_page: -1, status: [ 'formello-private', 'formello-trash' ] },
	];
	return {
		formelloForms: getEntityRecords( ...args ),
		isResolvingFormelloForms: isResolving( 'getEntityRecords', args ),
		hasResolvedFormelloForms: hasFinishedResolution(
			'getEntityRecords',
			args
		),
	};
}

function selectExistingForm( select, ref ) {
	if ( ! ref ) {
		return {
			isFormelloFormResolved: false,
			isFormelloFormMissing: true,
		};
	}

	const { getEntityRecord, getEditedEntityRecord, hasFinishedResolution } =
		select( coreStore );

	const args = [ 'postType', 'formello_form', ref ];
	const formelloForm = getEntityRecord( ...args );
	const editedFormelloForm = getEditedEntityRecord( ...args );
	const hasResolvedFormelloForm = hasFinishedResolution(
		'getEditedEntityRecord',
		args
	);

	// Only private Formello forms are considered valid.
	// Draft Formello forms are valid only on the editor,
	// requiring a post update to publish to show in frontend.
	// To achieve that, index.php must reflect this validation only for published.
	const isFormelloFormPublishedOrTrash =
		editedFormelloForm.status === 'formello-private' ||
		editedFormelloForm.status === 'formello-trash';

	return {
		isFormelloFormResolved: hasResolvedFormelloForm,
		isFormelloFormMissing:
			hasResolvedFormelloForm &&
			( ! formelloForm || ! isFormelloFormPublishedOrTrash ),

		// getEditedEntityRecord will return the post regardless of status.
		// Therefore if the found post is not published then we should ignore it.
		formelloForm: isFormelloFormPublishedOrTrash
			? editedFormelloForm
			: null,
	};
}
