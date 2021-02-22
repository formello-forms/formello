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

	const updateSetting = ( group, field, value ) => {
		var newSettings = Object.assign( {}, props.getSetting( 'validation_messages', group ) );
		newSettings[ field ] = value;
		props.changeSettings( 'validation_messages', group, newSettings )
	};

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

		{ applyFilters( 'formello.dashboard.integrations', props ) }

		</div>

    );

};