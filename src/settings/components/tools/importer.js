import { Card, CardHeader, CardBody, CardDivider, Button } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../update-settings';

export default function Importer() {

	return (
		<div className="setting-tabs__block-manager inner-container">
			<Card>
				<CardHeader>
					<h2>{ __( 'Importers', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>


					<CardDivider />


				</CardBody>
			</Card>

			{ applyFilters( 'formello.Importer', '', this ) }

		</div>
	);
}