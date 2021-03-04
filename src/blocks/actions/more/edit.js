/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
//import './editor.scss';

import { useBlockProps } from '@wordpress/block-editor';

import {
	PanelRow,
	PanelBody,
	Button
} from '@wordpress/components';

import {
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';

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
export default function Edit() {

	return (
        <div>
			<InspectorControls>
				<PanelBody title="More Blocks" initialOpen={ true }>
					<p>We are working on more blocks.</p>
					<div className="cta mailchimp" onClick={ () => console.log(123) }></div>
				</PanelBody>
			</InspectorControls>
			<b>[More] Do you want more actions? please visit <a href="http://www.formello.net" target="_blank">our site</a></b>
		</div>
	);
}
