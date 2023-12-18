import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SettingsContext } from '../../../context/settings-context';

const LoggingTab = () => {
	const { settings, updateSetting } = useContext( SettingsContext );
	const log = settings.log;

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
					onChange={ ( val ) => updateSetting( 'log', val ) }
				/>
				{ log && (
					<ExternalLink
						href={
							'/wp-content/uploads/formello/logs/' +
							settings.log_file
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
