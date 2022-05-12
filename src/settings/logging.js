import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
	ToggleControl,
} from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const LoggingTab = () => {
	const settings = useSelect(
		( select ) => select( 'formello/data' ).getSettings(),
		[]
	);

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
						dispatch( 'formello/data' ).setSetting( 'log', val );
					} }
				/>
				{ settings.log && (
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
