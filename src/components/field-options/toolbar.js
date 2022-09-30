/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { ToolbarButton } from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import getIcon from '../../utils/get-icon';
import { select } from '@wordpress/data';

export default function Toolbar( props ) {
	const { attributes, setAttributes, clientId } = props;

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
				label={ __( 'Required' ) }
				icon={ getIcon( 'asterisk' ) }
				isPressed={ attributes.required }
				onClick={ () => {
					setRequiredTxt();
					setAttributes( { required: ! attributes.required } );
				} }
			/>
			<ToolbarButton
				label={ __( 'Hide label' ) }
				icon={ 'hidden' }
				isPressed={ attributes.hideLabel }
				onClick={ () => {
					setAttributes( { hideLabel: ! attributes.hideLabel } );
				} }
			/>
			<ToolbarButton
				label={ __( 'Show help message' ) }
				icon={ 'editor-help' }
				isPressed={ attributes.showHelp }
				onClick={ () => {
					setAttributes( { showHelp: ! attributes.showHelp } );
				} }
			/>
		</Fragment>
	);
}
