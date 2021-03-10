import {
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

		<PanelBody
			initialOpen={ true }
			title={ __( 'Google ReCaptcha', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">
				<PanelRow className="formello-css-print-method">
				    <RadioControl
				        label={ __( 'ReCaptcha type', 'formello' ) }
						selected={ getSetting( 'recaptcha', 'version' ) }
				        options={ [
				            { label: 'ReCaptcha v2 checkbox', value: '1' },
				            { label: 'ReCaptcha v3 invisible', value: '3' },
				        ] }
						onChange={ (val) => {
							changeSettings( 'recaptcha', 'version', val )
						} }
				    />
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Site Key', 'formello' ) }
						value={ getSetting( 'recaptcha', 'site_key' ) }
						onChange={ (val) => {
							changeSettings( 'recaptcha', 'site_key', val )
						} }
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Secret Key', 'formello' ) }
						value={ getSetting( 'recaptcha', 'secret_key' ) }
						onChange={ (val) => {
							changeSettings( 'recaptcha', 'secret_key', val )
						} }
					/>
				</PanelRow>
				{ ( getSetting( 'recaptcha', 'version' ) == 3 ) && 
				<PanelRow>
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
				</PanelRow>
				}

			</div>
		</PanelBody>

    );

};
