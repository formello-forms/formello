import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	TextControl,
	withFilters,
} from '@wordpress/components';

import { Fragment, RawHTML } from '@wordpress/element';

import { SUPPORTED_ATTRIBUTES } from './constants';
import DatepickerSettings from './date';

function AdvancedOptions( props ) {
	const {
		attributes: {
			type,
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
			enableRtf
		},
		setAttributes,
		fieldType,
		clientId
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[ fieldType ];

	return (
		<Fragment>
			{	supported.includes( 'cols' ) && (
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
		</Fragment>
	);
}

export default withFilters( 'formello.advancedOptions' )( AdvancedOptions );
