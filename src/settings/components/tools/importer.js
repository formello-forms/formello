import { Card, CardHeader, CardBody } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import ImportForms from './components/import-forms';

export default function Importer() {
	return (
		<div>
			<Card>
				<CardHeader>
					<h2>{ __( 'Importers', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<ImportForms />
				</CardBody>
			</Card>

			{ applyFilters( 'formello.Importer', '', this ) }

		</div>
	);
}
