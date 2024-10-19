import { __ } from '@wordpress/i18n';

import { ToggleControl, PanelBody } from '@wordpress/components';
import {
	InspectorControls,
	RichText,
	useInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'core/group',
	'formello/input',
	'formello/email',
	'formello/select',
];

export default function Edit( { attributes, className, setAttributes } ) {
	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
	} );

	return (
		<fieldset { ...innerBlocksProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Options', 'formello' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show Legend', 'formello' ) }
						checked={ attributes.showLegend }
						onChange={ ( newval ) =>
							setAttributes( { showLegend: newval } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			{ attributes.showLegend && (
				<RichText
					tagName="legend"
					className={ className }
					value={ attributes.legend }
					onChange={ ( legend ) => setAttributes( { legend } ) }
					placeholder={ __( 'Enter legend…', 'formello' ) }
					allowedFormats={ [] }
				/>
			) }

			{ children }
		</fieldset>
	);
}
