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
			title={ __( 'About', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<p>{ __( 'Here you can find', 'formello' ) } <a href="https://wordpress.org/support/plugin/formello/">{ __( 'support' ) }</a>.</p>
					<p>{ __( 'If you like the plugin, you can share a review ', 'formello' ) } <a href="https://wordpress.org/support/plugin/formello/reviews/#new-post">{ __( 'here' ) }</a>.</p>
				</PanelRow>

			</div>
		</PanelBody>

		</div>

    );

};