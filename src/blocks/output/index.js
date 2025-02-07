import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { ReactComponent as Output } from '../../../assets/icons/output-field.svg';

import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {
	icon: Output,

	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps();

		return (
			<RichText
				{ ...blockProps }
				tagName="output"
				value={ attributes.text }
				onChange={ ( val ) => setAttributes( { text: val } ) }
				placeholder={ '55' }
				allowedFormats={ [] }
			/>
		);
	},

	save: ( { attributes } ) => (
		<output { ...useBlockProps.save() }>{ attributes.text }</output>
	),
} );
