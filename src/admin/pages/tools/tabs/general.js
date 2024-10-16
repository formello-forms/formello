import {
	Card,
	CardHeader,
	CardBody,
	Button,
	CardDivider,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import ResetSettings from '../components/reset-settings';

const DefaultCPTView = () => {
	const defaultUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello',
	} );

	return (
		<Fragment>
			<p>
				{ __(
					'If for some reason you need to manage the popups with default custom post type table, please click on the link below.',
					'formello'
				) }
			</p>
			<Button
				text={ __( 'Default CPT view' ) }
				href={ defaultUrl }
				variant="primary"
			/>
		</Fragment>
	);
};

export default function General() {
	return (
		<div>
			<Card>
				<CardHeader>
					<h2>{ __( 'General', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<ResetSettings />
					<CardDivider />
					<DefaultCPTView />
				</CardBody>
			</Card>
		</div>
	);
}
