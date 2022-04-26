/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
	let className = attributes.hideBorder ? 'no-border' : undefined;
	const blockProps = useBlockProps.save({
		className: className,
	});
	return (
		<fieldset {...blockProps}>
			{attributes.showLegend && <legend>{attributes.legend}</legend>}
			<InnerBlocks.Content />
		</fieldset>
	);
}
