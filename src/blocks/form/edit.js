import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	InspectorAdvancedControls,
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';
import BlockVariationPicker from './variation-picker';
import { Controls } from './controls';

function FormEdit( props ) {
	const { attributes, setAttributes, hasInnerBlocks } = props;
	const { requiredText, autoComplete, noValidate } = attributes;

	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		//templateLock: false,
		template: [ [ 'formello/button' ] ],
		renderAppender: hasInnerBlocks ? InnerBlocks.ButtonBlockAppender : null,
		prioritizedInserterBlocks: [
			'formello/input',
			'formello/select',
			'formello/textarea',
			'formello/multichoices',
		],
	} );

	return (
		<div { ...innerBlocksProps }>
			<Fragment>
				<BlockControls>
					<Controls { ...props } />
				</BlockControls>
				<InspectorAdvancedControls>
					<TextControl
						label={ __( 'Required Field Indicator', 'formello' ) }
						value={ requiredText }
						onChange={ ( val ) =>
							setAttributes( { requiredText: val } )
						}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Autocomplete', 'formello' ) }
						value={ autoComplete }
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
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Disable HTML5 validation', 'formello' ) }
						checked={ noValidate }
						onChange={ ( val ) => {
							setAttributes( { noValidate: val } );
						} }
						help={ __(
							'Add "novalidate" attribute fo form tag.',
							'formello'
						) }
						__nextHasNoMarginBottom
					/>
				</InspectorAdvancedControls>
			</Fragment>
			{ children }
		</div>
	);
}

export default function Edit( props ) {
	const { clientId } = props;

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);

	const Component = hasInnerBlocks ? FormEdit : BlockVariationPicker;

	return <Component { ...props } />;
}
