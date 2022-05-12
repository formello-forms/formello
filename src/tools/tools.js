import { SlotFillProvider, Slot, TabPanel } from '@wordpress/components';

import { Fragment, render } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs } from '@wordpress/url';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import getIcon from '../utils/get-icon';
import General from './general.js';
import Notices from './notices.js';

function App() {
	const { createNotice, removeNotice } = useDispatch( noticesStore );

	const addNotice = ( status, content, type = 'snackbar' ) => {
		removeNotice( 'tools' );
		createNotice( status, content, { type, id: 'tools' } );
	};

	const toolsTabs = [
		{
			name: 'general',
			title: __( 'General', 'formello' ),
			component: General,
		},
	];

	applyFilters( 'formello.ToolsTabs', '', toolsTabs );

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		const newUrl = addQueryArgs( window.location.href, { tab: tabName } );
		window.history.replaceState( { path: newUrl }, '', newUrl );
	};

	return (
		<SlotFillProvider>
			<div className="formello-settings-header">
				<div className="formello-container">
					<h1>
						{ getIcon( 'logo' ) }
						{ __( 'Tools' ) }
					</h1>
				</div>
			</div>
			{ applyFilters( 'formello.Test', '', this ) }

			<div className="formello-settings-main">
				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }
				<Slot name="ToolsTab" />
				<TabPanel
					tabs={ toolsTabs }
					onSelect={ ( tabName ) => updateUrl( tabName ) }
					initialTabName={ initialTab }
				>
					{ ( tab ) => {
						switch ( tab.name ) {
							case 'general':
								return (
									<Fragment>
										<General addNotice={ addNotice } />
									</Fragment>
								);
							default:
								const Tab = tab.component;
								return <Tab />;
						}
					} }
				</TabPanel>

				<Notices />

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
			</div>
		</SlotFillProvider>
	);
}

window.addEventListener( 'DOMContentLoaded', () => {
	render( <App />, document.getElementById( 'formello-block-tools' ) );
} );
