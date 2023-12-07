/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useEntityRecord } from '@wordpress/core-data';
import {
	__experimentalUseNavigator as useNavigator,
	__experimentalGrid as Grid,
	Spinner,
	Button,
	Notice,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { getQueryArg } from '@wordpress/url';
import { SubmissionData } from './submission-data';
import { FieldsData } from './fields-data';
import Header from '../../components/masthead.js';

export const Submission = () => {
	const { params, goBack } = useNavigator();

	const submission = useEntityRecord(
		'formello/v1',
		'submissions',
		params.id || getQueryArg( window.location.href, 'submission_id' )
	);

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
