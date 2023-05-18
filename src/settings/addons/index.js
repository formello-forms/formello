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
	Notice
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import LoadingSpinner from '../components/loading-spinner.js';
import Addon from './addon.js';
import {
	useSelect,
	useDispatch
} from '@wordpress/data';
import {
	store as coreStore,
} from '@wordpress/core-data';
import {
	render,
} from '@wordpress/element';
import '../style.scss';

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
			getEntityRecord( 'root', 'site' );
		return fetchedSettings?.formello;
	} );

	const [ addons, setAddons ] = useState( [] );
	const [ filter, setFilter ] = useState( 'all' );
	const [ enabled, setEnabled ] = useState( Object.assign( [], settings?.enabled_addons ) );

	useEffect( () => {
		setEnabled( settings?.enabled_addons );
	}, [settings] );

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

	function handleAddonChange( checked, addonName ) {
		let enabledAddons = [ ...settings.enabled_addons ];

		if ( checked ) {
			enabledAddons.push( addonName );
		} else {
			enabledAddons = without(
				enabledAddons,
				addonName
			);
		}
		setEnabled( enabledAddons );
		updateAddons( enabledAddons );
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
							<Fragment>							
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
							</Fragment>
						);
					} }
				</TabPanel>
			</div>
		</Fragment>
	);
}

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<Addons />,
		document.getElementById( 'formello-plugin-settings' )
	);
} );
