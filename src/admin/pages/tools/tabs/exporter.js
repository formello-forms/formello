import { Card, CardHeader, CardBody } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import ExportForms from '../components/export-forms';

export default function Exporter() {
	return (
		<div>
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

			{ applyFilters( 'formello.Exporter', '', this ) }
		</div>
	);
}
