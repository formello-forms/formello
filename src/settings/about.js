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

import {
  RawHTML,
  Fragment
} from '@wordpress/element';

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
					<RawHTML>
						{ sprintf(
							__( '<p>Here you can find %s.</p>', 'formello' ),
							`<a href="https://wordpress.org/support/plugin/formello/">support</a>` )
						}
					</RawHTML>
					<RawHTML>
						{ sprintf(
							__( '<p>If you like the plugin, you can share a review %s.</p>', 'formello' ),
							`<a href="https://wordpress.org/support/plugin/formello/reviews/#new-post">here</a>` )
						}
					</RawHTML>
				</PanelRow>

			</div>
		</PanelBody>

		</div>

    );

};