/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { createRoot, useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import './style.scss';
import { Forms } from './pages/submissions/forms';
import { Submissions } from './pages/submissions/submissions';
import { Submission } from './pages/submission';
import Settings from './pages/settings';
import Tools from './pages/tools';
import Addons from './pages/addons';
import { getQueryArg } from '@wordpress/url';
import SettingsContextProvider from './context/settings-context';
import { RouterProvider, useLocation, useHistory } from './router';

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

const Router = () => {
	const history = useHistory();
	const { params } = useLocation();

	const menuRoot = document.querySelector( '#toplevel_page_formello' );
	const reset = () => {
		const page = getQueryArg( window.location.href, 'page' );
		if ( ! page ) {
			return;
		}
		for ( const child of menuRoot.querySelectorAll( 'a' ) ) {
			const target = getQueryArg( child.href, 'page' );
			if ( page === target ) {
				child.classList.add( 'current' );
				child.parentElement.classList.add( 'current' );
			} else {
				child.classList.remove( 'current' );
				child.parentElement.classList.remove( 'current' );
			}
		}
	};

	const handleChange = ( e ) => {
		e.preventDefault();

		history.push( {
			page: getQueryArg( e.target.href, 'page' ),
		} );
		reset();
	};

	useEffect( () => {
		reset();
		menuRoot.addEventListener( 'click', handleChange, false );

		return () => {
			document
				.querySelector( '#toplevel_page_formello' )
				.removeEventListener( 'click', handleChange );
		};
	}, [] );

	if ( 'formello-settings' === params.page ) {
		return <Settings />;
	}
	if ( 'formello-tools' === params.page ) {
		return <Tools />;
	}
	if ( 'formello-addons' === params.page ) {
		return <Addons />;
	}
	if (
		'formello' === params.page &&
		'submission' === params.section &&
		params.submission_id
	) {
		return <Submission />;
	}
	if (
		'formello' === params.page &&
		'submissions' === params.section &&
		params.form_id
	) {
		return <Submissions />;
	}
	return <Forms />;
};

const App = () => {
	return (
		<RouterProvider>
			<SettingsContextProvider>
				<Router />
			</SettingsContextProvider>
		</RouterProvider>
	);
};

window.addEventListener( 'DOMContentLoaded', () => {
	const domNode = document.getElementById( 'formello-admin' );
	const root = createRoot( domNode );

	root.render( <App /> );
} );
