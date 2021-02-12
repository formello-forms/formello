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
import apiFetch from '@wordpress/api-fetch';

import {
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	SelectControl,
	Slot
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

    const blockProps = useBlockProps();

	const { setAttributes, isSelected, attributes } = props;

	const [ lists ] = useState( [{ value: null, label: 'Select a List', disabled: false }] );
	const [ fields ] = useState( [] );

	useEffect(
		() => {		
			apiFetch( {
				path: '/formello/v1/mailchimp/list',
				method: 'POST',
				data: {
					key: formello.settings.integrations.mailchimp.key
				},
			} ).then( ( result ) => {
				result.lists.forEach(function (item, index) {
					setState({ lists: [...this.state.lists, { value: item.id, label: item.name } ] })
					lists.push( { value: item.id, label: item.name } )
				});
			} );
			if( attributes.type.length < 1 ){
				setAttributes( {
					type: 'mailchimp'
				} )
			}	
		},
		[]
	);
	
	const getMergeFields = ( list ) => {
		if( !list ){
			return
		}
		apiFetch( {
			path: '/formello/v1/mailchimp/merge-fields',
			method: 'POST',
			data: {
				key: formello.settings.integrations.mailchimp.key,
				list: list
			},
		} ).then( ( result ) => {
			result.merge_fields.forEach(function (item, index) {
				console.log(item)
				fields.push( { value: item.id, label: item.name } )
			});
		} );
	}

	return (
        <div { ...blockProps }>
			<InspectorControls>
				<PanelBody title="Field Options" initialOpen={ true }>
					<TextControl
						label="Name"
						value={ attributes.name }
						onChange={ ( newval ) =>
							setAttributes( { name: newval } )
						}
					/>
				    <SelectControl
				        label="List"
				        value={ attributes.settings.list }
				        options={ lists }
						onChange={ ( newval ) => {
							console.log(newval)
							setAttributes( { 
								settings: {
									...attributes.settings,
									list: newval
								},
							} )
							getMergeFields( newval )
						} }
				    />					
					<Slot name="example-slot" />
				</PanelBody>
			</InspectorControls>
			<b>[Mailchimp] { attributes.name ? ' - ' + attributes.name : '' }</b>
		</div>
	);
}
