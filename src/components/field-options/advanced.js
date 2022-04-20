/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	applyFilters,
} from '@wordpress/hooks';

import { 
	TextControl, 
	SelectControl, 
	PanelRow, 
	PanelBody, 
	ToggleControl,
	BaseControl,
	__experimentalInputControl as InputControl,
	TextareaControl,
	SlotFillProvider,
	Slot,
	withFilters
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';

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
export default function AdvancedOptions( props ) {

	const {
		attributes,
		setAttributes,
		onChange
	} = props;
	
	const supported = SUPPORTED_ATTRIBUTES[attributes.type]

	return (
		<Fragment>

			{
			supported.includes('step') && 
					<Fragment>
						<BaseControl>
						<InputControl
							label={ __( 'Min Value', 'formello' ) }
							value={ attributes.min || '' }
							min={ '0' }
							type={ 'range' == attributes.type ? 'number' : attributes.type }
							onChange={ ( val ) =>
								setAttributes( { min: val } )
							}
						/>
						</BaseControl>
						<BaseControl>
						<InputControl
							label={ __( 'Max Value', 'formello' ) }
							value={ attributes.max || '' }
							type={ 'range' == attributes.type ? 'number' : attributes.type }
							onChange={ ( val ) =>
								setAttributes( { max: val } )
							}
						/>
						</BaseControl>
						<BaseControl>
						<InputControl
							type="number"
							label={ __( 'Step Value', 'formello' ) }
							value={ attributes.step || '' }
							onChange={ ( val ) =>
								setAttributes( { step: val } )
							}
						/>
						</BaseControl>
					</Fragment>
			}
			{
				supported.includes('minlength') && true !== attributes.datepicker && 
					<Fragment>
					<BaseControl>
						<InputControl
							type="number"
							label={ __( 'Min Characters', 'formello' ) }
							value={ attributes.minlength || '' }
							onChange={ ( val ) =>
								setAttributes( { minlength: val } )
							}
						/>
					</BaseControl>
					<BaseControl>
						<InputControl
							type="number"
							label={ __( 'Max Characters', 'formello' ) }
							value={ attributes.maxlength || '' }
							onChange={ ( val ) =>
								setAttributes( { maxlength: val } )
							}
						/>
					</BaseControl>
					</Fragment>
			}
			{
				supported.includes('pattern') && true !== attributes.datepicker && 
					<Fragment>
					<BaseControl>
					<InputControl
						label={ __( 'Pattern', 'formello' ) }
						value={ attributes.pattern || '' }
						onChange={ ( val ) =>
							setAttributes( { pattern: val } )
						}
					/>
					</BaseControl>
					</Fragment>
			}
			{ 'hidden' !== attributes.type &&
				<BaseControl>
					<InputControl
						label={ __( 'Custom Validation Message', 'formello' ) }
						value={ attributes.validation }
						onChange={ ( val ) => setAttributes( { validation: val } ) }
					/>
				</BaseControl>
			}
			{ 'textarea' === attributes.type && (
				<Fragment>
				<BaseControl>
					<InputControl
						type="number"
						label={ __( 'Cols', 'formello' ) }
						value={ attributes.cols }
						onChange={ ( val ) =>
							setAttributes( { cols: Number(val) } )
						}
					/>
				</BaseControl>
				<BaseControl>
					<InputControl
						type="number"
						label={ __( 'Rows', 'formello' ) }
						value={ attributes.rows }
						onChange={ ( val ) =>
							setAttributes( { rows: Number(val) } )
						}
					/>
				</BaseControl>
				</Fragment>
			) }
			{
				'hidden' !== attributes.type &&
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
				[ 'text', 'url', 'email', 'number', 'tel' ].includes( attributes.type ) &&
				<Fragment>
					<ToggleControl
						label={ __( 'Show button', 'formello' ) }
						checked={ attributes.withButton }
						onChange={ ( newval ) =>
							setAttributes( { withButton: newval } )
						}
					/>
				</Fragment>
			}
			{ attributes.withButton && 
				<ToggleControl
					label={ __(
						'Group button with input',
						'formello'
					) }
					checked={ attributes.grouped }
					onChange={ ( val ) =>
						setAttributes( { 
							grouped: val
						} )
					}
				/>						
			}
			{ 'range' === attributes.type && 
				<ToggleControl
					label={ __(
						'Show output',
						'formello'
					) }
					checked={ attributes.withOutput }
					onChange={ ( val ) =>
						setAttributes( { 
							withOutput: val
						} )
					}
				/>						
			}
			{
				'hidden' == attributes.type &&
				<p>No advanced options for this field type.</p>						
			}

		</Fragment>
	);
}