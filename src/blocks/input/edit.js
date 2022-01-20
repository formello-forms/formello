import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	AlignmentToolbar,
	RichText,
	InnerBlocks,
	useBlockProps
} from '@wordpress/block-editor';

import {
	ToolbarGroup,
	ToolbarButton,
	PanelRow,
	PanelBody,
	TextareaControl,
	ToggleControl,
	BaseControl,
	SelectControl,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

//import './editor.scss';

import { useEffect, Fragment } from '@wordpress/element';

import classnames from 'classnames';

import getIcon from '../../utils/get-icon';
import MergeTags from '../../components/merge-tags';
import DisplayOpts from '../../components/css-options';
import Options from '../../components/field-options';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';

import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

const hiddenIcon = getIcon('hidden');
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

	const {
		attributes,
		setAttributes,
		clientId
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[attributes.type]
	const MY_TEMPLATE = [
	    [ 'formello/button', {} ],
	];

	useEffect(
		() => {
			let idx = clientId.substr( 2, 6 ).replace( '-', '' ).replace(/-/g, '')	
			if( !attributes.id ){
				setAttributes( {
					id: 'field_' + idx,
				} )	
			}			
			if( !attributes.name ){
				setAttributes( {
					name: 'field_' + idx,
				} )	
			}			
		},
		[]
	);
	const className = classnames( {
		'formello': true,
		'formello-group': attributes.withButton || 'range' === attributes.type,
		'formello-group grouped': attributes.grouped,
		'formello-row formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
		'formello-textarea': ( 'textarea' == attributes.type ),
	} )

	const labelClassName = classnames( attributes.labelClass, attributes.labelAlign, attributes.labelVAlign, {
		'hide': attributes.hideLabel,
		'required': attributes.required
	} );

	const blockProps = useBlockProps( {
		className: className,
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
			{
				supported.includes('required') &&
				<ToolbarGroup>
					<Toolbar {...props} />
				</ToolbarGroup>
			}
			</BlockControls>
			<InspectorControls>
				
				<Options {...props} />

				{
					'hidden' !== attributes.type &&
					<AdvancedOptions {...props} />
				}

			</InspectorControls>
			<InspectorAdvancedControls>
				<DisplayOpts { ...props } />
			</InspectorAdvancedControls>

			{ 'hidden' !== attributes.type ? (
				<RichText
					tagName="label"
					className={ labelClassName }
					value={ attributes.label }
					onChange={ ( val ) =>
						setAttributes( { label: val } )
					}
					placeholder={ __(
						'Enter label...',
						'formello'
					) }
					allowedFormats={ [] }
				/>
			)
			:
			(
			<div className='formello-hidden'>{ hiddenIcon }<label>[{ attributes.name }] </label></div>
			) }
			{ 'textarea' == attributes.type ? (
				<textarea
					readOnly
					type={ attributes.type }
					cols={ attributes.cols }
					rows={ attributes.rows }
					value={ attributes.value }
					className={ attributes.fieldClass }
					placeholder={ attributes.placeholder }
				></textarea>
			) : (
				<input
					className={ attributes.fieldClass }
					type={ attributes.type }
					value={ attributes.value }
					readOnly
					checked={ attributes.checked }
					placeholder={ attributes.placeholder }
				/>
			) }
			{ attributes.withButton && 
				<InnerBlocks
					allowedBlocks={ [ 'formello/button' ] }
					templateLock={ 'all' }
					template={ MY_TEMPLATE }
				/>
			}
			{ attributes.withOutput && 
				<output></output>
			}
			{ ('hidden' !== attributes.type && attributes.showHelp ) && 
				<RichText
					tagName="small"
					value={ attributes.help }
					onChange={ ( val ) => setAttributes( { help: val } ) }
					placeholder={ __( 'Enter help message...', 'formello' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
					] }
					multiline={ false }
				/>
			}
		</div>
	);
}
