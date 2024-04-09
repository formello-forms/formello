/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import {
	store as coreStore,
	getLastEntityDeleteError,
} from '@wordpress/core-data';
import { __, sprintf, _n } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalText as Text,
	Button,
} from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { external, trash, backup } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

export const trashPostAction = {
	id: 'move-to-trash',
	label: __( 'Move to Trash' ),
	isPrimary: true,
	supportsBulk: true,
	icon: trash,
	isEligible( { status } ) {
		return status !== 'trash';
	},
	hideModalHeader: true,
	RenderModal: ( { items: posts, closeModal } ) => {
		const { createSuccessNotice, createErrorNotice } =
			useDispatch( noticesStore );
		const { deleteEntityRecord } = useDispatch( coreStore );
		return (
			<VStack spacing="5">
				<Text>
					{ posts.length > 1
						? sprintf(
								// translators: %s: The number of posts (always plural).
								__(
									'Are you sure you want to delete %s posts?'
								),
								decodeEntities( posts.length )
						  )
						: sprintf(
								// translators: %s: The page's title.
								__( 'Are you sure you want to delete "%s"?' ),
								decodeEntities(
									posts && posts[ 0 ]?.title?.rendered
								)
						  ) }
				</Text>
				<HStack justify="right">
					<Button variant="tertiary" onClick={ closeModal }>
						{ __( 'Cancel' ) }
					</Button>
					<Button
						variant="primary"
						onClick={ async () => {
							try {
								await Promise.all(
									posts.map( async ( post ) => {
										deleteEntityRecord(
											'postType',
											post.type,
											post.id,
											{},
											{ throwOnError: true }
										);
									} )
								);
								createSuccessNotice(
									posts.length > 1
										? __(
												'The selected posts were moved to the trash.'
										  )
										: sprintf(
												/* translators: The page's title. */
												__(
													'"%s" moved to the Trash.'
												),
												decodeEntities(
													posts[ 0 ].title.rendered
												)
										  ),
									{
										type: 'snackbar',
										id: 'edit-site-page-trashed',
									}
								);
							} catch ( error ) {
								const errorMessage =
									error.message &&
									error.code !== 'unknown_error'
										? error.message
										: _n(
												'An error occurred while moving the page to the trash.',
												'An error occurred while moving the pages to the trash.',
												posts.length
										  );

								createErrorNotice( errorMessage, {
									type: 'snackbar',
								} );
							}
						} }
					>
						{ __( 'Delete' ) }
					</Button>
				</HStack>
			</VStack>
		);
	},
};

export function usePermanentlyDeletePostAction() {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );
	const { deleteEntityRecord } = useDispatch( coreStore );

	return useMemo(
		() => ( {
			id: 'permanently-delete',
			label: __( 'Permanently delete' ),
			isPrimary: true,
			icon: trash,
			isEligible( { status } ) {
				return status === 'trash';
			},
			async callback( post ) {
				try {
					await deleteEntityRecord(
						'postType',
						post.type,
						post.id,
						{ force: true },
						{ throwOnError: true }
					);
					createSuccessNotice(
						sprintf(
							/* translators: The posts's title. */
							__( '"%s" permanently deleted.' ),
							decodeEntities( post.title.rendered )
						),
						{
							type: 'snackbar',
							id: 'edit-site-post-permanently-deleted',
						}
					);
				} catch ( error ) {
					const errorMessage =
						error.message && error.code !== 'unknown_error'
							? error.message
							: __(
									'An error occurred while permanently deleting the post.'
							  );

					createErrorNotice( errorMessage, { type: 'snackbar' } );
				}
			},
		} ),
		[ createSuccessNotice, createErrorNotice, deleteEntityRecord ]
	);
}

export function useRestorePostAction() {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );
	const { editEntityRecord, saveEditedEntityRecord } =
		useDispatch( coreStore );

	return useMemo(
		() => ( {
			id: 'restore',
			label: __( 'Restore' ),
			isPrimary: true,
			icon: backup,
			isEligible( { status } ) {
				return status === 'trash';
			},
			async callback( post ) {
				await editEntityRecord( 'postType', post.type, post.id, {
					status: 'draft',
				} );
				try {
					await saveEditedEntityRecord(
						'postType',
						post.type,
						post.id,
						{ throwOnError: true }
					);
					createSuccessNotice(
						sprintf(
							/* translators: The posts's title. */
							__( '"%s" has been restored.' ),
							decodeEntities( post.title.rendered )
						),
						{
							type: 'snackbar',
							id: 'edit-site-post-restored',
						}
					);
				} catch ( error ) {
					const errorMessage =
						error.message && error.code !== 'unknown_error'
							? error.message
							: __(
									'An error occurred while restoring the post.'
							  );

					createErrorNotice( errorMessage, { type: 'snackbar' } );
				}
			},
		} ),
		[
			createSuccessNotice,
			createErrorNotice,
			editEntityRecord,
			saveEditedEntityRecord,
		]
	);
}

export const viewPostAction = {
	id: 'view-post',
	label: __( 'View' ),
	isPrimary: true,
	icon: external,
	isEligible( post ) {
		return post.status !== 'trash';
	},
	callback( post ) {
		document.location.href = post.link;
	},
};

export function useEditPostAction() {
	return useMemo(
		() => ( {
			id: 'edit-post',
			label: __( 'Edit' ),
			isEligible( { status } ) {
				return status !== 'trash';
			},
			callback( post ) {
				const href = addQueryArgs( 'post.php', {
					post: post.id,
					action: 'edit',
				} );
				document.location.href = href;
			},
		} ),
		[]
	);
}
export const postRevisionsAction = {
	id: 'view-post-revisions',
	label: __( 'View revisions' ),
	isPrimary: false,
	isEligible: ( post ) => {
		if ( post.status === 'trash' ) {
			return false;
		}
		const lastRevisionId =
			post?._links?.[ 'predecessor-version' ]?.[ 0 ]?.id ?? null;
		const revisionsCount =
			post?._links?.[ 'version-history' ]?.[ 0 ]?.count ?? 0;
		return lastRevisionId && revisionsCount > 1;
	},
	callback( post ) {
		const href = addQueryArgs( 'revision.php', {
			revision: post?._links?.[ 'predecessor-version' ]?.[ 0 ]?.id,
		} );
		document.location.href = href;
	},
};

export const deleteItem = {
	id: 'delete-item',
	label: __( 'Delete form', 'tropical-juice' ),
	isPrimary: false,
	isDestructive: true,
	icon: trash,
	hideModalHeader: true,
	RenderModal: ( { item: form, closeModal } ) => {
		const { deleteEntityRecord } = useDispatch( coreStore );
		const { createSuccessNotice, createErrorNotice } =
			useDispatch( noticesStore );

		const handleDelete = async () => {
			const success = await deleteEntityRecord(
				'tropical-juice/v1',
				'forms',
				form.id
			);
			if ( success ) {
				// Tell the user the operation succeeded:
				createSuccessNotice( 'The form was deleted!', {
					type: 'snackbar',
				} );
			} else {
				const lastError = getLastEntityDeleteError(
					'postType',
					'page',
					form.id
				);
				const message =
					( lastError?.message || 'There was an error.' ) +
					' Please refresh the page and try again.';
				// Tell the user how exactly the operation have failed:
				createErrorNotice( message, {
					type: 'snackbar',
				} );
			}
		};

		const { isDeleting } = useSelect(
			( select ) => ( {
				isDeleting: select( coreStore ).isDeletingEntityRecord(
					'tropical-juice/v1',
					'forms',
					form.id
				),
			} ),
			[ form.id ]
		);

		return (
			<VStack spacing="5">
				<Text>
					{ sprintf(
						// translators: %s: The form to removee.
						__(
							'Are you sure you want to delete form url: "%s"?',
							'formello'
						),
						decodeEntities( form.attributes.url )
					) }
				</Text>
				<HStack justify="right">
					<Button variant="tertiary" onClick={ closeModal }>
						{ __( 'Cancel' ) }
					</Button>
					<Button
						variant="primary"
						onClick={ () => handleDelete( form ) }
						isBusy={ isDeleting }
						disabled={ isDeleting }
					>
						{ __( 'Delete' ) }
					</Button>
				</HStack>
			</VStack>
		);
	},
};
