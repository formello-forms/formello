import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	BaseControl,
	TextControl,
	withFilters,
} from '@wordpress/components';

import { Fragment, RawHTML } from '@wordpress/element';
import MergeTags from '../merge-tags';

import { SUPPORTED_ATTRIBUTES } from './constants';
import DatepickerSettings from './date';

function AdvancedOptions( props ) {
	const {
		attributes: {
			type,
			min,
			max,
			advancedDate,
			step,
			minlength,
			maxlength,
			validation,
			disabled,
			enableAutoComplete,
			autocomplete,
			readonly,
			withButton,
			withOutput,
			grouped,
			flatpickr,
			cols,
			rows,
			enableRtf,
			pattern,
			match,
			mismatchMessage
		},
		setAttributes,
		clientId
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[ type ];

	return (
		<Fragment>
			{ 'date' === type && (
				<ToggleControl
					label={ __(
						'Advanced Date',

						'formello'
					) }
					checked={ advancedDate }
					onChange={ ( val ) => {
						setAttributes( { advancedDate: val } );
					} }
				/>
			) }
			{ 'select' !== type && <DatepickerSettings { ...props } /> }
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
						onChange={ ( val ) => setAttributes( { step: val } ) }
					/>
				</Fragment>
			) }
			{ supported.includes( 'minlength' ) && true !== advancedDate && (
				<Fragment>
					<TextControl
						type="number"
						label={ __( 'Min Characters', 'formello' ) }
						value={ minlength || '' }
						onChange={ ( val ) =>
							setAttributes( { minlength: Number( val ) } )
						}
					/>
					<TextControl
						type="number"
						label={ __( 'Max Characters', 'formello' ) }
						value={ maxlength || '' }
						onChange={ ( val ) =>
							setAttributes( { maxlength: Number( val ) } )
						}
					/>
				</Fragment>
			) }
			{ supported.includes( 'pattern' ) && true !== advancedDate && (
				<TextControl
					label={ __( 'Pattern', 'formello' ) }
					value={ pattern || '' }
					onChange={ ( val ) => setAttributes( { pattern: val } ) }
				/>
			) }
			{ supported.includes( 'pattern' ) && (
				<TextControl
					label={ __( 'Custom Validation Message', 'formello' ) }
					value={ validation }
					onChange={ ( val ) => setAttributes( { validation: val } ) }
				/>
			) }
			{ 'password' === type && (
				<Fragment>
					<TextControl
						type="text"
						label={ __( 'Match', 'formello' ) }
						value={ match || '' }
						onChange={ ( val ) => setAttributes( { match: val } ) }
					/>
					<MergeTags
						className={ 'formello-flex' }
						clientId={ clientId }
						label={ __( 'Match', 'formello' ) }
						value={ match }
						onChange={ ( val ) => {
							setAttributes( { match: val } );
						} }
					/>
					<TextControl
						type="text"
						label={ __( 'Mismatch message', 'formello' ) }
						value={ mismatchMessage || '' }
						onChange={ ( val ) => setAttributes( { mismatchMessage: val } ) }
					/>
				</Fragment>
			) }
			{ 'textarea' === type && (
				<Fragment>
					<TextControl
						type="number"
						label={ __( 'Cols', 'formello' ) }
						value={ cols }
						onChange={ ( val ) =>
							setAttributes( { cols: Number( val ) } )
						}
					/>
					<TextControl
						type="number"
						label={ __( 'Rows', 'formello' ) }
						value={ rows }
						onChange={ ( val ) =>
							setAttributes( { rows: Number( val ) } )
						}
					/>
					<ToggleControl
						label={ __( 'Enable Rich Text', 'formello' ) }
						checked={ enableRtf }
						onChange={ ( newval ) =>
							setAttributes( { enableRtf: newval } )
						}
					/>
				</Fragment>
			) }
			{ 'hidden' !== type && (
				<Fragment>
					<ToggleControl
						label={ __( 'Disabled', 'formello' ) }
						checked={ disabled }
						onChange={ ( newval ) =>
							setAttributes( { disabled: newval } )
						}
					/>
					<ToggleControl
						label={ __( 'Read only', 'formello' ) }
						checked={ readonly }
						onChange={ ( newval ) =>
							setAttributes( { readonly: newval } )
						}
					/>
				</Fragment>
			) }
			{
				supported.includes( 'autocomplete' ) &&
				<ToggleControl
					label={ __( 'Autocomplete', 'formello' ) }
					checked={ enableAutoComplete }
					onChange={ ( newval ) =>
						setAttributes( { enableAutoComplete: newval } )
					}
				/>
			}
			{
				enableAutoComplete && supported.includes( 'autocomplete' ) &&
				<TextControl
					label={ __( 'Autocomplete attribute', 'formello' ) }
					value={ autocomplete }
					onChange={ ( newval ) =>
						setAttributes( { autocomplete: newval } )
					}
				/>
			}
			{ [ 'text', 'url', 'email', 'number', 'tel' ].includes( type ) && (
				<ToggleControl
					label={ __( 'Show button', 'formello' ) }
					checked={ withButton }
					onChange={ ( newval ) =>
						setAttributes( { withButton: newval } )
					}
				/>
			) }
			{ withButton && (
				<ToggleControl
					label={ __( 'Group button with input', 'formello' ) }
					checked={ grouped }
					onChange={ ( val ) =>
						setAttributes( {
							grouped: val,
						} )
					}
				/>
			) }
			{ 'range' === type && (
				<ToggleControl
					label={ __( 'Show output', 'formello' ) }
					checked={ withOutput }
					onChange={ ( val ) =>
						setAttributes( {
							withOutput: val,
						} )
					}
				/>
			) }
			{ 'hidden' === type && (
				<p>No advanced options for this field type.</p>
			) }
		</Fragment>
	);
}

export default withFilters( 'formello.advancedOptions' )( AdvancedOptions );
