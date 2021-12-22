/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { 
	TextControl, 
	SelectControl, 
	PanelRow, 
	PanelBody, 
	ToggleControl,
	BaseControl,
	__experimentalInputControl as InputControl,
	TextareaControl 
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import MergeTags from '../merge-tags';

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
export default function Options( props ) {

	const {
		attributes,
		setAttributes,
		clientId
	} = props;
	
	const supported = SUPPORTED_ATTRIBUTES[attributes.type]

	return (
		<Fragment>
			<PanelBody title={ __( 'Options', 'formello' ) } initialOpen={ true }>
				<BaseControl>
				<InputControl
					label={ __( 'Name', 'formello' ) }
					value={ attributes.name }
					onChange={ ( val ) => setAttributes( { name: val.replace(/\W/g, '_').toLowerCase() } ) }
				/>
				</BaseControl>
				{
					!(attributes.type == 'hidden') &&					
				<BaseControl>
				<InputControl
					label={ __( 'Label', 'formello' ) }
					value={ attributes.label }
					onChange={ ( val ) => setAttributes( { label: val } ) }
				/>
				</BaseControl>
				}
				{
					supported.includes('value') && 
					<MergeTags 
						className={ 'formello-flex' }
						clientId={ clientId }
						label={ __( 'Value', 'formello' ) }
						value={ attributes.value }
						onChange={ ( val ) => {
							setAttributes( { value: val } )
						} }
					/>
				}
				{
					supported.includes('placeholder') && 
					<BaseControl>
						<InputControl
							label={ __( 'Placeholder', 'formello' ) }
							value={ attributes.placeholder }
							onChange={ ( val ) =>
								setAttributes( { placeholder: val } )
							}
						/>
					</BaseControl>
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
							label={ __( 'Hide asterisk', 'formello' ) }
							checked={ attributes.hideRequired }
							onChange={ ( newval ) =>
								setAttributes( { hideRequired: newval } )
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
			</PanelBody>
		</Fragment>
	);
}