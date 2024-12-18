/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	Button,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import MergeTags from '../merge-tags';

import { SUPPORTED_ATTRIBUTES } from './constants';

const sanitizedName = ( content ) => {
	return (
		content
			// Convert anything that's not a letter or number to a hyphen.
			.replace( /[^\p{L}\p{N}]+/gu, '_' )
			// Convert to lowercase
			.toLowerCase()
			// Remove any remaining leading or trailing hyphens.
			.replace( /(^-+)|(-+$)/g, '' )
	);
};

export default function Options( props ) {
	const { attributes, setAttributes, clientId, setModalOpen, fieldType } =
		props;

	const {
		type,
		name,
		value,
		placeholder,
		required,
		multiple,
		checked,
		showHelp,
		advanced,
	} = attributes;

	const supported = SUPPORTED_ATTRIBUTES[ fieldType ];

	return (
		<Fragment>
			<PanelBody
				title={ __( 'Options', 'formello' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Name', 'formello' ) }
					value={ name }
					onChange={ ( val ) =>
						setAttributes( { name: sanitizedName( val ) } )
					}
					help={ __(
						'Affects the "name" attribute of the input element, and is used as a name for the form submission results.',
						'formello'
					) }
					__nextHasNoMarginBottom
				/>
				{ supported.includes( 'value' ) && (
					<MergeTags
						clientId={ clientId }
						label={ __( 'Value', 'formello' ) }
						value={ value }
						onChange={ ( val ) => {
							setAttributes( { value: val } );
						} }
						help={ __(
							'The initial value of the control field.',
							'formello'
						) }
					/>
				) }
				{ supported.includes( 'placeholder' ) && (
					<TextControl
						label={ __( 'Placeholder', 'formello' ) }
						value={ placeholder }
						onChange={ ( val ) =>
							setAttributes( { placeholder: val } )
						}
						help={ __(
							'Text that appears in the form control when it has no value set.',
							'formello'
						) }
						__nextHasNoMarginBottom
					/>
				) }
				{ supported.includes( 'required' ) && (
					<ToggleControl
						label={ __( 'Required', 'formello' ) }
						checked={ required }
						onChange={ ( val ) =>
							setAttributes( { required: val } )
						}
						__nextHasNoMarginBottom
					/>
				) }
				{ supported.includes( 'multiple' ) && (
					<ToggleControl
						label={ __( 'Multiple', 'formello' ) }
						checked={ multiple }
						onChange={ ( val ) =>
							setAttributes( { multiple: val } )
						}
						__nextHasNoMarginBottom
					/>
				) }
				{ supported.includes( 'checked' ) && (
					<ToggleControl
						label={ __( 'Checked', 'formello' ) }
						checked={ checked }
						onChange={ ( newval ) =>
							setAttributes( { checked: newval } )
						}
						__nextHasNoMarginBottom
					/>
				) }
				{ ! ( 'hidden' === type ) && (
					<ToggleControl
						label={ __( 'Show help message', 'formello' ) }
						checked={ showHelp }
						onChange={ ( newval ) =>
							setAttributes( { showHelp: newval } )
						}
						__nextHasNoMarginBottom
					/>
				) }
				{ 'select' === fieldType && (
					<Fragment>
						<ToggleControl
							label={ __( 'Advanced', 'formello' ) }
							checked={ advanced }
							onChange={ ( val ) => {
								setAttributes( { advanced: val } );
							} }
							__nextHasNoMarginBottom
						/>
						<Button
							variant={ 'primary' }
							onClick={ () => {
								setModalOpen( true );
							} }
						>
							{ __( 'Manage Options', 'formello' ) }
						</Button>
					</Fragment>
				) }
			</PanelBody>
		</Fragment>
	);
}
