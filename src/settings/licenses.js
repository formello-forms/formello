import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import AddonLicense from './addonLicense.js';
import { applyFilters } from '@wordpress/hooks';

const LicensesTab = (props) => {

	const { globalSettings } = props;

	const addons = []
	const items = []

	applyFilters( 'formello.AddonsLicenses', '', addons );

	for (const addon in addons) {
		let title = addons[addon].title
		let name = addons[addon].name
		let optionName = 'formello_' + name
		items.push( <AddonLicense {...props} key={ title } title={ title } optionName={ optionName } addonSettings={ globalSettings[ optionName ] } /> )
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
