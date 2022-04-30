import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	RadioControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

export default function ReCaptcha( props ) {
	const { saveSetting, saveSettingGroup, settings } = props;

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Google reCaptcha', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<RadioControl
					selected={ settings.reCaptcha.version }
					options={ [
						{ label: 'reCaptcha v2 checkbox', value: '1' },
						{ label: 'reCaptcha v3 invisible', value: '3' },
					] }
					onChange={ ( val ) => {
						saveSettingGroup( 'reCaptcha', 'version', val );
					} }
				/>

				<TextControl
					label={ __( 'Site Key', 'formello' ) }
					value={ settings.reCaptcha.site_key }
					onChange={ ( val ) => {
						saveSettingGroup( 'reCaptcha', 'site_key', val );
					} }
				/>

				<TextControl
					label={ __( 'Secret Key', 'formello' ) }
					value={ settings.reCaptcha.secret_key }
					onChange={ ( val ) => {
						saveSettingGroup( 'reCaptcha', 'secret_key', val );
					} }
				/>

				{ 3 === Number(settings.reCaptcha.version) && (
					<NumberControl
						label={ __( 'Threshold', 'formello' ) }
						value={ settings.reCaptcha.threshold }
						onChange={ ( val ) => {
							saveSettingGroup( 'reCaptcha', 'threshold', val );
						} }
						step={ '0.1' }
						min={ '0' }
						max={ '1' }
					/>
				) }
			</CardBody>
		</Card>
	);
}
