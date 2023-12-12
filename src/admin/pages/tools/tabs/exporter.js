import { Card, CardHeader, CardBody, withFilters } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import ExportForms from '../components/export-forms';

const Exporter = () => {
	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Export Forms', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<p>
					{ __(
						"When you click the download button below, Formello will create a JSON file for you to save to your computer. Once you've saved the downloaded file, you can use the Import tool to import the forms.",
						'formello'
					) }
				</p>
				<ExportForms />
			</CardBody>
		</Card>
	);
}

export default withFilters( 'formello.settings.exporter' )(
	Exporter
);
