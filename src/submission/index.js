/**
 * WordPress dependencies
 */
import {
	store as coreStore,
	useEntityRecord,
} from '@wordpress/core-data';
import {
	__experimentalGrid as Grid,
	Spinner,
	Button,
	Notice,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { render, useState } from '@wordpress/element';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import { SubmissionData } from './submission-data';
import { FieldsData } from './fields-data';

/**
 * Add our custom entities for retrieving external setting and variable data.
 *
 * @since 2.0
 */
dispatch( coreStore ).addEntities( [
	{
		label: __( 'Formello Submission', 'formello' ),
		kind: 'formello/v1',
		name: 'submission',
		baseURL: '/formello/v1/submission',
	},
] );

const MyButton = ( backUrl ) => {
	return (
		<Button
			variant={ 'secondary' }
			icon={ 'arrow-left' }
			href={ backUrl }
			isSmall
		>
			{ __( 'Back to submissions list', 'formello' ) }
		</Button>
	);
};

const Submission = () => {
	const [ id ] = useState( getQueryArg( window.location.href, 'submission_id' ) );

	const submission = useEntityRecord( 'formello/v1', 'submission', id );

	const backUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello_form',
		page: 'formello-submissions',
		form_id: getQueryArg( window.location.href, 'form_id' ),
		paged: getQueryArg( window.location.href, 'paged' ),
	} );

	if ( ! submission.hasResolved ) {
		return <Spinner />;
	}

	if ( 'ERROR' === submission.status ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				<p>{ __( 'Submission Not Found.', 'formello' ) }</p>
				{ MyButton( backUrl ) }
			</Notice>
		);
	}

	return (
		<div className="wrap formello-submission">

			<div className="masthead">
				<h1 className="wp-heading-inline">
					{ sprintf(
						/* Translators: %d The submission id. */
						__( 'Submission %d', 'formello' ), id )
					}
				</h1>

				{ MyButton( backUrl ) }
			</div>

			<hr />

			<Grid columns={ 4 } templateColumns="3fr 1fr" gap="4">
				<div className="first-column">
					<FieldsData data={ submission.record } backUrl={ backUrl } />
					<div>
						{ MyButton( backUrl ) }
					</div>
				</div>
				<SubmissionData data={ submission.record } />
			</Grid>

		</div>
	);
};

window.addEventListener( 'DOMContentLoaded', () => {
	render( <Submission />, document.getElementById( 'formello-submission' ) );
} );
