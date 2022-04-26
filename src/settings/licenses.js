import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { RawHTML } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const LicensesTab = () => {
	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Licenses', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<RawHTML>
					{ sprintf(
						/* translators: Addon licenses link. */
						__(
							'<p>Here you can add license for %s.</p>',
							'formello'
						),
						`<a href="https://formello.net/addons/" target="_blank">addons</a>`
					) }
				</RawHTML>
			</CardBody>
		</Card>
	);
};

export default withFilters( 'formello.licenses' )( LicensesTab );
