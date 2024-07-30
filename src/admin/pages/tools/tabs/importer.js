import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import ImportForms from '../components/import-forms';

export const Importer = withFilters( 'formello.settings.importer' )( () => {
	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Import Forms', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<p>
					{ __(
						'Select the Formello export file(.json) you would like to import. When you click the import button below, Formello will import the forms.',
						'formello'
					) }
				</p>
				<ImportForms />
			</CardBody>
		</Card>
	);
} );
