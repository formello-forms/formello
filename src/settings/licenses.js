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

const LicensesTab = ( props ) => {

	const {
		getSetting,
		changeSettings
	} = props;

	return (

		<Card>

			<CardHeader>
				<h2>{ __( 'Licenses', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<RawHTML>
					{ sprintf(
						__( '<p>Here you can add license for %s.</p>', 'formello' ),
						`<a href="https://formello.net/addons/" target="_blank">addons</a>` )
					}
				</RawHTML>

			</CardBody>


		</Card>
			
	);

};

export default withFilters( 'formello.licenses' )( LicensesTab );
