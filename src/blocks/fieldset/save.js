import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const className = attributes.hideBorder ? 'no-border' : undefined;
	const blockProps = useBlockProps.save( {
		className,
	} );
	return (
		<fieldset { ...blockProps }>
			{ attributes.showLegend && <legend>{ attributes.legend }</legend> }
			<InnerBlocks.Content />
		</fieldset>
	);
}
