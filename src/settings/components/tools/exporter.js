import { Card, CardHeader, CardBody, CardDivider, Notice } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import ExportForms from './components/export-forms';

export default function Exporter() {

	return (
		<div className="setting-tabs__block-manager inner-container">
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