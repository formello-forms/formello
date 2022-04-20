import {
	TextControl,
	Card,
	CardHeader,
	CardBody,
	withFilters,
	SlotFillProvider,
	Slot,
	Fill
} from '@wordpress/components';

import {
	RawHTML,
	Fragment
} from '@wordpress/element';

import {
	applyFilters
} from '@wordpress/hooks';

import { __, sprintf } from '@wordpress/i18n';

const IntegrationsTab = ( props ) => {

	const {
		getSetting,
		changeSettings
	} = props;

	return (

		<Card>

			<CardHeader>
				<h2>{ __( 'Integrations', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<RawHTML>
					{ sprintf(
						__( '<p>Go to %s to download your preferred integrations. We are working on other integrations.</p>', 'formello' ),
						`<a href="https://formello.net/addons/" target="_blank">addons page</a>` )
					}
				</RawHTML>

			</CardBody>


		</Card>
			
	);

};

export default withFilters( 'formello.settings' )( IntegrationsTab );
