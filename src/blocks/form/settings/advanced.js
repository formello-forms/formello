import { __ } from '@wordpress/i18n';

import { select, dispatch } from '@wordpress/data';

import { InspectorAdvancedControls } from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

export function AdvancedSettings( props ) {
	const { attributes, setAttributes, clientId } = props;

	const changeRequiredText = ( value ) => {
		setAttributes( { requiredText: value } );

		// Update the child block's attributes
		const children =
			select( 'core/block-editor' ).getBlocksByClientId( clientId )[ 0 ].innerBlocks;

		children.forEach( ( child ) => {
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				child.clientId,
				{ requiredText: value }
			);
		} );
	};

	return (
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
			<TextControl
				label={ __( 'Required Field Indicator', 'formello' ) }
				value={ attributes.requiredText }
				onChange={ changeRequiredText }
			/>
			<SelectControl
				label={ __( 'Autocomplete', 'formello' ) }
				value={ attributes.autoComplete }
				options={ [
					{ label: 'On', value: 'on' },
					{ label: 'Off', value: 'off' },
				] }
				onChange={ ( val ) => {
					setAttributes( { autoComplete: val } );
				} }
			/>
			<ToggleControl
				label={ __( 'Enable Js validation', 'formello' ) }
				checked={ attributes.enableJsValidation }
				onChange={ ( val ) => {
					setAttributes( { enableJsValidation: val } );
				} }
			/>
			<ToggleControl
				label={ __( 'No HTML5 validation', 'formello' ) }
				checked={ attributes.noValidate }
				onChange={ ( val ) => {
					setAttributes( { noValidate: val } );
				} }
			/>
			<ToggleControl
				label={ __( 'Enable debug', 'formello' ) }
				checked={ attributes.debug }
				onChange={ ( val ) => {
					setAttributes( { debug: val } );
				} }
			/>
		</InspectorAdvancedControls>
	);
}
