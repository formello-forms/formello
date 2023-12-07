/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { createRoot } from '@wordpress/element';
import {
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
} from '@wordpress/components';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

//import menuFix from '../settings/menuFix';
import './style.scss';

import { Forms } from './pages/submissions/forms';
import { Submissions } from './pages/submissions/submissions';
import { Submission } from './pages/submission';
import Settings from './pages/settings';
import Tools from './pages/tools';
import Addons from './pages/addons';
import { getQueryArg, hasQueryArg } from '@wordpress/url';
import SettingsContextProvider from './context/settings-context';
import menuFix from '../utils/menu-fix';

/**
 * Add our custom entities for retrieving external setting and variable data.
 *
 * @since 2.5.0
 */
dispatch( 'core' ).addEntities( [
	{
		label: __( 'Formello submissions', 'formello' ),
		kind: 'formello/v1',
		name: 'submissions',
		baseURL: '/formello/v1/submissions',
		supportsPagination: true,
	},
	{
		label: __( 'Formello addons', 'formello' ),
		kind: 'formello/v1',
		name: 'addons',
		baseURL: '/formello/v1/addons',
	},
	{
		label: __( 'Formello columns', 'formello' ),
		kind: 'formello/v1',
		name: 'columns',
		baseURL: '/formello/v1/columns',
	},
] );

const App = () => {
	const baseUrl = window.location.href;
	const initialTab = hasQueryArg( baseUrl, 'tab' )
		? '/' + getQueryArg( baseUrl, 'tab' )
		: '/general';
	const id = hasQueryArg( baseUrl, 'id' )
		? '/' + getQueryArg( baseUrl, 'id' )
		: '';
	const initialPath = '/' + getQueryArg( baseUrl, 'page' ) + initialTab + id;

	return (
		<NavigatorProvider initialPath={ initialPath || '/formello' }>
			<SettingsContextProvider>
				<NavigatorScreen path="/formello/:tab?">
					<Forms />
				</NavigatorScreen>
				<NavigatorScreen path="/formello/submissions/:id">
					<Submissions />
				</NavigatorScreen>
				<NavigatorScreen path="/formello/submission/:id">
					<Submission />
				</NavigatorScreen>
				<NavigatorScreen path="/formello-settings/:tab?">
					<Settings />
				</NavigatorScreen>
				<NavigatorScreen path="/formello-tools/:tab?">
					<Tools />
				</NavigatorScreen>
				<NavigatorScreen path="/formello-addons/:tab?">
					<Addons />
				</NavigatorScreen>
			</SettingsContextProvider>
		</NavigatorProvider>
	);
};

window.addEventListener( 'DOMContentLoaded', () => {
	const domNode = document.getElementById( 'formello-admin' );
	const root = createRoot( domNode );

	root.render( <App /> );
} );

menuFix( 'formello' );
