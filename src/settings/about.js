import { PanelRow, PanelBody } from '@wordpress/components';

import { RawHTML } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

export default function other() {
	return (
		<div>
			<PanelBody initialOpen={ true } title={ __( 'About', 'formello' ) }>
				<div className="formello-dashboard-panel-row-wrapper">
					<PanelRow>
						<RawHTML>
							{ sprintf(
								/* translators: Link to support. */
								__( '<p>Here you can find %s.</p>', 'formello' ),
								`<a href="https://wordpress.org/support/plugin/formello/">support</a>`
							) }
						</RawHTML>
						<RawHTML>
							{ sprintf(
								/* translators: Link to review. */
								__(
									'<p>If you like the plugin, you can share a review %s.</p>',
									'formello'
								),
								`<a href="https://wordpress.org/support/plugin/formello/reviews/#new-post">here</a>`
							) }
						</RawHTML>
					</PanelRow>
				</div>
			</PanelBody>
		</div>
	);
}
