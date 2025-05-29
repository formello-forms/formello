import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	RichText,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	withColors,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

const Edit = ( {
	attributes: { customErrorBgColor, customErrorTextColor, text },
	clientId,
	setAttributes,
	errorBgColor,
	setErrorBgColor,
	errorTextColor,
	setErrorTextColor,
} ) => {
	const styles = {
		'--error-bg-color': errorBgColor.slug
			? `var( --wp--preset--color--${ errorBgColor.slug } )`
			: customErrorBgColor,
		'--error-text-color': errorTextColor.slug
			? `var( --wp--preset--color--${ errorTextColor.slug } )`
			: customErrorTextColor,
	};

	const blockProps = useBlockProps( {
		className: 'success',
		style: styles,
	} );

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			};
		},
		[ clientId ]
	);

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? null
			: InnerBlocks.DefaultBlockAppender,
	} );

	const [ formello ] = useEntityProp( 'root', 'site', 'formello' );

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={ clientId }
					settings={ [
						{
							colorValue:
								errorBgColor.color || customErrorBgColor,
							onColorChange: ( color ) => {
								setErrorBgColor( color );
								setAttributes( {
									customErrorBgColor: color,
								} );
							},
							label: __( 'Error Background Color', 'formello' ),
							enableAlpha: true,
							clearable: true,
						},
						{
							colorValue:
								errorTextColor.color || customErrorTextColor,
							onColorChange: ( color ) => {
								setErrorTextColor( color );
								setAttributes( {
									customErrorTextColor: color,
								} );
							},
							label: __( 'Error Text Color', 'formello' ),
							enableAlpha: true,
							clearable: true,
						},
					] }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<RichText
				tagName="p"
				value={ text }
				onChange={ ( val ) => setAttributes( { text: val } ) }
				placeholder={ formello?.messages.form.success }
			/>
			{ children }
		</div>
	);
};

export default withColors( 'errorBgColor', 'errorTextColor' )( Edit );
