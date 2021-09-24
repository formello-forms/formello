import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	PanelRow,
	PanelBody,
	Button,
	RadioControl,
	SelectControl,
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';

import { __, sprintf } from '@wordpress/i18n';

export default function recaptcha( props ) {

	const {
		getSetting,
		changeSettings
	} = props;

	return (

		<Card>

			<CardHeader>
				<h2>{ __( 'Google reCaptcha', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<RadioControl
					selected={ getSetting( 'recaptcha', 'version' ) }
					options={ [
						{ label: 'reCaptcha v2 checkbox', value: '1' },
						{ label: 'reCaptcha v3 invisible', value: '3' },
					] }
					onChange={ (val) => {
						changeSettings( 'recaptcha', 'version', val )
					} }
				/>

				<TextControl
					label={ __( 'Site Key', 'formello' ) }
					value={ getSetting( 'recaptcha', 'site_key' ) }
					onChange={ (val) => {
						changeSettings( 'recaptcha', 'site_key', val )
					} }
				/>

				<TextControl
					label={ __( 'Secret Key', 'formello' ) }
					value={ getSetting( 'recaptcha', 'secret_key' ) }
					onChange={ (val) => {
						changeSettings( 'recaptcha', 'secret_key', val )
					} }
				/>

				{ ( getSetting( 'recaptcha', 'version' ) == 3 ) && 

					<NumberControl
						label={ __( 'Threshold', 'formello' ) }
						value={ getSetting( 'recaptcha', 'threshold' ) }
						onChange={ (val) => {
							changeSettings( 'recaptcha', 'threshold', val )
						} }
						step={ '0.1' }
						min={ '0' }
						max={ '1' }
					/>

				}

			</CardBody>

		</Card>

	);

};
