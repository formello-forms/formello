import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';

import { ToolbarGroup } from '@wordpress/components';

import { useEffect } from '@wordpress/element';

import classnames from 'classnames';

import Label from '../../components/label';
import Options from '../../components/field-options';
import ValidationOptions from '../../components/field-options/validation';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';

import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { name, id, cols, rows, value, placeholder, showHelp, help, advanced } =
		attributes;

	const supported = SUPPORTED_ATTRIBUTES.textarea;

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

	const className = classnames( 'formello', 'formello-textarea' );

	const fieldClassName = classnames( borderProps.className, {
		'formello-rtf': advanced,
	} );

	const blockProps = useBlockProps( {
		className,
	} );

	const onChange = ( e ) => {
		setAttributes( { value: e.target.value } );
	};

	return (
		<div { ...blockProps }>
			<BlockControls>
				{ supported.includes( 'required' ) && (
					<ToolbarGroup>
						<Toolbar { ...props } />
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls>
				<Options { ...props } fieldType="textarea" />
				<ValidationOptions { ...props } fieldType="textarea" />
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType="textarea" />
			</InspectorAdvancedControls>

			<Label { ...props } htmlFor="textarea" />
			<textarea
				cols={ cols }
				rows={ rows }
				value={ value }
				onChange={ onChange }
				placeholder={ placeholder }
				className={ fieldClassName }
				style={ borderProps.style }
			></textarea>

			{ showHelp && (
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
