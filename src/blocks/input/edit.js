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

import { Hidden } from '../../icons/icons';
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
		showHelp,
		id,
		name,
		grouped,
		withButton,
		checked,
		value,
		step,
		placeholder,
		autocomplete,
		help,
		label,
	} = attributes;

	const TagName = type === 'textarea' ? 'textarea' : 'input';
	const supported = SUPPORTED_ATTRIBUTES[ type ];
	const idx = clientId.substr( 2, 6 ).replace( '-', '' ).replace( /-/g, '' );

	useEffect( () => {
		const idx = clientId
			.substr( 2, 6 )
			.replace( '-', '' )
			.replace( /-/g, '' );
		if ( ! id ) {
			setAttributes( {
				id: 'field_' + idx,
			} );
		}
		if ( ! name ) {
			setAttributes( {
				name: 'field_' + idx,
			} );
		}
	}, [] );

	const borderProps = useBorderProps( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );

	const containerClass = classnames( {
		formello: true,
		'formello-group': withButton || 'range' === type,
		'formello-group grouped': grouped,
		'formello-checkbox':
			'checkbox' === type || 'radio' === type || 'hidden' === type,
	} );

	const inputStyle = {
		...borderProps.style,
		...spacingProps.style,
	};

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
			setAttributes( { checked: ! checked } );
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
				{ 'hidden' !== type && (
					<ValidationOptions { ...props } fieldType={ type } />
				) }
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType={ type } />
			</InspectorAdvancedControls>

			{ 'hidden' !== type ? (
				<Label { ...props } htmlFor="input" />
			) : (
				<div className="formello-hidden">
					<Hidden width="30" height="30" />
					<label htmlFor="input">[{ name }] </label>
				</div>
			) }

			<TagName
				className={ borderProps.className }
				style={ inputStyle }
				type={ 'password' !== type ? type : 'text' }
				value={ 'password' !== type ? value : '' }
				checked={ checked || false }
				step={ step || undefined }
				onChange={ onChange }
				placeholder={ placeholder }
				disabled={ 'file' === type }
				autoComplete={ autocomplete || 'new-password' }
			/>

			{ children }

			{ 'hidden' !== type && showHelp && (
				<RichText
					tagName="small"
					value={ help }
					onChange={ ( val ) => setAttributes( { help: val } ) }
					placeholder={ __( 'Enter help message…', 'formello' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
					] }
					multiline={ false }
				/>
			) }
		</div>
	);
}
