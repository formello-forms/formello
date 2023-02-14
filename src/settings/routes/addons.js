import Header from '../components/masthead.js';
import { __ } from '@wordpress/i18n';
import {
	useState,
	Fragment,
	useEffect
} from '@wordpress/element';
import { Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import LoadingSpinner from '../components/loading-spinner.js';
import Addon from '../components/addons/addon.js';

export default function Addons( props ) {

	const [ addons, setAddons ] = useState(false);
	const [ filter, setFilter ] = useState('all');

	useEffect( () => {
		apiFetch( {
			path: '/formello/v1/addons/',
			method: 'GET',
		} ).then( ( result ) => {
			setAddons( result.response.products )
		}, ( error ) => {
			console.log(error)
		} );		
	}, [] )

	const filterAddon = (element) => {
		if( 'all' === filter ){
			return addons;
		}
		return element.info.category.some( e => e.slug === filter )
	}

	if( ! addons ){
		return <LoadingSpinner text={ __( 'Loading addons', 'formello' ) } />
	}

	return (
		<Fragment>
			<Header title={ __( 'Addons', 'formello' ) } />
			<div className="setting-tabs">
				<div className="components-tab-panel__tabs">
					<Button 
						className="components-button components-tab-panel__tabs-item"
						onClick={ () => setFilter('all') }
					>
						{ __( 'All', 'formello' ) }
					</Button>
					<Button 
						className="components-button components-tab-panel__tabs-item"
						onClick={ () => setFilter('integrations') }
					>
						{ __( 'Email', 'formello' ) }
					</Button>
					<Button 
						className="components-button components-tab-panel__tabs-item"
						onClick={ () => setFilter('utility') }
					>
						{ __( 'Utility', 'formello' ) }
					</Button>
					<Button 
						className="components-button components-tab-panel__tabs-item"
						onClick={ () => setFilter('free') }
					>
						{ __( 'Free', 'formello' ) }
					</Button>
				</div>
				<div className="components-tab-panel__tab-content">
					<div className="inner-container addons">
					{
						addons.filter((element) => {
							return filterAddon(element)
						}).map( ( addon ) => {
							return ( <Addon info={ addon.info } key={ addon.info.id } /> )
						} )
					}
					</div>
				</div>
			</div>
		</Fragment>
	)
}