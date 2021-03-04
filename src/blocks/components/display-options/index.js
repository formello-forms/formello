/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelRow } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function displayOpts( props ) {

	const {
		attributes,
		setAttributes,
		onChange
	} = props;

	return (
		<Fragment>

			<SelectControl
		        label={ __( 'Label vertical alignment', 'formello' ) }
		        value={ attributes.labelVAlign }
		        options={ [
		            { label: 'top', value: 'align-top' },
		            { label: 'center', value: 'align-center' },
		            { label: 'bottom', value: 'align-bottom' }
		        ] }
		        onChange={ ( align ) => { setAttributes( { labelVAlign: align } ) } }
			/>
			<TextControl
				label={ __( 'Label Class', 'formello' ) }
				value={ attributes.labelClass }
				onChange={ ( val ) =>
					setAttributes( { labelClass: val } )
				}
			/>
			<TextControl
				label={ __( 'Field Class', 'formello' ) }
				value={ attributes.fieldClass }
				onChange={ ( val ) =>
					setAttributes( { fieldClass: val } )
				}
			/>
			<TextControl
				label={ __( 'Description Class', 'formello' ) }
				value={ attributes.descriptionClass }
				onChange={ ( val ) =>
					setAttributes( { descriptionClass: val } )
				}
			/>
		</Fragment>
	);
}