import {
	__experimentalGrid as Grid,
	TabPanel,
} from '@wordpress/components';
import { useParams, useNavigate } from 'react-router-dom';

import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import General from '../components/tools/general.js';
import Exporter from '../components/tools/exporter.js';
import Importer from '../components/tools/importer.js';
import Header from '../components/masthead.js';
import Help from '../components/settings/help.js';

export default function Tools() {
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
						const Tab = tab.component;
						return (
							<Grid columns={ 4 } templateColumns="3fr 1fr" gap="4">
								<Tab />
								<Help />
							</Grid>
						);
					} }
				</TabPanel>

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
			</div>
		</Fragment>
	);
}
