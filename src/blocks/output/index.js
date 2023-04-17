import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import {
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {

	icon: {
		// Specifying a background color to appear with the icon e.g.: in the inserter.
		background: '#fff',
		// Specifying a color for the icon (optional: if not set, a readable color will be automatically defined)
		foreground: '#000000',

		src: 'button',

	},

	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps();

		return <RichText
			{ ...blockProps }
			tagName="output"
			value={ attributes.text }
			onChange={ ( val ) => setAttributes( { text: val } ) }
			placeholder={ '55' }
			allowedFormats={ [ 'core/bold' ] }
		/>;
	},

	save: ( { attributes } ) => <RichText.Content { ...useBlockProps.save() } tagName="output" value={ attributes.text } />,
} );
