import {
	TextControl,
	Card,
	CardHeader,
	CardBody
} from '@wordpress/components';

import {
	RawHTML,
	Fragment
} from '@wordpress/element';

const {
	applyFilters,
} = wp.hooks;

import { __, sprintf } from '@wordpress/i18n';

export default function integrations( props ) {

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
						__( '<p>Go to %s to download your preferred integrations. We are working on other integrations. A lot more will be available soon.</p>', 'formello' ),
						`<a href="https://formello.net/addons/" target="_blank">addons page</a>` )
					}
				</RawHTML>

			</CardBody>

			{ applyFilters( 'formello.dashboard.integrations', '', props ) }

		</Card>

	);

};