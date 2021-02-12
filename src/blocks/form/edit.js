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

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withDispatch, useDispatch, useSelect, select } from '@wordpress/data';

import {
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';

import apiFetch from '@wordpress/api-fetch';

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
} from '@wordpress/components';
import { cog, more, insert } from '@wordpress/icons';
import classnames from 'classnames';

import MergeTags from '../components/merge-tags';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'formello/actions',
	'formello/columns',
	'formello/button',
	'formello/input',
	'formello/email',
	'formello/checkboxes',
	'formello/select',
];

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
	hasChildBlocks
} ) {

	const updateSetting = ( name, value ) => {
		var newSettings = Object.assign( {}, attributes.settings );
		newSettings[ name ] = value;
		setAttributes( { settings: newSettings } );
	};
	useEffect(
		() => {
			if( attributes.name.length < 1 ){
				let idx = clientId.substr( 2, 9 ).replace( '-', '' ).replace(/-/g, '')
				setAttributes( {
					name: 'form-' + idx
				} )
			}			
			if( undefined == attributes.id ){
				apiFetch( {
					path: '/formello/v1/form/create',
					method: 'POST',
					data: {
						name: attributes.name
					},
				} ).then( ( result ) => {
					setAttributes({
						id: result.id
					});
				} );
			}

			setAttributes( {
				blockId: clientId,
			} )		
		},
		[]
	);

	className = classnames( className, {
		'column': !attributes.asRow,
	} )

	return (
		<div>
			<InspectorControls>
				<PanelBody title="Form Settings" initialOpen={ true }>
					<TextControl
						label={ __( 'Name', 'formello' ) }
						value={ attributes.name }
						onChange={ ( val ) => setAttributes( { 'name': val } ) }
					/>
					<ToggleControl
						label={ __( 'Display in row', 'formello' ) }
						checked={ attributes.asRow }
						onChange={ ( val ) => setAttributes( { 'asRow': val } ) }
					/>
					<TextControl
						label={ __( 'Redirect Url', 'formello' ) }
						value={ attributes.redirectUrl }
						onChange={ ( val ) => setAttributes( { 'redirectUrl': val } ) }
					/>
					<ToggleControl
						label={ __( 'Store submissions', 'formello' ) }
						checked={ attributes.storeSubmissions }
						onChange={ ( val ) => setAttributes( { 'storeSubmissions': val } ) }
					/>
					<ToggleControl
						label={ __( 'Enable ReCaptcha', 'formello' ) }
						checked={ attributes.recaptchaEnabled }
						onChange={ ( val ) => setAttributes( { 'recaptchaEnabled': val } ) }
					/>
					<ToggleControl
						label={ __(
							'Hide form after submission',
							'formello'
						) }
						checked={ attributes.hide }
						onChange={ ( val ) => setAttributes( { 'hide': val } ) }
					/>
					<TextareaControl
						label={ __( 'Success Message', 'formello' ) }
						value={ attributes.successMessage }
						onChange={ ( val ) => setAttributes( { 'successMessage': val } ) }
					/>
					<TextareaControl
						label={ __( 'Error Message', 'formello' ) }
						value={ attributes.errorMessage }
						onChange={ ( val ) => setAttributes( { 'errorMessage': val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<form className={ className }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					templateLock={ false }
					renderAppender={ ( hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> ) }
				/>
			</form>
		</div>
	);
}
