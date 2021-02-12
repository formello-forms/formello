import { __ } from '@wordpress/i18n';
import './editor.scss';

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
export default function Edit( {
	attributes,
	className,
	setAttributes,
	clientId,
} ) {

	const supported = SUPPORTED_ATTRIBUTES[attributes.type]

	useEffect(
		() => {
			let idx = clientId.substr( 2, 6 ).replace( '-', '' ).replace(/-/g, '')
			setAttributes( {
				id: 'field-' + idx,
			} )			
			if( attributes.name.length < 1 ){
				setAttributes( {
					name: 'field-' + idx,
				} )	
			}			
		},
		[]
	);
	className = classnames( {
		'formello': true,
		'formello-row formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
	} )

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
						onChange={ ( val ) => setAttributes( { name: val.replace(/\s+/g, '_') } ) }
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
							value={ attributes.placeholder ? attributes.placeholder : '' }
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
							<NumberControl
								label={ __( 'Min Length', 'formello' ) }
								value={ attributes.minlength || '' }
								onChange={ ( val ) =>
									setAttributes( { minlength: val } )
								}
							/>
							<NumberControl
								label={ __( 'Max Length', 'formello' ) }
								value={ attributes.maxlength || '' }
								onChange={ ( val ) =>
									setAttributes( { maxlength: val } )
								}
							/>
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
						<NumberControl
							label={ __( 'Cols', 'formello' ) }
							value={ attributes.cols || '' }
							onChange={ ( val ) =>
								setAttributes( { cols: val } )
							}
						/>
						<NumberControl
							label={ __( 'Rows', 'formello' ) }
							value={ attributes.rows || '' }
							onChange={ ( val ) =>
								setAttributes( { rows: val } )
							}
						/>
						</Fragment>
					) }
					{
						('hidden' == attributes.type || 
						'checkbox' == attributes.type || 
						'email' == attributes.type) &&
							<p>No advanced options for this field type.</p>						
					}
				</PanelBody>
				<PanelBody title="CSS Class" initialOpen={ false }>
					<SelectControl
				        label={ __( 'Label alignment', 'formello' ) }
				        value={ attributes.labelAlign }
				        options={ [
				            { label: 'left', value: 'align-left' },
				            { label: 'right', value: 'align-right' }
				        ] }
				        onChange={ ( align ) => { setAttributes( { labelAlign: align } ) } }
					/>
					<SelectControl
				        label={ __( 'Label vertical alignment', 'formello' ) }
				        value={ attributes.labelVAlign }
				        options={ [
				            { label: 'top', value: 'align-top' },
				            { label: 'center', value: 'align-center' },
				            { label: 'bottom', value: 'align-bottom' }
				        ] }
				        onChange={ ( align ) => { setAttributes( { labelVAlign: align } ) } }
					/>
					<TextControl
						label={ __( 'Label Class', 'formello' ) }
						value={ attributes.labelClass }
						onChange={ ( val ) =>
							setAttributes( { labelClass: val } )
						}
					/>
					<TextControl
						label={ __( 'Field Class', 'formello' ) }
						value={ attributes.fieldClass }
						onChange={ ( val ) =>
							setAttributes( { fieldClass: val } )
						}
					/>
					<TextControl
						label={ __( 'Description Class', 'formello' ) }
						value={ attributes.descriptionClass }
						onChange={ ( val ) =>
							setAttributes( { descriptionClass: val } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			{ !(attributes.type == 'hidden') ? (
			<label
				className={ attributes.labelClass }
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
			{ attributes.type == 'textarea' ? (
				<textarea
					readOnly
					cols={ attributes.cols }
					rows={ attributes.rows }
					className={ attributes.fieldClass }
					name={ attributes.name }
					required={ attributes.required }
					placeholder={ attributes.placeholder }
				></textarea>
			) : (
				<input
					className={ attributes.fieldClass }
					type={ attributes.type }
					value={ attributes.value }
					/*value={
						('text' == attributes.type || 
						'number' == attributes.type || 
						'email' == attributes.type) 
							? attributes.value
							: undefined
					}*/
					readOnly
					disabled={ true }
					//disabled={ attributes.type == 'color' ? true : false }
					//checked={ attributes.type == 'checkbox' ? attributes.checked : false }
					checked={ attributes.checked }
					//required={ attributes.required }
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
