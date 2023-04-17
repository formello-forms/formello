import Header from '../components/masthead.js';
import { __ } from '@wordpress/i18n';
import {
	useState,
	Fragment,
	useEffect,
} from '@wordpress/element';
import {
	__experimentalGrid as Grid,
	TabPanel,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import LoadingSpinner from '../components/loading-spinner.js';
import Addon from '../components/addons/addon.js';
import {
	useSelect,
} from '@wordpress/data';
import {
	store as coreStore,
} from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

export default function Addons() {
	const addonsTabs = [
		{
			name: 'all',
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

	const settings = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const fetchedSettings =
			getEntityRecord( 'root', 'site' ) ?? null;
		return fetchedSettings.formello;
	} );

	const [ addons, setAddons ] = useState( false );
	const [ filter, setFilter ] = useState( 'all' );
	const [ enabled, setEnabled ] = useState( Object.assign( [], settings.enabled_addons ) );

	useEffect( () => {
		apiFetch( {
			path: '/formello/v1/addons/',
			method: 'GET',
		} ).then( ( result ) => {
			setAddons( result.response.products );
		} );
	}, [] );

	const { saveEntityRecord } = useDispatch( coreStore );
	const without = ( arr, ...args ) => arr.filter( ( item ) => ! args.includes( item ) );

	function handleAddonChange( checked, blockTypeName ) {
		let currentDisabledBlocks = [ ...settings.enabled_addons ];

		if ( checked ) {
			currentDisabledBlocks.push( blockTypeName );
		} else {
			currentDisabledBlocks = without(
				currentDisabledBlocks,
				blockTypeName
			);
		}
		setEnabled( currentDisabledBlocks );
		updateAddons( currentDisabledBlocks );
	}

	const updateAddons = ( addons ) => {
		saveEntityRecord( 'root', 'site', {
			formello: {
				...settings,
				enabled_addons: addons,
			},
		} );
	};

	const filterAddon = ( element ) => {
		if ( 'all' === filter ) {
			return addons;
		}
		return element.info.category.some( ( e ) => e.slug === filter );
	};

	if ( ! addons ) {
		return <LoadingSpinner text={ __( 'Loading addons', 'formello' ) } />;
	}

	return (
		<Fragment>
			<Header title={ __( 'Addons', 'formello' ) } />
			<div className="setting-tabs">
				<TabPanel
					tabs={ addonsTabs }
					onSelect={ ( tabName ) => setFilter( tabName ) }
					initialTabName={ 'all' }
				>
					{ () => {
						return (
							<Grid columns={ 3 }>
								{
									addons.filter( ( element ) => {
										return filterAddon( element );
									} ).map( ( addon ) => {
										return (
											<Addon
												info={ addon.info }
												slug={ addon.slug }
												addons={ enabled }
												handleAddonChange={ handleAddonChange }
												key={ addon.info.id }
											/>
										);
									} )
								}
							</Grid>
						);
					} }
				</TabPanel>
			</div>
		</Fragment>
	);
}
