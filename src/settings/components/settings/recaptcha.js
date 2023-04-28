import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	RadioControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function ReCaptcha( props ) {
	const { settings, setSettings } = props;
	const reCaptcha = settings.formello.reCaptcha ?? {};

	function setReCaptcha( key, value ) {
		const newSettings = Object.assign( {}, settings.formello );
		newSettings.reCaptcha[ key ] = value;
		setSettings( {
			...settings,
			formello: newSettings,
		} );
	}

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Google reCaptcha', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<RadioControl
					selected={ reCaptcha.version }
					options={ [
						{ label: 'reCaptcha v2 checkbox', value: '1' },
						{ label: 'reCaptcha v3 invisible', value: '3' },
					] }
					onChange={ ( val ) => {
						setReCaptcha( 'version', val );
					} }
				/>
				<TextControl
					label={ __( 'Site Key', 'formello' ) }
					value={ reCaptcha.site_key }
					onChange={ ( val ) => {
						setReCaptcha( 'site_key', val );
					} }
				/>
				<TextControl
					label={ __( 'Secret Key', 'formello' ) }
					value={ reCaptcha.secret_key }
					onChange={ ( val ) => {
						setReCaptcha( 'secret_key', val );
					} }
				/>
				{ 3 === Number( reCaptcha.version ) && (
					<TextControl
						label={ __( 'Threshold', 'formello' ) }
						value={ reCaptcha.threshold }
						onChange={ ( val ) => {
							setReCaptcha( 'threshold', val );
						} }
						type="number"
						step={ '0.1' }
						min={ '0' }
						max={ '1' }
					/>
				) }
			</CardBody>
		</Card>
	);
}