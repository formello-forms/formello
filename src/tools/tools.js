import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	SelectControl,
	RadioControl,
	TabPanel
} from '@wordpress/components';

import { Fragment, render, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import getIcon from '../utils/get-icon';
import General from './general.js';
import Notices from './notices.js'

const tabs = [
	{
		name: 'general',
		title: 'General',
	},
];

const components = {
    general: General,
};

function App() {
	
	const [ isAPISaving, setAPISaving ] = useState('');
	const [ search, setSearch ] = useState('');
    const { createNotice, removeNotice } = useDispatch( noticesStore );
    
    const addNotice = ( status, content, type='snackbar' ) => {
        removeNotice( 'tools' )
        createNotice( status, content, {type: type, id: 'tools'} );
    }

	return (
		<Fragment>
			<div className="formello-settings-header">
				<div className="formello-container">
					<h1>{ getIcon( 'logo' ) }{ __( 'Tools' ) }</h1>
				</div>
			</div>
			<div className="formello-settings-main">

				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

				<TabPanel
					className='formello-tablist'
					tabs={ tabs }
				>
					{ ( tab ) => {
					    const ToolsTab = components[tab.name];

					    return <ToolsTab addNotice={ addNotice } />;

					}}

				</TabPanel>
				
				<Notices />
				
				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

			</div>

		</Fragment>

	);
}



window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-block-tools' )
	);
} );