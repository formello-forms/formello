import menuFix from './menufix';
import './style.scss';

import { __ } from '@wordpress/i18n';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/loading-spinner.js';

import {
	useState,
	render,
} from '@wordpress/element';
import {
	useSelect,
} from '@wordpress/data';
import {
	store as coreStore,
} from '@wordpress/core-data';
import Settings from './routes/settings';
import Tools from './routes/tools';
import Addons from './routes/addons';

const App = () => {
	const [ settings ] = useState( null );
	const { savedSettings } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const fetchedSettings =
			getEntityRecord( 'root', 'site' ) ?? null;
		return { savedSettings: fetchedSettings };
	} );

	// Display loading/error message while settings are being fetched.
	if ( ! savedSettings ) {
		return (
			<LoadingSpinner text={ __( 'Loading settings…', 'formello' ) } />
		);
	}

	return (
		<React.StrictMode>
			<HashRouter basename="/">
				<Routes>
					<Route path="/:tab?" element={ <Settings savedSettings={ settings ?? savedSettings } /> } />
					<Route path="/tools/:tab?" element={ <Tools savedSettings={ settings ?? savedSettings } /> } />
					<Route path="/addons" element={ <Addons savedSettings={ settings ?? savedSettings } /> } />
				</Routes>
			</HashRouter>
		</React.StrictMode>
	);
};

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-plugin-settings' )
	);
} );

// fix the admin menu for the slug "formello_form"
menuFix( 'formello_form' );
