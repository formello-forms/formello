import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	AlignmentToolbar,
	RichText,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	TextareaControl,
	SelectControl,
	__experimentalNumberControl as NumberControl,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

import { useEffect, Fragment } from '@wordpress/element';

import classnames from 'classnames';

import getIcon from '../../../utils/get-icon';
import MergeTags from '../../components/merge-tags';
import DisplayOpts from '../../components/display-options'

import { SUPPORTED_ATTRIBUTES } from './constants';

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

	useEffect(
		() => {
			let idx = clientId.substr( 2, 6 ).replace( '-', '' ).replace(/-/g, '')	
			if( !attributes.id ){
				setAttributes( {
					id: 'field_' + idx,
				} )	
			}			
		},
		[]
	);
	const className = classnames( {
		'formello': true,
		'formello-row formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
	} )

	let labelClassName = classnames( attributes.labelClass, attributes.labelAlign, attributes.labelVAlign );

	const label = ( val ) => {
		let txt = attributes.label
		if( attributes.hasTooltip ){
			txt += '<span>?</span>'
		}
		setAttributes( { label: txt } )
	}

	return (
		<div className={ className }>
			<InspectorControls>
				<PanelBody title="Field Options" initialOpen={ true }>
					<TextControl
						label={ __( 'Name', 'formello' ) }
						value={ attributes.name }
						onChange={ ( val ) => setAttributes( { name: val.replace(/\W/g, '') } ) }
					/>
					{
						!(attributes.type == 'hidden') &&					
					<TextControl
						label={ __( 'Label', 'formello' ) }
						value={ attributes.label }
						onChange={ ( val ) => setAttributes( { label: val } ) }
					/>
					}
					<MergeTags 
						clientId={ clientId }
						label={ __( 'Value', 'formello' ) }
						value={ attributes.value }
						onChange={ ( val ) => {
							setAttributes( { value: val } )
						} }
					/>
					{
						supported.includes('placeholder') && 
						<TextControl
							label={ __( 'Placeholder', 'formello' ) }
							value={ attributes.placeholder }
							onChange={ ( val ) =>
								setAttributes( { placeholder: val } )
							}
						/>
					}
					{
						supported.includes('required') && 
						<Fragment>
						<ToggleControl
							label={ __( 'Required', 'formello' ) }
							checked={ attributes.required }
							onChange={ ( newval ) =>
								setAttributes( { required: newval } )
							}
						/>
					{ attributes.required && (
						<ToggleControl
							label={ __( 'Mark as Required', 'formello' ) }
							checked={ attributes.markRequired }
							onChange={ ( newval ) =>
								setAttributes( { markRequired: newval } )
							}
						/>
					) }
						</Fragment>
					}
					{
						supported.includes('checked') && 
						<ToggleControl
							label={ __( 'Checked', 'formello' ) }
							checked={ attributes.checked }
							onChange={ ( newval ) =>
								setAttributes( { checked: newval } )
							}
						/>
					}
					{ !( 'hidden' == attributes.type ) && (
						<Fragment>
						<ToggleControl
							label={ __( 'Show Description', 'formello' ) }
							checked={ attributes.showHelp }
							onChange={ ( newval ) =>
								setAttributes( { showHelp: newval } )
							}
						/>
						</Fragment>		
					) }
					{
						!(attributes.type == 'hidden') &&					
						<ToggleControl
							label={ __( 'Add Tooltip', 'formello' ) }
							checked={ attributes.hasTooltip }
							onChange={ ( newval ) =>
								setAttributes( { hasTooltip: newval } )
							}
						/>
					}
					{ attributes.hasTooltip && (
						<TextareaControl
							label={ __( 'Tooltip message', 'formello' ) }
							help="Enter some useful text"
							value={ attributes.tooltip }
							onChange={ ( newval ) =>
								setAttributes( { tooltip: newval } )
							}
						/>
					) }
				</PanelBody>

				<PanelBody title="Advanced Options" initialOpen={ false }>
					{
					supported.includes('step') && 
							<Fragment>
								<InputControl
									label={ __( 'Min Value', 'formello' ) }
									value={ attributes.min || '' }
									min={ '0' }
									type={ 'range' == attributes.type ? 'number' : attributes.type }
									onChange={ ( val ) =>
										setAttributes( { min: val } )
									}
								/>
								<InputControl
									label={ __( 'Max Value', 'formello' ) }
									value={ attributes.max || '' }
									type={ 'range' == attributes.type ? 'number' : attributes.type }
									onChange={ ( val ) =>
										setAttributes( { max: val } )
									}
								/>
								<NumberControl
									label={ __( 'Step Value', 'formello' ) }
									value={ attributes.step || '' }
									onChange={ ( val ) =>
										setAttributes( { step: val } )
									}
								/>
							</Fragment>
					}
					{
						supported.includes('minlength') && 
							<Fragment>
							<PanelRow>
								<NumberControl
									label={ __( 'Min Length', 'formello' ) }
									value={ attributes.minlength || '' }
									onChange={ ( val ) =>
										setAttributes( { minlength: val } )
									}
								/>
							</PanelRow>
							<PanelRow>
								<NumberControl
									label={ __( 'Max Length', 'formello' ) }
									value={ attributes.maxlength || '' }
									onChange={ ( val ) =>
										setAttributes( { maxlength: val } )
									}
								/>
							</PanelRow>
							</Fragment>
					}
					{
						supported.includes('pattern') && 
							<Fragment>
							<TextControl
								label={ __( 'Pattern', 'formello' ) }
								value={ attributes.pattern || '' }
								onChange={ ( val ) =>
									setAttributes( { pattern: val } )
								}
							/>
							<TextControl
								label={ __( 'Custom Validation Message', 'formello' ) }
								value={ attributes.validation }
								onChange={ ( val ) => setAttributes( { validation: val } ) }
							/>
							</Fragment>
					}
					{ 'textarea' == attributes.type && (
						<Fragment>
						<PanelRow>
							<NumberControl
								label={ __( 'Cols', 'formello' ) }
								value={ attributes.cols }
								onChange={ ( val ) =>
									setAttributes( { cols: val } )
								}
							/>
						</PanelRow>
						<PanelRow>
							<NumberControl
								label={ __( 'Rows', 'formello' ) }
								value={ attributes.rows }
								onChange={ ( val ) =>
									setAttributes( { rows: val } )
								}
							/>
						</PanelRow>
						</Fragment>
					) }
						<ToggleControl
							label={ __( 'Disabled', 'formello' ) }
							checked={ attributes.disabled }
							onChange={ ( newval ) =>
								setAttributes( { disabled: newval } )
							}
						/>
						<ToggleControl
							label={ __( 'Read only', 'formello' ) }
							checked={ attributes.readOnly }
							onChange={ ( newval ) =>
								setAttributes( { readOnly: newval } )
							}
						/>

					{
						('hidden' == attributes.type || 
						'checkbox' == attributes.type || 
						'email' == attributes.type) &&
							<p>No advanced options for this field type.</p>						
					}
				</PanelBody>
				<PanelBody title="CSS Class" initialOpen={ false }>

					<DisplayOpts { ...props } />

				</PanelBody>
			</InspectorControls>
			{ !(attributes.type == 'hidden') ? (
			<label
				className={ labelClassName }
				htmlFor={ attributes.id }
			>
				{ attributes.label }
				{ attributes.required && attributes.markRequired && (
					<span>*</span>
				) }
				{ attributes.hasTooltip && <span className='tooltip'>?</span> }

			</label>
			)
			:
			(
			<div className='formello-hidden'>{ hiddenIcon }<label>Hidden field [{ attributes.name }] </label></div>
			) }
			{ 'textarea' == attributes.type ? (
				<textarea
					readOnly
					cols={ attributes.cols }
					rows={ attributes.rows ? attributes.rows : 5 }
					value={ attributes.value }
					className={ attributes.fieldClass }
					placeholder={ attributes.placeholder }
					disabled={ true }
				></textarea>
			) : (
				<input
					className={ attributes.fieldClass }
					type={ attributes.type }
					value={ attributes.value }
					readOnly
					disabled={ true }
					checked={ attributes.checked }
					placeholder={ attributes.placeholder }
				/>
			) }
			{ attributes.showHelp && (
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
					keepPlaceholderOnFocus={ true }
					multiline={ false }
				/>
			) }
		</div>
	);
}
