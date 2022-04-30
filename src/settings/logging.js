import { Card, CardHeader, CardBody, ExternalLink, ToggleControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

const LoggingTab = (props) => {

	const { saveSetting, settings } = props;

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Logging', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<p>
					{ __(
						'To enable logging, please set this as checked.',
						'formello'
					) }
				</p>

				<ToggleControl
					label={ __( 'Enable log', 'formello' ) }
					checked={ settings.log }
					onChange={ ( val ) => { 
						saveSetting( 'log', val );
					} }
				/>
				{ settings.log && (
					<ExternalLink href={ settings.log_file }>
						{ __( 'View log', 'formello' ) }
					</ExternalLink>
				) }
			</CardBody>
		</Card>
	);
};

export default LoggingTab;