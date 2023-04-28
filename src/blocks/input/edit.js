import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
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

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const {
		type,
	} = attributes;

	const supported = SUPPORTED_ATTRIBUTES[ type ];

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

	const borderProps = useBorderProps( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );

	const containerClass = classnames( {
		formello: true,
		'formello-group': attributes.withButton || 'range' === type,
		'formello-group grouped': attributes.grouped,
		'formello-checkbox':
			'checkbox' === type || 'radio' === type || 'hidden' === type,
	} );

	const inputStyle = {
		...borderProps.style,
		...spacingProps.style
	}

	const blockProps = useBlockProps( {
		className: containerClass,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'formello/button', 'formello/output' ],
		orientation: 'horizontal',
		renderAppender: false,
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
				<Label { ...props } htmlFor="input" />
			) : (
				<div className="formello-hidden">
					<Hidden width="30" height="30" />
					<label htmlFor="input">[{ attributes.name }] </label>
				</div>
			) }

			<input
				className={ borderProps.className }
				style={ inputStyle }
				type={ type }
				value={ 'password' !== type ? attributes.value : '' }
				checked={ attributes.checked || false }
				step={ attributes.step || undefined }
				onChange={ onChange }
				placeholder={ attributes.placeholder }
				disabled={ 'file' === type || 'password' === type }
				autoComplete={ attributes.autocomplete || 'new-password' }
			/>

			{ children }

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
