import Header from '../../components/masthead.js';
import { __ } from '@wordpress/i18n';
import { useState, Fragment, useContext } from '@wordpress/element';
import {
	TabPanel,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseNavigator as useNavigator,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGrid as Grid,
	Notice,
} from '@wordpress/components';
import LoadingSpinner from '../../components/loading-spinner.js';
import Addon from './addon.js';
import { useEntityRecords } from '@wordpress/core-data';
import { SettingsContext } from '../../context/settings-context';

export default function Addons() {
	const { hasUpdates, saveSettings } = useContext( SettingsContext );

	const addonsTabs = [
		{
			name: 'general',
			title: __( 'All', 'formello' ),
		},
		{
			name: 'integrations',
			title: __( 'Integrations', 'formello' ),
		},
		{
			name: 'utility',
			title: __( 'Utility', 'formello' ),
		},
		{
			name: 'free',
			title: __( 'Free', 'formello' ),
		},
	];

	const [ filter, setFilter ] = useState( 'general' );

	const { params } = useNavigator();
	const initialTab = params.tab || 'general';

	const { records: addons, hasResolved } = useEntityRecords(
		'formello/v1',
		'addons',
		{ per_page: 100 }
	);

	const filterAddon = ( element ) => {
		if ( 'general' === filter ) {
			return addons;
		}
		return element.category === filter;
	};

	if ( ! hasResolved ) {
		return <LoadingSpinner text={ __( 'Loading addons', 'formello' ) } />;
	}

	return (
		<Fragment>
			<Header title={ __( 'Addons', 'formello' ) } />

			<div className="setting-tabs">
				{ hasUpdates && (
					<Notice
						status="warning"
						isDismissible={ false }
						actions={ [
							{
								label: 'Save',
								variant: 'primary',
								onClick: () =>
									saveSettings().then( () =>
										window.location.reload()
									),
							},
						] }
					>
						<p>
							{ __(
								'To make effective your choice, you must save it.',
								'formello'
							) }
						</p>
					</Notice>
				) }

				<TabPanel
					tabs={ addonsTabs }
					onSelect={ ( tabName ) => setFilter( tabName ) }
					initialTabName={ initialTab }
				>
					{ () => {
						return (
							<Fragment>
								<Grid columns={ 3 }>
									{ addons
										.filter( ( element ) => {
											return filterAddon( element );
										} )
										.map( ( addon ) => {
											return (
												<Addon
													addon={ addon }
													key={ addon.slug }
												/>
											);
										} ) }
								</Grid>
							</Fragment>
						);
					} }
				</TabPanel>
			</div>
		</Fragment>
	);
}
