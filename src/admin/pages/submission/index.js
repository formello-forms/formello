/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';
import {
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
import { useHistory, useLocation } from '../../router';

export const Submission = () => {
	const history = useHistory();
	const { params } = useLocation();

	const submission = useEntityRecord(
		'formello/v1',
		'submissions',
		params.submission_id ||
			getQueryArg( window.location.href, 'submission_id' )
	);

	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch( coreStore );

	useEffect( () => {
		if ( parseInt( submission.record?.details.is_new ) ) {
			saveEntityRecord( 'formello/v1', 'submissions', {
				id: submission.record.id,
				details: { is_new: false },
			} );
			invalidateResolutionForStore();
		}
	}, [] );

	if ( 'ERROR' === submission.status ) {
		return (
			<Fragment>
				<Header
					title={ sprintf(
						/* Translators: %d The submission id. */
						__( 'Submission %d', 'formello' ),
						params.submission_id
					) }
					className="full-width"
				></Header>
				<div className="formello-content">
					<Notice status="warning" isDismissible={ false }>
						<p>{ __( 'Submission Not Found.', 'formello' ) }</p>
						<Button
							variant="primary"
							size="small"
							icon={ 'arrow-left' }
							onClick={ () => {
								history.push( {
									page: 'formello',
									section: 'submissions',
								} );
							} }
						>
							{ __( 'Go back', 'formello' ) }
						</Button>
					</Notice>
				</div>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Header
				title={ sprintf(
					/* Translators: %d The submission id. */
					__( 'Submission %d', 'formello' ),
					params.submission_id
				) }
				className="full-width"
			>
				<Button
					variant="primary"
					size="small"
					icon={ 'arrow-left' }
					onClick={ () => {
						history.push( {
							page: 'formello',
							section: submission.record?.details.form_id
								? 'submissions'
								: '',
							form_id: submission.record?.details.form_id,
						} );
					} }
				>
					{ __( 'Go back', 'formello' ) }
				</Button>
			</Header>
			{ submission.isResolving && <Spinner /> }
			{ submission.hasResolved && submission.record && (
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
