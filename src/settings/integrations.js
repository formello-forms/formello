import {
  TextControl,
  Card,
  CardHeader,
  CardBody,
  Button,
  RadioControl,
  SelectControl,
} from '@wordpress/components';

const {
	applyFilters,
} = wp.hooks;

import { __ } from '@wordpress/i18n';

export default function integrations( props ) {

	const {
		getSetting,
		changeSettings
	} = props;

	return (

		<Card>

			<CardHeader><h2>{ __( 'Integrations', 'formello' ) }</h2></CardHeader>

			<CardBody>

				<p>{ __( 'Go to addons page to download your preferred integrations. We are working on other integrations. A lot more will be available soon.', 'formello' ) }</p>

			</CardBody>

			{ applyFilters( 'formello.dashboard.integrations', '', props ) }

		</Card>

	);

};