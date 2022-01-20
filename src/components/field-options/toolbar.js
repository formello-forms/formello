/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { 
	TextControl, 
	SelectControl, 
	PanelRow, 
	PanelBody, 
	ToolbarButton,
	BaseControl,
	__experimentalInputControl as InputControl,
	TextareaControl 
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import getIcon from '../../utils/get-icon';

import { SUPPORTED_ATTRIBUTES } from './constants';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function Toolbar( props ) {

	const {
		attributes,
		setAttributes,
	} = props;
	
	const supported = SUPPORTED_ATTRIBUTES[attributes.type]

	return (
		<Fragment>
			<ToolbarButton
				label={ __( 'Required' ) }
				icon={ getIcon( 'asterisk' ) }
				isPressed={ attributes.required }
				onClick={ () => {
					setAttributes( { required: !attributes.required } )
				} }
			/>
			<ToolbarButton
				label={ __( 'Hide label' ) }
				icon={ 'hidden' }
				isPressed={ attributes.hideLabel }
				onClick={ () => {
					setAttributes( { hideLabel: !attributes.hideLabel } )
				} }
			/>
		</Fragment>
	);
}