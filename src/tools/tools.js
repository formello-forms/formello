import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	SelectControl,
	SlotFillProvider,
	TabPanel
} from '@wordpress/components';

import { Fragment, render, useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs, hasQueryArg } from '@wordpress/url';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import getIcon from '../utils/get-icon';
import General from './general.js';
import Notices from './notices.js'

const components = {
    general: General,
};

function App() {
	
	const [ isAPISaving, setAPISaving ] = useState('');
	const [ search, setSearch ] = useState('');
    const { createNotice, removeNotice } = useDispatch( noticesStore );
    
	useEffect( () => {

		if( !hasQueryArg( window.location.href, 'tab' ) ){
			console.log( window.location.href )
		}


	}, [] );

    const addNotice = ( status, content, type='snackbar' ) => {
        removeNotice( 'tools' )
        createNotice( status, content, {type: type, id: 'tools'} );
    }

	const toolsTabs = [
		{
			name: 'general',
			title: __( 'General', 'formello' ),
			className: 'setting-tabs__plugin-settings',
		},
	];

	applyFilters( 'formello.ToolsTabs', toolsTabs );

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		let newUrl = addQueryArgs( window.location.href, { tab: tabName } )
		window.history.replaceState( { path: newUrl }, '', newUrl );
	}

	return (
		<SlotFillProvider>
			<div className="formello-settings-header">
				<div className="formello-container">
					<h1>{ getIcon( 'logo' ) }{ __( 'Tools' ) }</h1>
				</div>
			</div>
			<div className="formello-settings-main">

				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

				<TabPanel
					className='formello-tablist'
					tabs={ toolsTabs }
					onSelect={ ( tabName ) => updateUrl( tabName ) }
					initialTabName={ initialTab }
				>
					{ ( tab ) => {

						switch ( tab.name ) {
							case 'general':
								return (
									<Fragment>
										<General
											addNotice={ addNotice }
										/>
									</Fragment>
								);
							default:
								return <Slot name="ToolsTabs" />;
						}
					}}

				</TabPanel>
				
				<Notices />
				
				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

			</div>

		</SlotFillProvider>

	);
}



window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-block-tools' )
	);
} );