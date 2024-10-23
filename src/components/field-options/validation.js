import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

import {
	ToggleControl,
	TextControl,
	SelectControl,
	PanelBody,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import MergeTags from '../merge-tags';

import { SUPPORTED_ATTRIBUTES } from './constants';
import DatepickerSettings from './date';

import { getPatternTabs, serializeFieldsName } from '../merge-tags/functions';

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
			enableMismatch,
			pattern,
			match,
			mismatchMessage,
		},
		setAttributes,
		clientId,
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[ type ?? 'textarea' ];

	if ( 'checkbox' === type || 'email' === type ) {
		return null;
	}

	const fields = serializeFieldsName();

	const tabs = getPatternTabs();

	return (
		<PanelBody
			title={ __( 'Validation', 'formello' ) }
			initialOpen={ false }
		>
			{ ( 'date' === type || 'tel' === type ) && (
				<ToggleControl
					label={ __( 'Advanced', 'formello' ) }
					checked={ advanced }
					onChange={ ( val ) => {
						setAttributes( { advanced: val } );
					} }
					__nextHasNoMarginBottom
				/>
			) }
			{ ( 'date' === type || 'time' === type ) && (
				<DatepickerSettings { ...props } />
			) }

			{ applyFilters( 'formello.Validation', '', props ) }

			{ supported.includes( 'step' ) && ! advanced && (
				<Fragment>
					<TextControl
						label={ __( 'Min Value', 'formello' ) }
						value={ min || '' }
						min={ '0' }
						type={ 'range' === type ? 'number' : type }
						onChange={ ( val ) => {
							setAttributes( { min: val } );
						} }
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={ __( 'Max Value', 'formello' ) }
						value={ max || '' }
						type={ 'range' === type ? 'number' : type }
						min={ '0' }
						onChange={ ( val ) => {
							setAttributes( { max: val } );
						} }
						__nextHasNoMarginBottom
					/>
					<TextControl
						type="number"
						label={ __( 'Step Value', 'formello' ) }
						value={ step || '' }
						onChange={ ( val ) =>
							setAttributes( { step: Number( val ) } )
						}
						__nextHasNoMarginBottom
					/>
				</Fragment>
			) }
			{ supported.includes( 'minlength' ) && (
				<Fragment>
					<TextControl
						type="number"
						label={ __( 'Min Characters', 'formello' ) }
						value={ minlength }
						min={ '0' }
						onChange={ ( val ) =>
							setAttributes( { minlength: val } )
						}
						help={ __(
							'Minimum length (number of characters) of value.',
							'formello'
						) }
						__nextHasNoMarginBottom
					/>
					<TextControl
						type="number"
						label={ __( 'Max Characters', 'formello' ) }
						value={ maxlength }
						onChange={ ( val ) =>
							setAttributes( { maxlength: val } )
						}
						help={ __(
							'Maximum length (number of characters) of value.',
							'formello'
						) }
						__nextHasNoMarginBottom
					/>
				</Fragment>
			) }
			{ supported.includes( 'pattern' ) && (
				<Fragment>
					<MergeTags
						label={ 'Pattern' }
						clientId={ clientId }
						tabs={ tabs }
						value={ pattern }
						onChange={ ( val ) => {
							setAttributes( { pattern: val } );
						} }
						help={ __(
							'Pattern the value must match to be valid.',
							'formello'
						) }
					/>
				</Fragment>
			) }
			{ supported.includes( 'pattern' ) && (
				<TextControl
					label={ __( 'Custom Validation Message', 'formello' ) }
					help={ __(
						'The message to show if pattern validation fails.',
						'formello'
					) }
					value={ validation }
					onChange={ ( val ) => setAttributes( { validation: val } ) }
					__nextHasNoMarginBottom
				/>
			) }
			{ supported.includes( 'mismatch' ) && (
				<Fragment>
					<ToggleControl
						label={ __( 'Enable match field', 'formello' ) }
						checked={ enableMismatch }
						onChange={ ( newval ) =>
							setAttributes( { enableMismatch: newval } )
						}
						__nextHasNoMarginBottom
					/>
					{ enableMismatch && (
						<Fragment>
							<SelectControl
								label={ __( 'Match', 'formello' ) }
								value={ match }
								options={ [
									{
										value: '',
										label: __(
											'Select a field',
											'formello'
										),
									},
									...fields,
								] }
								onChange={ ( val ) =>
									setAttributes( { match: val } )
								}
								help={ __(
									'Select the field to match.',
									'formello'
								) }
								__nextHasNoMarginBottom
							/>
							<TextControl
								type="text"
								label={ __( 'Mismatch message', 'formello' ) }
								value={ mismatchMessage || '' }
								onChange={ ( val ) =>
									setAttributes( { mismatchMessage: val } )
								}
								__nextHasNoMarginBottom
							/>
						</Fragment>
					) }
				</Fragment>
			) }
		</PanelBody>
	);
}

export default ValidationOptions;
