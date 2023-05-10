import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const IntegrationsTab = ( props ) => {
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
		</Fragment>
	);
};

export default withFilters( 'formello.settings.integrations' )( IntegrationsTab );
