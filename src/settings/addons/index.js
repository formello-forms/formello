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
			name: 27,
			title: __( 'Integrations', 'formello' ),
		},
		{
			name: 30,
			title: __( 'Utility', 'formello' ),
		},
		{
			name: 4,
			title: __( 'Free', 'formello' ),
		},
	];

	const settings = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const fetchedSettings =
			getEntityRecord( 'root', 'site' );
		return fetchedSettings?.formello;
	} );

	const [ addons, setAddons ] = useState( false );
	const [ filter, setFilter ] = useState( 'all' );
	const [ enabled, setEnabled ] = useState( Object.assign( [], settings?.enabled_addons ) );

	useEffect( () => {
		setEnabled( settings?.enabled_addons );
	}, [settings] );

	useEffect( () => {

		if( 'formello.net' === window.location.host ){
			apiFetch({
				path: '/wp/v2/edd-downloads?per_page=100'
			})
			.then( data => setAddons( data ) )
			.catch( err => console.log('Request Failed', err) ); // gestisci gli errori
		
		} else {
			const url = `https://formello.net/en/wp-json/wp/v2/edd-downloads?per_page=100`;

			const res = fetch( url )
				// gestisci il successo
				.then( response => response.json() )  // converti a json
				.then( data => setAddons( data ) )
				.catch( err => console.log('Request Failed', err) ); // gestisci gli errori
		}

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
		return element['edd-categories'].some( ( e ) => e === filter );
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
													info={ addon }
													slug={ addon.slug }
													addons={ enabled }
													handleAddonChange={ handleAddonChange }
													key={ addon.id }
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
