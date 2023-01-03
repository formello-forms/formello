import { SlotFillProvider, Slot, TabPanel } from '@wordpress/components';
import { useParams, useNavigate } from "react-router-dom";

import { Fragment, render } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import General from '../components/tools/general.js';
import Header from '../components/masthead.js';

export default function Tools( props ) {

	const toolsTabs = [
		{
			name: 'general',
			title: __( 'General', 'formello' ),
			component: General,
		},
	];

	applyFilters( 'formello.ToolsTabs', '', toolsTabs );

	const routeParams = useParams();
	const initialTab = routeParams.tab;
	const navigate = useNavigate();

	const updateUrl = ( tabName ) => {
		navigate( '/tools/' + tabName );
	};

	return (
		<SlotFillProvider>

			<Header title={ __( 'Tools', 'formello' ) } />

			{ applyFilters( 'formello.Test', '', this ) }

			<div className="setting-tabs">
				
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
									<General />
								);
							default:
								const Tab = tab.component;
								return <Tab />;
						}
					} }
				</TabPanel>

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
			</div>
		</SlotFillProvider>
	);
}
