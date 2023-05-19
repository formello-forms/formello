import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	TextControl,
	withFilters,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

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
			cols,
			rows,
			enableRtf,
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

	const { replaceInnerBlocks } =
		useDispatch( blockEditorStore );

	const addButton = () => {
		let child = 'formello/button';
		if ( 'range' === type ) {
			child = 'formello/output';
		}
		replaceInnerBlocks(
			props.clientId,
			createBlocksFromInnerBlocksTemplate(
				[ [ child ] ]
			),
			true
		);
	};

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
						help={
							__( 'The visible width of the control.', 'formello' )
						}
					/>
					<TextControl
						type="number"
						label={ __( 'Rows', 'formello' ) }
						value={ rows }
						onChange={ ( val ) =>
							setAttributes( { rows: Number( val ) } )
						}
						help={
							__( 'The number of visible text lines for the control.', 'formello' )
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
					help={
						__( 'Hint for form autofill feature.', 'formello' )
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
					checked={ hasInnerBlocks }
					onChange={ ( newval ) => {
						if ( newval ) {
							setAttributes( { withButton: true } );
							addButton();
						} else {
							setAttributes( { withButton: false } );
							replaceInnerBlocks(
								clientId,
								[],
								true
							);
						}
					} }
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
						help={
							__( 'Make the control not accept clicks.', 'formello' )
						}
					/>
					<ToggleControl
						label={ __( 'Read only', 'formello' ) }
						checked={ readonly }
						onChange={ ( newval ) =>
							setAttributes( { readonly: newval } )
						}
						help={
							__( 'Make value not editable.', 'formello' )
						}
					/>
				</Fragment>
			) }
		</Fragment>
	);
}

export default withFilters( 'formello.advancedOptions' )( AdvancedOptions );
