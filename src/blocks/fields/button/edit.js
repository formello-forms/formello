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
import './editor.scss';

import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	FontSizePicker
} from '@wordpress/components';
import { useEffect, Fragment } from '@wordpress/element';

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
export default function Edit( { attributes, className, setAttributes, context } ) {
	const ALIGNMENT_CONTROLS = [
		{
			icon: 'editor-alignleft',
			title: __( 'Align Button Left', 'formello' ),
			align: 'left',
		},
		{
			icon: 'editor-aligncenter',
			title: __( 'Align Button Center', 'formello' ),
			align: 'center',
		},
		{
			icon: 'editor-alignright',
			title: __( 'Align Button Right', 'formello' ),
			align: 'right',
		},
		{
			icon: 'align-wide',
			title: __( 'Wide Button', 'formello' ),
			align: 'wide',
		},
	];
    const fontSizes = [
        {
            name: __( 'Small' ),
            slug: 'small',
            size: 12,
        },
        {
            name: __( 'Big' ),
            slug: 'big',
            size: 26,
        },
    ];
    const fallbackFontSize = 16;

	/*useEffect(
		() => {
			setAttributes( { recaptcha: context['formello/recaptchaEnabled'] } );
		},
		[context['formello/recaptchaEnabled']]
	);*/

	//attributes.recaptcha = context['formello/recaptchaEnabled']
	
	return (
		<div className={ 'formello' }>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.alignment }
					alignmentControls={ ALIGNMENT_CONTROLS }
					onChange={ ( nextAlign ) => {
						setAttributes( { alignment: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Options" initialOpen={ true }>
					<TextControl
						label={ __( 'Text', 'formello' ) }
						value={ attributes.txt }
						onChange={ ( val ) => setAttributes( { txt: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<button disabled className={ attributes.alignment }>
				{ attributes.txt }
			</button>
		</div>
	);
}
