/**
 * WordPress dependencies
 */
const {
	__,
} = wp.i18n;

const {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	SelectControl,
	RadioControl,
	TabPanel
} = wp.components;

const {
	render,
	Component,
	Fragment,
} = wp.element;

const {
	apiFetch,
} = wp;

const {
	applyFilters,
} = wp.hooks;

/**
 * Internal dependencies
 */
import './dashboard.scss';

class App extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			isRegeneratingCSS: false,
			settings: formelloSettings.settings,
		};

		this.getSetting = this.getSetting.bind( this );
		this.updateSettings = this.updateSettings.bind( this );
	}

	componentDidMount() {
		this.setState( {
			isAPILoaded: true,
		} );
	}

	getSetting( group, name, defaultVal ) {
		let result = defaultVal;

		if ( 'undefined' !== typeof this.state.settings[ group ][ name ] ) {
			result = this.state.settings[ group ][ name ];
		}

		return result;
	}

	updateSettings( e ) {
		this.setState( { isAPISaving: true } );
		const message = e.target.nextElementSibling;

		apiFetch( {
			path: '/formello/v1/settings',
			method: 'POST',
			data: {
				settings: this.state.settings,
			},
		} ).then( ( result ) => {
			this.setState( { isAPISaving: false } );
			message.classList.add( 'formello-action-message--show' );
			message.textContent = result.response;

			if ( ! result.success || ! result.response ) {
				message.classList.add( 'formello-action-message--error' );
			} else {
				setTimeout( function() {
					message.classList.remove( 'formello-action-message--show' );
				}, 3000 );
			}
		} );
	}

	render() {
		if ( ! this.state.isAPILoaded ) {
			return (
				<Placeholder className="formello-settings-placeholder">
					<Spinner />
				</Placeholder>
			);
		}

		return (
			<Fragment>
				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

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
									label={ __( 'Site Key' ) }
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
									label={ __( 'Secret Key' ) }
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
				</div>

				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<PanelBody
						initialOpen={ false }
						title={ __( 'Missing values', 'formello' ) }
					>
						<div className="formello-dashboard-panel-row-wrapper">

							<PanelRow>
								<TextControl
									label={ __( 'Default' ) }
									value={ this.state.settings.validation_messages.missingValue.default }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													missingValue: {	
														...this.state.settings.validation_messages.missingValue,
														default: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Checkbox' ) }
									value={ this.state.settings.validation_messages.missingValue.checkbox }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													missingValue: {	
														...this.state.settings.validation_messages.missingValue,
														checkbox: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Radio' ) }
									value={ this.state.settings.validation_messages.missingValue.radio }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													missingValue: {	
														...this.state.settings.validation_messages.missingValue,
														radio: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Select' ) }
									value={ this.state.settings.validation_messages.missingValue.select }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													missingValue: {	
														...this.state.settings.validation_messages.missingValue,
														select: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Select multiple' ) }
									value={ this.state.settings.validation_messages.missingValue['select-multiple'] }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													missingValue: {	
														...this.state.settings.validation_messages.missingValue,
														'select-multiple': value,
													}
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<PanelBody
						initialOpen={ false }
						title={ __( 'Pattern mismatch', 'formello' ) }
					>
						<div className="formello-dashboard-panel-row-wrapper">

							<PanelRow>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.email }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														email: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.url }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														url: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.number }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														number: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.color }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														color: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.date }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														date: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.time }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														time: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.month }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														month: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.patternMismatch.default }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													patternMismatch: {	
														...this.state.settings.validation_messages.patternMismatch,
														default: value,
													}
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<PanelBody
						initialOpen={ false }
						title={ __( 'Out of Range', 'formello' ) }
					>
						<div className="formello-dashboard-panel-row-wrapper">

							<PanelRow>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.outOfRange.over }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,													
													outOfRange: {	
														...this.state.settings.validation_messages.outOfRange,
														over: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.outOfRange.under }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													outOfRange: {	
														...this.state.settings.validation_messages.outOfRange,
														under: value,
													}
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<PanelBody
						initialOpen={ false }
						title={ __( 'Wrong Length', 'formello' ) }
					>
						<div className="formello-dashboard-panel-row-wrapper">

							<PanelRow>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.wrongLength.over }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													wrongLength: {	
														...this.state.settings.validation_messages.wrongLength,
														over: value,
													}
												}
											},
										} );
									} }
								/>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.validation_messages.wrongLength.under }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												validation_messages: {
													...this.state.settings.validation_messages,
													wrongLength: {	
														...this.state.settings.validation_messages.wrongLength,
														under: value,
													}
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

				<div className="formello-settings-main">
					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<PanelBody
						initialOpen={ false }
						title={ __( 'mailChimp Api Key', 'formello' ) }
					>
						<div className="formello-dashboard-panel-row-wrapper">

							<PanelRow>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.settings.integrations.mailchimp.key }
									onChange={ ( value ) => {
										this.setState( {
											settings: {
												...this.state.settings,
												integrations: {
													...this.state.settings.integrations,
													mailchimp: {	
														...this.state.settings.integrations.mailchimp,
														key: value,
													}
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

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

			</Fragment>
		);
	}
}

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-block-default-settings' )
	);
} );