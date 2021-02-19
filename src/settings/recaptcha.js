import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  SelectControl,
  Icon,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import MergeTags from '../../components/merge-tags';

const OptionsList = props => {

  return props.options.map((obj, idx) => {

    let key = obj.key,
        value = obj.value;
    return (

		<PanelBody
			initialOpen={ true }
			title={ __( 'Google ReCaptcha', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">
				<PanelRow className="formello-css-print-method">
				    <RadioControl
				        label="ReCaptcha type"
				        help="The type of the current user"
						selected={ this.getSetting( 'recaptcha', 'version' ) }
				        options={ [
				            { label: 'ReCaptcha v2 checkbox', value: '1' },
				            //{ label: 'ReCaptcha v2 invisible', value: 'uno' },
				            { label: 'ReCaptcha v3 invisible', value: '3' },
				        ] }
						onChange={ ( value ) => {
							this.setState( {
								settings: {
									...this.state.settings,
									recaptcha: {
										...this.state.settings.recaptcha,
										version: value,
									}
								},
							} );
						} }
				    />
				</PanelRow>

				<PanelRow>
					<TextControl
						label={ __( 'Site Key', 'formello' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ this.getSetting( 'recaptcha', 'site_key' ) }
						onChange={ ( value ) => {
							this.setState( {
								settings: {
									...this.state.settings,
									recaptcha: {
										...this.state.settings.recaptcha,
										site_key: value,
									}
								},
							} );
						} }
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Secret Key', 'formello' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ this.getSetting( 'recaptcha', 'secret_key' ) }
						onChange={ ( value ) => {
							this.setState( {
								settings: {
									...this.state.settings,
									recaptcha: {
										...this.state.settings.recaptcha,
										secret_key: value,
									}
								},
							} );
						} }
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Threshold' ) }
						help={ __( 'Sync our responsive preview controls with the editor responsive previews.', 'formello' ) }
						value={ this.getSetting( 'recaptcha', 'threshold' ) }
						onChange={ ( value ) => {
							this.setState( {
								settings: {
									...this.state.settings,
									recaptcha: {
										...this.state.settings.recaptcha,
										threshold: value,
									}
								},
							} );
						} }
					/>
				</PanelRow>

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				<div className="formello-action-button">
					<Button
						isPrimary
						disabled={ this.state.isAPISaving }
						onClick={ ( e ) => this.updateSettings( e ) }
					>
						{ this.state.isAPISaving && <Spinner /> }
						{ ! this.state.isAPISaving && __( 'Save' ) }
					</Button>

					<span className="formello-action-message"></span>
				</div>

			</div>
		</PanelBody>

    );
  });
};
export default OptionsList;