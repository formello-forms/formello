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
//import './editor.scss';

import { useState, useRef, useEffect } from '@wordpress/element';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import { detect_similar_forms } from "../../components/merge-tags/functions";

import {
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	Popover,
	SelectControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	Icon,
	IconButton
} from '@wordpress/components';

import {
	InspectorControls,
	RichText,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';

import { cog, more, insert } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';
import MergeTags from '../../components/merge-tags';

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

	const { setAttributes, isSelected, attributes, clientId } = props;

	useEffect(
		() => {
			if( attributes.type.length < 1 ){
				setAttributes( {
					type: 'email'
				} )
			}				
			if( attributes.settings.length < 1 ){
				setAttributes( {
					settings: []
				} )
			}				
			if( attributes.name.length < 1 ){
				setAttributes( {
					name: 'action-' + clientId.substr( 2, 9 ).replace( '-', '' ).replace(/-/g, '')
				} )
			}				
		},
		[]
	);

	const updateSetting = ( name, value ) => {
		var newSettings = Object.assign( {}, attributes.settings );
		newSettings[ name ] = value;
		setAttributes( { settings: newSettings } );
	};

    const blockProps = useBlockProps();


	const handleChange = (event) => {
		const { value } = event.target;

		setAttributes({
			value,
		});
	};

	return (
        <div { ...blockProps }>
			<InspectorControls>
				<PanelBody title="Field Options" initialOpen={ true }>
					<TextControl
						label="Name"
						value={ attributes.name }
						onChange={ ( newval ) =>
							updateSetting( 'name', newval  )
						}
					/>
					<MergeTags {...props} 
						label="From"
						value={ attributes.settings.from }
						onChange={ ( val ) => { updateSetting( 'from', val ) } } />

					<MergeTags {...props} 
						label="To"
						value={ attributes.settings.to }
						onChange={ ( val ) => { updateSetting( 'to', val ) } } />

					<MergeTags {...props} 
						label="Reply To"
						value={ attributes.settings.replyTo }
						onChange={ ( val ) => { updateSetting( 'replyTo', val ) } } />

					<MergeTags {...props} 
						label="Subject"
						value={ attributes.settings.subject }
						onChange={ ( val ) => { updateSetting( 'subject', val ) } } />

					<TextareaControl
						label="Message"
						value={ attributes.settings.message }
						onChange={ ( message ) => updateSetting( 'message', message ) }
						placeholder={ __( 'Enter message...', 'formello' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<b>[Email] { attributes.name ? ' - ' + attributes.name : '' }</b>
		</div>
	);
}
