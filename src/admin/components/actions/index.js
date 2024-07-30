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

function getItemTitle( item ) {
	if ( typeof item.title === 'string' ) {
		return decodeEntities( item.title );
	}
	return decodeEntities( item.title?.rendered || '' );
}

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
			supportsBulk: true,
			isEligible( { status } ) {
				return status === 'trash';
			},
			async callback( posts, onActionPerformed ) {
				const promiseResult = await Promise.allSettled(
					posts.map( ( post ) => {
						return deleteEntityRecord(
							'postType',
							post.type,
							post.id,
							{ force: true },
							{ throwOnError: true }
						);
					} )
				);
				// If all the promises were fulfilled with success.
				if (
					promiseResult.every(
						( { status } ) => status === 'fulfilled'
					)
				) {
					let successMessage;
					if ( promiseResult.length === 1 ) {
						successMessage = sprintf(
							/* translators: The posts's title. */
							__( '"%s" permanently deleted.' ),
							getItemTitle( posts[ 0 ] )
						);
					} else {
						successMessage = __(
							'The posts were permanently deleted.'
						);
					}
					createSuccessNotice( successMessage, {
						type: 'snackbar',
						id: 'edit-site-post-permanently-deleted',
					} );
					if ( onActionPerformed ) {
						onActionPerformed( posts );
					}
				} else {
					// If there was at lease one failure.
					let errorMessage;
					// If we were trying to permanently delete a single post.
					if ( promiseResult.length === 1 ) {
						if ( promiseResult[ 0 ].reason?.message ) {
							errorMessage = promiseResult[ 0 ].reason.message;
						} else {
							errorMessage = __(
								'An error occurred while permanently deleting the post.'
							);
						}
						// If we were trying to permanently delete multiple posts
					} else {
						const errorMessages = new Set();
						const failedPromises = promiseResult.filter(
							( { status } ) => status === 'rejected'
						);
						for ( const failedPromise of failedPromises ) {
							if ( failedPromise.reason?.message ) {
								errorMessages.add(
									failedPromise.reason.message
								);
							}
						}
						if ( errorMessages.size === 0 ) {
							errorMessage = __(
								'An error occurred while permanently deleting the posts.'
							);
						} else if ( errorMessages.size === 1 ) {
							errorMessage = sprintf(
								/* translators: %s: an error message */
								__(
									'An error occurred while permanently deleting the posts: %s'
								),
								[ ...errorMessages ][ 0 ]
							);
						} else {
							errorMessage = sprintf(
								/* translators: %s: a list of comma separated error messages */
								__(
									'Some errors occurred while permanently deleting the posts: %s'
								),
								[ ...errorMessages ].join( ',' )
							);
						}
					}
					createErrorNotice( errorMessage, {
						type: 'snackbar',
					} );
				}
			},
		} ),
		[ createSuccessNotice, createErrorNotice, deleteEntityRecord ]
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

export const editPostAction = {
	id: 'edit-post',
	label: __( 'Edit' ),
	isPrimary: false,
	isEligible( { status } ) {
		return status !== 'trash';
	},
	callback( posts, onActionPerformed ) {
		const post = posts[ 0 ];
		const href = addQueryArgs( 'post.php', {
			post: post.id,
			action: 'edit',
		} );
		document.location.href = href;
		if ( onActionPerformed ) {
			onActionPerformed( posts );
		}
	},
};

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
			supportsBulk: true,
			isEligible( { status } ) {
				return status === 'trash';
			},
			async callback( posts, onActionPerformed ) {
				try {
					for ( const post of posts ) {
						await editEntityRecord(
							'postType',
							post.type,
							post.id,
							{
								status: 'draft',
							}
						);
						await saveEditedEntityRecord(
							'postType',
							post.type,
							post.id,
							{ throwOnError: true }
						);
					}

					createSuccessNotice(
						posts.length > 1
							? sprintf(
									/* translators: The number of posts. */
									__( '%d posts have been restored.' ),
									posts.length
							  )
							: sprintf(
									/* translators: The number of posts. */
									__( '"%s" has been restored.' ),
									getItemTitle( posts[ 0 ] )
							  ),
						{
							type: 'snackbar',
							id: 'edit-site-post-restored',
						}
					);
					if ( onActionPerformed ) {
						onActionPerformed( posts );
					}
				} catch ( error ) {
					let errorMessage;
					if (
						error.message &&
						error.code !== 'unknown_error' &&
						error.message
					) {
						errorMessage = error.message;
					} else if ( posts.length > 1 ) {
						errorMessage = __(
							'An error occurred while restoring the posts.'
						);
					} else {
						errorMessage = __(
							'An error occurred while restoring the post.'
						);
					}

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
