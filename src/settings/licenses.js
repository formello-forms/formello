import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import AddonLicense from './addonLicense.js';

const LicensesTab = (props) => {

	const { getSetting } = props;

	const addons = getSetting( 'addon_licenses' );

	const items = []

	for (const addon in addons) {
		items.push( <AddonLicense {...props} key={ addon } title={ addon } license={ addons[addon] } /> )
	}

	return (
		<Fragment>
		<Card>
			<CardHeader>
				<h2>{ __( 'Licenses', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<RawHTML>
					{ sprintf(
						/* translators: Addon licenses link. */
						__(
							'<p>Here you can add license for %s.</p><p>To get your licenses key go to your %s.</p>',
							'formello'
						),
						`<a href="https://formello.net/addons/" target="_blank">addons</a>`,
						`<a href="https://formello.net/account/" target="_blank">account</a>` 
					) }
				</RawHTML>
			</CardBody>
		</Card>
		{items}
		</Fragment>
	);
};

export default withFilters( 'formello.licenses' )( LicensesTab );
