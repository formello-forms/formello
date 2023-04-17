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
			{ [ 'text', 'url', 'email', 'number', 'tel', 'range' ].includes( type ) && (
				<ToggleControl
					label={ 'range' === type ? __( 'Show output', 'formello' ) : __( 'Show button', 'formello' ) }
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
