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
	PanelRow,
	PanelBody,
	SelectControl,
	Slot
} from '@wordpress/components';

import {
	InspectorControls
} from '@wordpress/block-editor';

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
	const [ fields, setFields ] = useState( [] );

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
					lists.push( { value: item.id, label: item.name } )
				});
			} );
			if( attributes.type.length < 1 ){
				setAttributes( {
					type: 'mailchimp'
				} )
			}
			getMergeFields()
		},
		[]
	);

	const updateSetting = ( name, value ) => {
		var newSettings = Object.assign( {}, attributes.settings );
		newSettings[ name ] = value;
		setAttributes( { settings: newSettings } );
	};
	
	const updateMergeField = ( value, index, prop ) => {
		// 1. Make a shallow copy of the items
		var items = Object.assign( {}, attributes.settings.merge_fields );
		// 2. Replace the property you're intested in
		items[prop] = value;
		// 3. Set the state to our new copy
		setAttributes( { settings: { ...attributes.settings, merge_fields: items } } );
	}

	const getMergeFields = ( list ) => {

		if( list && list.indexOf(' ') >= 0 ){
			setFields( [] ) // reset fields
			return
		}

		if( attributes.settings.list.length || list ){

			apiFetch( {
				path: '/formello/v1/mailchimp/merge-fields',
				method: 'POST',
				data: {
					key: formello.settings.integrations.mailchimp.key,
					list: list ? list : attributes.settings.list
				},
			} ).then( ( result ) => {
				if( !result.merge_fields ){
					return
				}
				var arr = []
				result.merge_fields.forEach(function (item, index) {
					arr.push(item)
				});
				setFields( arr )			
			} );
		}
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
						onChange={ ( val ) => {
							setAttributes( { 
								settings: {
									...attributes.settings,
									list: val
								},
							} )
							getMergeFields( val )
						} }
				    />					

					<MergeTags {...props} 
						label="Email address"
						value={ attributes.settings.email_address }
						onChange={ ( val ) => { updateSetting( 'email_address', val ) } } />
						
					{ fields.map(( obj, index ) => {
						return <MergeTags {...props} 
									label={ obj.name }
									key={ index }
									value={ attributes.settings.merge_fields[obj.tag] ? attributes.settings.merge_fields[obj.tag] : '' }
									onChange={ ( val ) => { 
										updateMergeField( val, index, obj.tag ) } 
									} />
					})}

				</PanelBody>
			</InspectorControls>

			<b>[Mailchimp] { attributes.name ? ' - ' + attributes.name : '' }</b>
			
		</div>
	);
}
