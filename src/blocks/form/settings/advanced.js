import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';

import { InspectorAdvancedControls } from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

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
export function AdvancedSettings( props ) {
	const { attributes, setAttributes, clientId } = props;

	const changeRequiredText = ( value ) => {
		setAttributes( { requiredText: value } );

		// Update the child block's attributes
		const children =
			select( 'core/block-editor' ).getBlocksByClientId( clientId )[ 0 ]
				.innerBlocks;
		children.forEach( ( child ) => {
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				child.clientId,
				{ requiredText: value }
			);
		} );
	};

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<ToggleControl
					label={ __( 'Label on side', 'formello' ) }
					checked={ attributes.asRow }
					onChange={ ( val ) => setAttributes( { asRow: val } ) }
				/>
				{ attributes.asRow && (
					<SelectControl
						label={ __( 'Label horizontal position', 'formello' ) }
						value={ attributes.labelAlign }
						options={ [
							{ label: 'left', value: 'left' },
							{ label: 'right', value: 'right' },
						] }
						onChange={ ( val ) => {
							setAttributes( { labelAlign: val } );
						} }
					/>
				) }
				<ToggleControl
					label={ __( 'Bolded label', 'formello' ) }
					checked={ attributes.labelIsBold }
					onChange={ ( val ) => setAttributes( { labelIsBold: val } ) }
				/>
				<ToggleControl
					label={ __( 'Enable debug', 'formello' ) }
					checked={ attributes.debug }
					onChange={ ( val ) => {
						setAttributes( { debug: val } );
					} }
				/>
				<TextControl
					label={ __( 'Required Field Indicator', 'formello' ) }
					value={ attributes.requiredText }
					onChange={ changeRequiredText }
				/>
			</InspectorAdvancedControls>
		</Fragment>
	);
}
