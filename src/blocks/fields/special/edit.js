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

import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

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
export default function Edit( { attributes, setAttributes, clientId } ) {
	const className = attributes.grouped ? 'formello-group grouped' : 'formello-group';

	const parentBlock = useSelect ( (select) => select( 'core/block-editor' ).getBlocksByClientId( clientId )[ 0 ] );
	const childBlocks = parentBlock.innerBlocks;
	const label = childBlocks[0].attributes.label;
	const help = childBlocks[0].attributes.help;

	useEffect(
		() => {
			setAttributes( {
				label: label,
			} )	
			setAttributes( {
				help: help,
			} )	
		},
		[label,help]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Options" initialOpen={ true }>
					<ToggleControl
						label={ __(
							'Group button with input',
							'formello'
						) }
						checked={ attributes.grouped }
						onChange={ ( val ) =>
							setAttributes( { 
								grouped: val
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ className }>
				<label>{ attributes.label }</label>
				<InnerBlocks
					templateLock={ 'all' }
					templateInsertUpdatesSelection={ false }
					allowedBlocks={ [ 'formello/input', 'formello/button' ] }
				/>
				<small>{ help }</small>
			</div>
		</>
	);
}
