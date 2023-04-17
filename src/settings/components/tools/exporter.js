import { Card, CardHeader, CardBody } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import ExportForms from './components/export-forms';

export default function Exporter() {
	return (
		<div>
			<Card>
				<CardHeader>
					<h2>{ __( 'Export Forms', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<ExportForms />
				</CardBody>
			</Card>

			{ applyFilters( 'formello.Exporter', '', this ) }

		</div>
	);
}
