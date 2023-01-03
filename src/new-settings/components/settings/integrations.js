import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import AddonIntegration from './addonIntegration.js';
import { applyFilters } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';

const IntegrationsTab = ( props ) => {
	const { settings, setSettings, setHasUpdates, hasUpdates, showMessage } = props;

	const addons = [];
	const items = [];

	applyFilters( 'formello.AddonIntegration', '', addons );

	for ( const addon in addons ) {
		const title = addons[ addon ].title;
		const name = addons[ addon ].name;
		const icon = addons[ addon ].icon;
		const apiurl = addons[ addon ].apiurl;
		const optionName = 'formello_' + name;
		items.push(
			<AddonIntegration
				{ ...props }
				key={ title }
				icon={ icon }
				title={ title }
				name={ name }
				apiurl={ apiurl }
				optionName={ optionName }
				settings={ settings }
				addonSettings={ settings[ optionName ] }
				setSettings={ setSettings }
			/>
		);
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
