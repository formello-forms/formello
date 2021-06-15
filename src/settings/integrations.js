import {
  TextControl,
  PanelRow,
  PanelBody,
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

    	<div>

		<PanelBody
			initialOpen={ true }
			title={ __( 'Integrations', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<p>{ __( 'We are working on other integrations. A lot more will be available soon.', 'formello' ) }</p>
				</PanelRow>

			</div>
		</PanelBody>

		{ applyFilters( 'formello.dashboard.integrations', '', props ) }

		</div>

    );

};