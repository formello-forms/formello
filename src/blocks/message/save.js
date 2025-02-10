import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	return (
		<div
			{ ...blockProps }
			data-wp-class--success="context.response.success"
			data-wp-class--error="!context.response.success"
			data-wp-interactive="formello"
			data-wp-context={ JSON.stringify( {
				successMessage: attributes.text,
			} ) }
		>
			<RichText.Content
				tagName="p"
				value={ attributes.text }
				data-wp-text="state.message"
			/>
			<ul data-wp-context="state.errors">
				<template data-wp-each="state.errors">
					<li data-wp-text="context.item"></li>
				</template>
			</ul>
			<InnerBlocks.Content />
		</div>
	);
}
