/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

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
export default function Edit( {
	attributes,
	className,
	setAttributes,
	clientId,
} ) {
	const [ options, setOptions ] = useState( attributes.options );

	const checkboxes = ( count ) => {
		let templates = [];

		for ( let i = 0; i < count; i++ ) {
			templates.push( [ 'formello/input', { type: 'checkbox' } ] );
		}

		return templates;
	};

	return (
		<>
			<div className={ className }>
				<InspectorControls>
					<PanelBody title="Field Options" initialOpen={ true }>
						<ToggleControl
							label="Show legend"
							checked={ attributes.showLegend }
							onChange={ ( newval ) =>
								setAttributes( { showLegend: newval } )
							}
						/>
					</PanelBody>
				</InspectorControls>
				<fieldset>
					{ attributes.showLegend && (
						<RichText
							tagName="legend"
							className={ className }
							value={ attributes.legend }
							onChange={ ( legend ) =>
								setAttributes( { legend } )
							}
							placeholder={ __( 'Enter legend...', 'formello' ) }
							allowedFormats={ [] }
							keepPlaceholderOnFocus={ true }
						/>
					) }
					<InnerBlocks
						template={ checkboxes( 3 ) }
						templateInsertUpdatesSelection={ false }
						allowedBlocks={ [ 'formello/input' ] }
						renderAppender={ () => (
							<Tooltip text={ __( 'Add Checkbox', 'formaster' ) }>
								<Button
									icon={ 'insert' }
									onClick={ () => {
										wp.data
											.dispatch( 'core/block-editor' )
											.insertBlocks(
												createBlock(
													'formello/input', { 			
														name: 'checkbox',
														type: 'checkbox',
														label: 'Option',
														supported: ['required','checked'] 
													}
												),
												undefined,
												clientId
											);
									} }
								/>
							</Tooltip>
						) }
					/>
				</fieldset>
			</div>
		</>
	);
}
