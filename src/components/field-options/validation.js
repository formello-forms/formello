import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	BaseControl,
	TextControl,
	SelectControl,
	PanelBody, 
	withFilters, 
	SlotFillProvider, 
	Slot
} from '@wordpress/components';

import { Fragment, RawHTML } from '@wordpress/element';
import MergeTags from '../merge-tags';

import { SUPPORTED_ATTRIBUTES } from './constants';
import DatepickerSettings from './date';

import {
	getFormBlock,
	serializeFieldsName,
} from '../merge-tags/functions';

const AdditionalSettings = withFilters(
        'formello.validationOptions'
    )( ( props ) => <></> );

function ValidationOptions( props ) {
	const {
		attributes: {
			type,
			min,
			max,
			advanced,
			step,
			minlength,
			maxlength,
			validation,
			flatpickr,
			enableMismatch,
			pattern,
			match,
			mismatchMessage
		},
		setAttributes,
		clientId
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[ type ?? 'textarea' ];

	const formId = getFormBlock(clientId).clientId;
	const fields = serializeFieldsName(formId);

	return (
        <SlotFillProvider>
            <AdditionalSettings
                { ...props }
            />
			<PanelBody title={ __( 'Validation', 'formello' ) } initialOpen={ true }>
                <Slot name="SettingsTop" />

				{ 'date' === type && (
					<ToggleControl
						label={ __( 'Advanced Date', 'formello' ) }
						checked={ advanced }
						onChange={ ( val ) => {
							setAttributes( { advanced: val } );
						} }
					/>
				) }
				{ 'select' !== type && type && <DatepickerSettings { ...props } /> }

				{ supported.includes( 'step' ) && (
					<Fragment>
						<TextControl
							label={ __( 'Min Value', 'formello' ) }
							value={ min || '' }
							min={ '0' }
							type={ 'range' === type ? 'number' : type }
							onChange={ ( val ) => {
								setAttributes( { min: val } );
								setAttributes( {
									flatpickr: {
										...flatpickr,
										'min-date': val,
									},
								} );
							} }
						/>
						<TextControl
							label={ __( 'Max Value', 'formello' ) }
							value={ max || '' }
							type={ 'range' === type ? 'number' : type }
							min={ '0' }
							onChange={ ( val ) => {
								setAttributes( { max: val } );
								setAttributes( {
									flatpickr: {
										...flatpickr,
										'max-date': val,
									},
								} );
							} }
						/>
						<TextControl
							type="number"
							label={ __( 'Step Value', 'formello' ) }
							value={ step || '' }
							onChange={ ( val ) => setAttributes( { step: Number( val ) } ) }
						/>
					</Fragment>
				) }
				{ supported.includes( 'minlength' ) && true !== advanced && (
					<Fragment>
						<TextControl
							type="number"
							label={ __( 'Min Characters', 'formello' ) }
							value={ minlength }
							min={ '0' }
							onChange={ ( val ) =>
								setAttributes( { minlength: val } )
							}
						/>
						<TextControl
							type="number"
							label={ __( 'Max Characters', 'formello' ) }
							value={ maxlength }
							onChange={ ( val ) =>
								setAttributes( { maxlength: val } )
							}
						/>
					</Fragment>
				) }
				{ supported.includes( 'pattern' ) && true !== advanced && (
					<TextControl
						label={ __( 'Pattern', 'formello' ) }
						value={ pattern || '' }
						onChange={ ( val ) => setAttributes( { pattern: val } ) }
					/>
				) }
				{ supported.includes( 'pattern' ) && (
					<TextControl
						label={ __( 'Custom Validation Message', 'formello' ) }
						help={ __( 'The message to show if validation fails.', 'formello' ) }
						value={ validation }
						onChange={ ( val ) => setAttributes( { validation: val } ) }
					/>
				) }
				<ToggleControl
					label={ __( 'Enable match field', 'formello' ) }
					checked={ enableMismatch }
					onChange={ ( newval ) =>
						setAttributes( { enableMismatch: newval } )
					}
				/>
				{ enableMismatch && (
					<Fragment>
				        <SelectControl
							label={ __( 'Match', 'formello' ) }
				            value={ match }
				            options={ [
				            	{value: '', label: __( 'Select a field', 'formello' ) },
				            	...fields
				            ] }
							onChange={ ( val ) => setAttributes( { match: val } ) }
							help={ __( 'Select the field to match', 'formello' ) }
				        />
						<TextControl
							type="text"
							label={ __( 'Mismatch message', 'formello' ) }
							value={ mismatchMessage || '' }
							onChange={ ( val ) => setAttributes( { mismatchMessage: val } ) }
						/>
					</Fragment>
				) }
                <Slot name="SettingsBottom" />
			</PanelBody>
        </SlotFillProvider>
	);
}

export default ValidationOptions;
