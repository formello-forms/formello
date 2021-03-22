/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelRow } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import DisplayOpts from '../../components/display-options'

import { SUPPORTED_ATTRIBUTES } from './constants';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function InputOptions( props ) {

	const {
		attributes,
		setAttributes,
		onChange
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

	return (
		<Fragment>

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
						className={ 'formello-flex' }
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

					{
						'hidden' != attributes.type &&
						<Fragment>
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
						</Fragment>
					}
					{
						'hidden' == attributes.type &&
						<p>No advanced options for this field type.</p>						
					}
				</PanelBody>
				<PanelBody title="CSS Class" initialOpen={ false }>

					<DisplayOpts { ...props } />

				</PanelBody>
			</InspectorControls>

		</Fragment>
	);
}