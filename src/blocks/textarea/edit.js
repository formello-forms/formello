import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
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

	const supported = SUPPORTED_ATTRIBUTES[ 'textarea' ];

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

	const className = classnames( 'formello', 'formello-textarea' );

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
				<Options { ...props } />
				<ValidationOptions { ...props } />
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } />
			</InspectorAdvancedControls>

			<Label { ...props } htmlFor="input" />
			<textarea
				type={ attributes.type }
				cols={ attributes.cols }
				rows={ attributes.rows }
				value={ attributes.value || '' }
				onChange={ onChange }
				className={ attributes.fieldClass }
				placeholder={ attributes.placeholder }
			></textarea>

			{ attributes.showHelp && (
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
