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

const tabs = [
	{
		name: 'recaptcha',
		title: 'ReCaptcha',
	},
	{
		name: 'integrations',
		title: 'Integrations',
	},
	{
		name: 'messages',
		title: 'Messages',
	},
	{
		name: 'other',
		title: 'Other',
	},
];

/**
 * Internal dependencies
 */
import './dashboard.scss';

import Recaptcha from './recaptcha.js';
import Messages from './messages.js';
import Integrations from './integrations.js';

const components = {
    recaptcha: Recaptcha,
    messages: Messages,
    integrations: Integrations,
};

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

	changeSettings( group, name, value ) {
		this.setState( {
			settings: {
				...this.state.settings,
				[group]: {
					...this.state.settings[group],
					[name]: value,
				}
			},
		} );
	};

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

					<TabPanel
						className='formello-tablist'
						tabs={ tabs }
					>
						{ ( tab ) => {
						    const SettingsTab = components[tab.name];
						    return <SettingsTab 
										changeSettings={ this.changeSettings.bind(this) }
										getSetting={ this.getSetting.bind(this) }
						    		/>;

						}}

					</TabPanel>

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