import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import {
	InspectorAdvancedControls,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	SelectControl,
	PanelBody,
} from '@wordpress/components';
import { useFormFieldsBlocks } from '../edit/use-form-fields';

export function AdvancedSettings( props ) {
	const { attributes, setAttributes, clientId } = props;

	const fields = useFormFieldsBlocks( clientId );

	const changeRequiredText = ( value ) => {
		setAttributes( { requiredText: value } );

		fields.forEach( ( block ) => {
			dispatch( blockEditorStore ).updateBlockAttributes(
				block.clientId,
				{ requiredText: value }
			);
		} );
	};

	return (
		<Fragment>
			<InspectorAdvancedControls>
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
					help={ __(
						'Add "autocomplete" attribute fo form tag.',
						'formello'
					) }
				/>
				<ToggleControl
					label={ __( 'Enable Js validation', 'formello' ) }
					checked={ attributes.enableJsValidation }
					onChange={ ( val ) => {
						setAttributes( { enableJsValidation: val } );
					} }
				/>
				<ToggleControl
					label={ __( 'Disable HTML5 validation', 'formello' ) }
					checked={ attributes.noValidate }
					onChange={ ( val ) => {
						setAttributes( { noValidate: val } );
					} }
					help={ __(
						'Add "novalidate" attribute fo form tag.',
						'formello'
					) }
				/>
				<ToggleControl
					label={ __( 'Disable Ajax', 'formello' ) }
					checked={ attributes.noAjax }
					onChange={ ( val ) => {
						setAttributes( { noAjax: val } );
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
			<InspectorControls group="styles">
				<PanelBody
					title={ __( 'Label settings', 'formello' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Label on side', 'formello' ) }
						checked={ attributes.asRow }
						onChange={ ( val ) => setAttributes( { asRow: val } ) }
					/>
					{ attributes.asRow && (
						<SelectControl
							label={ __(
								'Label horizontal position',
								'formello'
							) }
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
						onChange={ ( val ) =>
							setAttributes( { labelIsBold: val } )
						}
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}
