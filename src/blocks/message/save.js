import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( {
	attributes: {
		errorBgColor,
		customErrorBgColor,
		errorTextColor,
		customErrorTextColor,
		text,
	},
	style,
} ) {
	const blockProps = useBlockProps.save( {
		style: {
			...style,
			'--error-bg-color':
				errorBgColor !== undefined
					? `var( --wp--preset--color--${ errorBgColor } )`
					: customErrorBgColor,
			'--error-text-color':
				errorTextColor !== undefined
					? `var( --wp--preset--color--${ errorTextColor } )`
					: customErrorTextColor,
		},
	} );

	return (
		<div
			{ ...blockProps }
			data-wp-class--success="context.response.success"
			data-wp-class--error="!context.response.success"
			data-wp-interactive="formello"
			data-wp-bind--hidden="!context.response"
		>
			<RichText.Content
				tagName="p"
				value={ text }
				data-wp-bind--hidden="!context.response.success"
			/>
			<p
				data-wp-text="state.message"
				data-wp-bind--hidden="context.response.success"
			></p>
			<ul data-wp-context="state.errors">
				<template data-wp-each="state.errors">
					<li data-wp-text="context.item"></li>
				</template>
			</ul>
			<InnerBlocks.Content />
		</div>
	);
}
