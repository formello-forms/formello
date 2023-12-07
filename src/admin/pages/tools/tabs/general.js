import { Card, CardHeader, CardBody, CardDivider } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import ReSync from '../components/resync-template';
import ResetSettings from '../components/reset-settings';

export default function General() {
	return (
		<div>
			<Card>
				<CardHeader>
					<h2>{ __( 'General', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>

					<ReSync />

					<CardDivider />

					<ResetSettings />

				</CardBody>
			</Card>
		</div>
	);
}
