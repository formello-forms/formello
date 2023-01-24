import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { ToolbarGroup } from '@wordpress/components';

import { useEffect } from '@wordpress/element';

import classnames from 'classnames';

import { 
	Hidden,
} from '../../icons/icons';
import Label from '../../components/label';
import Options from '../../components/field-options';
import ValidationOptions from '../../components/field-options/validation';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';

import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

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
	const { attributes, setAttributes, clientId } = props;
	const {
		name,
		id,
		type,
		label,
		hideLabel,
		value,
		placeholder,
		required,
		requiredText,
		readonly,
		showHelp,
		help
	} = attributes;

	const supported = SUPPORTED_ATTRIBUTES[ type ];
	const MY_TEMPLATE = [ [ 'formello/button', {} ] ];

	useEffect( () => {
		const idx = clientId.substr( 2, 6 ).replace( '-', '' ).replace( /-/g, '' );
		if ( ! attributes.id ) {
			setAttributes( {
				id: 'field_' + idx,
			} );
		}
		if ( ! attributes.name ) {
			setAttributes( {
				name: 'field_' + idx,
			} );
		}
	}, [] );

	const className = classnames( {
		formello: true,
		'formello-group': attributes.withButton || 'range' === type,
		'formello-group grouped': attributes.grouped,
		'formello-checkbox':
			'checkbox' === type || 'radio' === type,
		'formello-textarea': 'textarea' === type,
	} );

	const labelClassName = classnames( {
		hide: attributes.hideLabel
	} );

	const blockProps = useBlockProps( {
		className,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'formello/button' ],
		template: MY_TEMPLATE,
		templateLock: 'insert',
		orientation: 'horizontal',
	} );

	const onChange = ( e ) => {
		if ( 'checkbox' === type || 'radio' === type ) {
			setAttributes( { checked: ! attributes.checked } );
		}
		setAttributes( { value: e.target.value } );
	};

	return (
		<div { ...innerBlocksProps }>
			<BlockControls>
				{ supported.includes( 'required' ) && (
					<ToolbarGroup>
						<Toolbar { ...props } />
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls>
				<Options { ...props } fieldType={ type } />
				{
					'hidden' !== type &&
					<ValidationOptions { ...props } fieldType={ type } />
				}
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType={ type } />
			</InspectorAdvancedControls>

			{ 'hidden' !== type ? (
				<Label { ...props } className={ labelClassName } htmlFor="input" />
			) : (
				<div className="formello-hidden">
					<Hidden width="30" height="30" />
					<label htmlFor="input">[{ attributes.name }] </label>
				</div>
			) }

			<input
				className={ attributes.fieldClass }
				type={ type }
				value={ 'password' !== type ? attributes.value : '' }
				checked={ attributes.checked || false }
				step={ attributes.step || undefined }
				onChange={ onChange }
				placeholder={ attributes.placeholder }
				disabled={ 'file' === type }
				autoComplete={ attributes.autocomplete || 'new-password' }
			/>

			{ attributes.withButton && children }
			{ attributes.withOutput && <output></output> }
			{ 'hidden' !== type && attributes.showHelp && (
				<RichText
					tagName="small"
					value={ attributes.help }
					onChange={ ( val ) => setAttributes( { help: val } ) }
					placeholder={ __( 'Enter help message…', 'formello' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
					multiline={ false }
				/>
			) }
		</div>
	);
}
