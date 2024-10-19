import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { noValidate, autoComplete, action } = attributes;
	return (
		<form
			method="post"
			{ ...useBlockProps.save() }
			noValidate={ noValidate || undefined }
			autoComplete={ autoComplete }
			action={ action }
		>
			<input type="hidden" name="_formello_id" />
			<input type="text" className="formello-hp" tabIndex="-1" />
			<input type="hidden" name="action" value="formello" />
			<InnerBlocks.Content />
		</form>
	);
}
