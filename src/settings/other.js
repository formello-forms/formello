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

export default function other( props ) {

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
					<p>{ __( 'Here you can add integration settings.', 'formello' ) }</p>
				</PanelRow>

			</div>
		</PanelBody>

		</div>

    );

};