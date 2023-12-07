/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import {
	store as coreStore,
	getLastEntityDeleteError,
} from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalText as Text,
	Button,
} from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash } from '@wordpress/icons';

export const trashSubmissionAction = {
	id: 'move-to-trash',
	label: __( 'Move to Trash' ),
	isPrimary: true,
	isBulk: true,
	icon: trash,
	isEligible( { status } ) {
		return status !== 'trash';
	},
	hideModalHeader: true,
	RenderModal: ( { items: submissions, closeModal } ) => {
		const { createSuccessNotice, createErrorNotice } =
			useDispatch( noticesStore );
		const { deleteEntityRecord } = useDispatch( coreStore );
		return (
			<VStack spacing="5">
				<Text>
					{ submissions.length > 1
						? sprintf(
								// translators: %s: The number of submissions (always plural).
								__(
									'Are you sure you want to delete %s submissions?'
								),
								decodeEntities( submissions.length )
						  )
						: sprintf(
								// translators: %s: The page's title.
								__(
									'Are you sure you want to delete submission N° %s?'
								),
								decodeEntities(
									submissions && submissions[ 0 ]?.id
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
									submissions.map( async ( post ) => {
										deleteEntityRecord(
											'formello/v1',
											'submissions',
											post.id,
											{},
											{ throwOnError: true }
										);
									} )
								);
								createSuccessNotice(
									submissions.length > 1
										? __(
												'The selected submissions were moved to the trash.'
										  )
										: sprintf(
												/* translators: The page's title. */
												__(
													'"%s" moved to the Trash.'
												),
												decodeEntities(
													submissions[ 0 ].title
														.rendered
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
												submissions.length
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
