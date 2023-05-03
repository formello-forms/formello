/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { ToolbarButton } from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import {
	Asterisk,
} from '../../icons/icons';
import { select } from '@wordpress/data';

export default function Toolbar( props ) {
	const { attributes, setAttributes, clientId } = props;
	const {
		required,
		showHelp,
		hideLabel,
	} = attributes;

	const setRequiredTxt = () => {
		const parent = select( 'core/block-editor' ).getBlockParents( clientId );
		const parentAtts = select( 'core/block-editor' ).getBlockAttributes(
			parent[ 0 ]
		);
		setAttributes( { requiredText: parentAtts.requiredText } );
	};

	return (
		<Fragment>
			<ToolbarButton
				label={ __( 'Required', 'formello' ) }
				icon={ Asterisk }
				isPressed={ required }
				onClick={ () => {
					setRequiredTxt();
					setAttributes( { required: ! required } );
				} }
			/>
			<ToolbarButton
				label={ __( 'Hide label', 'formello' ) }
				icon={ 'hidden' }
				isPressed={ hideLabel }
				onClick={ () => {
					setAttributes( { hideLabel: ! hideLabel } );
				} }
			/>
			<ToolbarButton
				label={ __( 'Show help message', 'formello' ) }
				icon={ 'editor-help' }
				isPressed={ showHelp }
				onClick={ () => {
					setAttributes( { showHelp: ! showHelp } );
				} }
			/>
		</Fragment>
	);
}
