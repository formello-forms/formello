import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import AddonIntegration from './addonIntegration.js';
import { applyFilters } from '@wordpress/hooks';

const IntegrationsTab = (props) => {

	const { globalSettings } = props;

	const addons = []
	const items = []

	applyFilters( 'formello.AddonIntegration', '', addons );

	for (const addon in addons) {
		let title = addons[addon].title
		let name = addons[addon].name
		let optionName = 'formello_' + name
		items.push( <AddonIntegration {...props} key={ title } title={ title } name={ name } optionName={ optionName } addonSettings={ globalSettings[ optionName ] } /> )
	}

	return (
		<Fragment>
		<Card>
			<CardHeader>
				<h2>{ __( 'Integrations', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<RawHTML>
					{ sprintf(
						/* translators: Link to addons. */
						__(
							'<p>Go to %s to download your preferred integrations. We are working on other integrations.</p>',
							'formello'
						),
						`<a href="https://formello.net/addons/" target="_blank">addons page</a>`
					) }
				</RawHTML>
			</CardBody>
		</Card>
		{ items }
		</Fragment>
	);
};

export default withFilters( 'formello.settings' )( IntegrationsTab );
