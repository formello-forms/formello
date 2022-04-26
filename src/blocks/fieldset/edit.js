import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';

import {
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	Popover,
	SelectControl,
} from '@wordpress/components';
import {
	InspectorControls,
	RichText,
	InnerBlocks,
	useInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'formello/input',
	'formello/email',
	'formello/select',
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({
	attributes,
	className,
	setAttributes,
	clientId,
}) {
	const hasInnerBlocks = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');
			const block = getBlock(clientId);
			return !!(block && block.innerBlocks.length);
		},
		[clientId]
	);

	///const className = attributes.hideBorder ? 'no-border' : undefined;
	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
	});

	return (
		<fieldset {...innerBlocksProps}>
			<InspectorControls>
				<PanelBody title={__('Options', 'formello')} initialOpen={true}>
					<ToggleControl
						label={__('Show Legend', 'formello')}
						checked={attributes.showLegend}
						onChange={(newval) =>
							setAttributes({ showLegend: newval })
						}
					/>
				</PanelBody>
			</InspectorControls>
			{attributes.showLegend && (
				<RichText
					tagName="legend"
					className={className}
					value={attributes.legend}
					onChange={(legend) => setAttributes({ legend })}
					placeholder={__('Enter legend...', 'formello')}
					allowedFormats={[]}
				/>
			)}

			{children}
		</fieldset>
	);
}
