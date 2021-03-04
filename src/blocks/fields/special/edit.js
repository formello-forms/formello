/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	RichText,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	Panel,
	Tooltip,
	PanelBody,
	TextareaControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	Icon,
	Button,
	Draggable,
} from '@wordpress/components';
import { cog, more, insert } from '@wordpress/icons';

import { useState } from '@wordpress/element';

const { createBlock } = wp.blocks;

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {

	return (
		<>
			<div className="formello-group">
				<InnerBlocks
					templateLock={ 'all' }
					templateInsertUpdatesSelection={ false }
					allowedBlocks={ [ 'formello/input', 'formello/button' ] }
				/>
			</div>
		</>
	);
}
