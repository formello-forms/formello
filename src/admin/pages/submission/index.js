/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';
import {
	__experimentalUseNavigator as useNavigator,
	__experimentalGrid as Grid,
	Spinner,
	Button,
	Notice,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import { getQueryArg } from '@wordpress/url';
import { SubmissionData } from './submission-data';
import { FieldsData } from './fields-data';
import Header from '../../components/masthead.js';
import { useDispatch } from '@wordpress/data';

export const Submission = () => {
	const { params, goBack } = useNavigator();

	const submission = useEntityRecord(
		'formello/v1',
		'submissions',
		params.id || getQueryArg( window.location.href, 'submission_id' )
	);
	const { saveEntityRecord } = useDispatch( coreStore );

	useEffect( () => {
		if ( parseInt( submission.record.details.is_new ) ) {
			saveEntityRecord( 'formello/v1', 'submissions', {
				id: submission.record.id,
				details: { is_new: false },
			} );
		}
	}, [] );

	if ( 'ERROR' === submission.status ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				<p>{ __( 'Submission Not Found.', 'formello' ) }</p>
				<Button
					variant="primary"
					size="small"
					icon={ 'arrow-left' }
					onClick={ goBack }
				>
					{ __( 'Go back', 'formello' ) }
				</Button>
			</Notice>
		);
	}

	return (
		<Fragment>
			<Header
				title={ sprintf(
					/* Translators: %d The submission id. */
					__( 'Submission %d', 'formello' ),
					params.id
				) }
				className="full-width"
			>
				<Button
					variant="primary"
					size="small"
					icon={ 'arrow-left' }
					onClick={ goBack }
				>
					{ __( 'Go back', 'formello' ) }
				</Button>
			</Header>
			{ submission.isResolving && <Spinner /> }
			{ submission.hasResolved && (
				<div className="formello-submission">
					<Grid
						columns={ 4 }
						templateColumns="3fr 1fr"
						gap="4"
						className="formello-content"
					>
						<div className="first-column">
							<FieldsData data={ submission.record.fields } />
						</div>
						<SubmissionData data={ submission.record.details } />
					</Grid>
				</div>
			) }
		</Fragment>
	);
};
