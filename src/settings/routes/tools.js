import { TabPanel } from '@wordpress/components';
import { useParams, useNavigate } from "react-router-dom";

import { Fragment, render } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import General from '../components/tools/general.js';
import Exporter from '../components/tools/exporter.js';
import Importer from '../components/tools/importer.js';
import Header from '../components/masthead.js';

export default function Tools( props ) {

	const toolsTabs = [
		{
			name: 'general',
			title: __( 'General', 'formello' ),
			component: General,
		},
		{
			name: 'exporters',
			title: __( 'Exporters', 'formello' ),
			component: Exporter,
		},
		{
			name: 'importers',
			title: __( 'Importers', 'formello' ),
			component: Importer,
		},
	];

	// Filter to add a tab
	applyFilters( 'formello.ToolsTabs', '', toolsTabs );

	const routeParams = useParams();
	const initialTab = routeParams.tab;
	const navigate = useNavigate();

	const updateUrl = ( tabName ) => {
		navigate( '/tools/' + tabName );
	};

	return (
		<Fragment>

			<Header title={ __( 'Tools', 'formello' ) } />

			<div className="setting-tabs">
				
				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

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
		</Fragment>
	);
}
