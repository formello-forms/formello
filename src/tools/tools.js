import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	PanelRow,
	PanelBody,
	Button,
	RadioControl,
	SelectControl,
} from '@wordpress/components';
import { Fragment, render } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import getIcon from '../utils/get-icon';

function App() {
	return (
		<div className="formello-settings-header">
			<div className="formello-container">
				<h1>{ getIcon( 'logo' ) }{ __( 'Tools' ) }</h1>
			</div>
		</div>
	);
}



window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-block-tools' )
	);
} );