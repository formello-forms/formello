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

import getIcon from '../../utils/get-icon';
import Label from '../../components/label';
import Options from '../../components/field-options';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';

import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

const hiddenIcon = getIcon( 'hidden' );
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

	const supported = SUPPORTED_ATTRIBUTES[ attributes.type ];
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
		'formello-group': attributes.withButton || 'range' === attributes.type,
		'formello-group grouped': attributes.grouped,
		'formello-checkbox':
			'checkbox' === attributes.type || 'radio' === attributes.type,
		'formello-textarea': 'textarea' === attributes.type,
	} );

	const blockProps = useBlockProps( {
		className,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'formello/button' ],
		template: MY_TEMPLATE,
		templateLock: 'all',
		orientation: 'horizontal',
	} );

	const onChange = ( e ) => {
		if ( 'checkbox' === attributes.type || 'radio' === attributes.type ) {
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
				<Options { ...props } />
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } />
			</InspectorAdvancedControls>

			{ 'hidden' !== attributes.type ? (
				<Label { ...props } htmlFor="input" />
			) : (
				<div className="formello-hidden">
					{ hiddenIcon }
					<label htmlFor="input">[{ attributes.name }] </label>
				</div>
			) }
			{ 'textarea' === attributes.type ? (
				<textarea
					type={ attributes.type }
					cols={ attributes.cols }
					rows={ attributes.rows }
					value={ attributes.value || '' }
					onChange={ onChange }
					className={ attributes.fieldClass }
					placeholder={ attributes.placeholder }
				></textarea>
			) : (
				<input
					className={ attributes.fieldClass }
					type={ attributes.type }
					value={ attributes.value || '' }
					checked={ attributes.checked }
					onChange={ onChange }
					placeholder={ attributes.placeholder }
				/>
			) }
			{ attributes.withButton && children }
			{ attributes.withOutput && <output></output> }
			{ 'hidden' !== attributes.type && attributes.showHelp && (
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
