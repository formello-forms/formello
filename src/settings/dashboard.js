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
		name: 'license',
		title: 'General',
	},
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
		name: 'about',
		title: 'More',
	},
];

/**
 * Internal dependencies
 */
import './dashboard.scss';
import getIcon from '../utils/get-icon';

import License from './license.js';
import Recaptcha from './recaptcha.js';
import Messages from './messages.js';
import Integrations from './integrations.js';
import About from './about.js';

const components = {
    license: License,
    recaptcha: Recaptcha,
    messages: Messages,
    integrations: Integrations,
    about: About,
};

class App extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			settings: {},
		};

		this.getSetting = this.getSetting.bind( this );
		this.updateSettings = this.updateSettings.bind( this );
	}

	componentDidMount() {
		apiFetch( {
			path: '/formello/v1/settings',
			method: 'GET'
		} ).then( ( result ) => {
			this.state.settings = result.response 
			
			this.setState( {
				isAPILoaded: true,
			} );

		} );
	}

	getSetting( group, name, defaultVal ) {
		let result = defaultVal;

		if( 'license' === group || 'license_status' === group ){
			result = this.state.settings[ group ];
		}

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

	showMessage( message ) {
		message.classList.add( 'formello-action-message--show' );
		message.textContent = result.response;

		if ( ! result.success || ! result.response ) {
			message.classList.add( 'formello-action-message--error' );
		} else {
			setTimeout( function() {
				message.classList.remove( 'formello-action-message--show' );
			}, 3000 );
		}
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

	saveLicense( value ) {
		this.setState( {
			settings: {
				...this.state.settings,
				license: value
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
				<div className="formello-settings-header">
					<h1>{ getIcon( 'logo' ) }{ __( 'Settings' ) }</h1>
				</div>
				<div className="formello-settings-main">

					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<TabPanel
						className='formello-tablist'
						tabs={ tabs }
					>
						{ ( tab ) => {
						    const SettingsTab = components[tab.name];
						    return <SettingsTab 
										saveLicense={ this.saveLicense.bind(this) }
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
							{ ! this.state.isAPISaving && __( 'Save', 'formello' ) }
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