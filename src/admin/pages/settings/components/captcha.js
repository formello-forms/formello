import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	RadioControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useContext, Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { SettingsContext } from '../../../context/settings-context';

export default function Captcha() {
	const { settings, updateSetting } = useContext( SettingsContext );
	const reCaptcha = settings.reCaptcha;
	const hCaptcha = settings.hCaptcha;

	function setCaptcha( key, value, type ) {
		const newSettings = Object.assign( {}, settings[ type ] );
		newSettings[ key ] = value;
		updateSetting( type, newSettings );
	}

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{ __( 'Google reCaptcha', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<VStack>
						<RadioControl
							selected={ reCaptcha.version }
							options={ [
								{ label: 'reCaptcha v2 checkbox', value: '1' },
								{ label: 'reCaptcha v3 invisible', value: '3' },
							] }
							onChange={ ( val ) => {
								setCaptcha( 'version', val, 'reCaptcha' );
							} }
						/>
						<TextControl
							label={ __( 'Site Key', 'formello' ) }
							value={ reCaptcha.site_key }
							onChange={ ( val ) => {
								setCaptcha( 'site_key', val, 'reCaptcha' );
							} }
						/>
						<TextControl
							label={ __( 'Secret Key', 'formello' ) }
							value={ reCaptcha.secret_key }
							onChange={ ( val ) => {
								setCaptcha( 'secret_key', val, 'reCaptcha' );
							} }
						/>
						{ 3 === Number( reCaptcha.version ) && (
							<TextControl
								label={ __( 'Threshold', 'formello' ) }
								value={ reCaptcha.threshold }
								onChange={ ( val ) => {
									setCaptcha( 'threshold', val, 'reCaptcha' );
								} }
								type="number"
								step={ '0.1' }
								min={ '0' }
								max={ '1' }
							/>
						) }
					</VStack>
				</CardBody>
			</Card>
			<Card>
				<CardHeader>
					<h2>{ __( 'hCaptcha', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<VStack>
						{ ' ' }
						<RadioControl
							selected={ hCaptcha?.version }
							options={ [
								{
									label: 'hCaptcha checkbox',
									value: 'checkbox',
								},
								{
									label: 'hCaptcha invisible',
									value: 'invisible',
								},
							] }
							onChange={ ( val ) => {
								setCaptcha( 'version', val, 'hCaptcha' );
							} }
						/>
						<TextControl
							label={ __( 'Site Key', 'formello' ) }
							value={ hCaptcha?.site_key }
							onChange={ ( val ) => {
								setCaptcha( 'site_key', val, 'hCaptcha' );
							} }
						/>
						<TextControl
							label={ __( 'Secret Key', 'formello' ) }
							value={ hCaptcha?.secret_key }
							onChange={ ( val ) => {
								setCaptcha( 'secret_key', val, 'hCaptcha' );
							} }
						/>
						{ 3 === Number( hCaptcha?.version ) && (
							<TextControl
								label={ __( 'Threshold', 'formello' ) }
								value={ reCaptcha.threshold }
								onChange={ ( val ) => {
									setCaptcha( 'threshold', val, 'hCaptcha' );
								} }
								type="number"
								step={ '0.1' }
								min={ '0' }
								max={ '1' }
							/>
						) }
					</VStack>
				</CardBody>
			</Card>
		</Fragment>
	);
}
