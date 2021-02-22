import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  RadioControl,
  SelectControl,
  __experimentalNumberControl as NumberControl
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function recaptcha( props ) {

    return (

		<PanelBody
			initialOpen={ true }
			title={ __( 'Google ReCaptcha', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">
				<PanelRow className="formello-css-print-method">
				    <RadioControl
				        label="ReCaptcha type"
						selected={ props.getSetting( 'recaptcha', 'version' ) }
				        options={ [
				            { label: 'ReCaptcha v2 checkbox', value: '1' },
				            //{ label: 'ReCaptcha v2 invisible', value: 'uno' },
				            { label: 'ReCaptcha v3 invisible', value: '3' },
				        ] }
						onChange={ (val) => {
							props.changeSettings( 'recaptcha', 'version', val )
						} }
				    />
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Site Key', 'formello' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ props.getSetting( 'recaptcha', 'site_key' ) }
						onChange={ (val) => {
							props.changeSettings( 'recaptcha', 'site_key', val )
						} }
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Secret Key', 'formello' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ props.getSetting( 'recaptcha', 'secret_key' ) }
						onChange={ (val) => {
							props.changeSettings( 'recaptcha', 'secret_key', val )
						} }
					/>
				</PanelRow>
				{ ( props.getSetting( 'recaptcha', 'version' ) == 3 ) && 
				<PanelRow>
					<NumberControl
						label={ __( 'Threshold' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ props.getSetting( 'recaptcha', 'threshold' ) }
						onChange={ (val) => {
							props.changeSettings( 'recaptcha', 'threshold', val )
						} }
						step='0.1'
						min='0'
						max='1'
					/>
				</PanelRow>
				}

			</div>
		</PanelBody>

    );

};
