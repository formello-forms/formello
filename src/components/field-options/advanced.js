import { __ } from '@wordpress/i18n';

import { ToggleControl, TextControl, withFilters } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';

import { Fragment } from '@wordpress/element';

import { SUPPORTED_ATTRIBUTES } from './constants';

function AdvancedOptions( props ) {
	const {
		attributes: {
			type,
			disabled,
			enableAutoComplete,
			autocomplete,
			readonly,
			advanced,
		},
		setAttributes,
		fieldType,
		clientId,
	} = props;

	const supported = SUPPORTED_ATTRIBUTES[ fieldType ];

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const addOutput = () => {
		let child = 'formello/button';
		if ( 'range' === type ) {
			child = 'formello/output';
		}
		replaceInnerBlocks(
			props.clientId,
			createBlocksFromInnerBlocksTemplate( [ [ child ] ] ),
			true
		);
	};

	return (
		<Fragment>
			{ supported.includes( 'autocomplete' ) && (
				<ToggleControl
					label={ __( 'Autocomplete', 'formello' ) }
					checked={ enableAutoComplete }
					onChange={ ( newval ) =>
						setAttributes( { enableAutoComplete: newval } )
					}
					help={ __( 'Hint for form autofill feature.', 'formello' ) }
					__nextHasNoMarginBottom
				/>
			) }
			{ enableAutoComplete && supported.includes( 'autocomplete' ) && (
				<TextControl
					label={ __( 'Autocomplete attribute', 'formello' ) }
					value={ autocomplete }
					onChange={ ( newval ) =>
						setAttributes( { autocomplete: newval } )
					}
					__nextHasNoMarginBottom
				/>
			) }
			{ 'range' === type && (
				<ToggleControl
					label={ __( 'Show output', 'formello' ) }
					checked={ hasInnerBlocks }
					onChange={ ( newval ) => {
						if ( newval ) {
							setAttributes( { withOutput: true } );
							addOutput();
						} else {
							setAttributes( { withOutput: false } );
							replaceInnerBlocks( clientId, [], true );
						}
					} }
					__nextHasNoMarginBottom
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
						help={ __(
							'Make the control not accept clicks.',
							'formello'
						) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Read only', 'formello' ) }
						checked={ readonly }
						onChange={ ( newval ) =>
							setAttributes( { readonly: newval } )
						}
						help={ __( 'Make value not editable.', 'formello' ) }
						__nextHasNoMarginBottom
					/>
				</Fragment>
			) }
		</Fragment>
	);
}

export default withFilters( 'formello.advancedOptions' )( AdvancedOptions );
