import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseNavigator as useNavigator,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGrid as Grid,
	TabPanel,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import General from './tabs/general.js';
import Exporter from './tabs/exporter.js';
import Importer from './tabs/importer.js';
import Header from '../../components/masthead.js';
import Help from '../../components/help.js';

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

	const { params } = useNavigator();
	const initialTab = params.tab || 'general';

	return (
		<Fragment>
			<Header title={ __( 'Tools', 'formello' ) } />

			<div className="setting-tabs">
				{ applyFilters(
					'formello.dashboard.beforeSettings',
					'',
					this
				) }

				<TabPanel tabs={ toolsTabs } initialTabName={ initialTab }>
					{ ( tab ) => {
						const Tab = tab.component;
						return (
							<Grid
								columns={ 4 }
								templateColumns="3fr 1fr"
								gap="4"
							>
								<div>
									<Tab />
								</div>
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
