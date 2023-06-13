import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const LoggingTab = ( props ) => {
	const { settings, setSettings } = props;
	const log = settings.formello.log;

	function setLog( value ) {
		const newSettings = Object.assign( {}, settings.formello );
		newSettings.log = value;
		setSettings( {
			...settings,
			formello: newSettings,
		} );
	}

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Logging', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<p>
					{ __(
						'Enable logging can hurt site performance. Please activate logging only for debug purpose.',
						'formello'
					) }
				</p>

				<ToggleControl
					label={ __( 'Enable log', 'formello' ) }
					checked={ log }
					onChange={ ( val ) => {
						setLog( val );
					} }
				/>
				{ log && (
					<ExternalLink
						href={
							settings.url +
							'/wp-content/uploads/formello/logs/' +
							settings.formello.log_file
						}
					>
						{ __( 'View log', 'formello' ) }
					</ExternalLink>
				) }
			</CardBody>
		</Card>
	);
};

export default LoggingTab;
