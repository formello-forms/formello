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

import { 
	InspectorControls, 
	InspectorAdvancedControls, 
	BlockControls, 
	AlignmentToolbar,
	PanelColorSettings,
	withColors,
	getColorObjectByColorValue,
	__experimentalUseEditorFeature as useEditorFeature
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	FontSizePicker,
	SelectControl
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { pickBy, isEqual, isObject, identity, mapValues } from 'lodash';
import { useState } from '@wordpress/element';

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
function Edit( { attributes, setAttributes, context, textColor, setTextColor, backgroundColor, setBackgroundColor, className } ) {
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

	const [ showIcon, setShowIcon ] = useState( false );
	const colors = useEditorFeature( 'color.palette' ) || EMPTY_ARRAY;

	const buttonClass = classnames( 'button-span', textColor.class, backgroundColor.class, attributes.iconPosition, {
		'has-text-color': attributes.textColor || attributes.style?.color?.text,
		'has-background': attributes.backgroundColor || attributes.style?.color?.background,
		'running': showIcon
	} );

	const iconClass = classnames( 'ld', 'ld-spin', attributes.iconType );

	const containerClass = classnames( className, attributes.alignment );

	const styleProp =
		attributes.style?.color?.background || attributes.style?.color?.text || attributes.style?.color?.gradient
			? {
					background: attributes.style?.color?.gradient
						? attributes.style.color.gradient
						: undefined,
					backgroundColor: attributes.style?.color?.background
						? attributes.style.color.background
						: undefined,
					color: attributes.style?.color?.text ? attributes.style.color.text : undefined,
			  }
			: {};
	/**
	 * Removed undefined values from nested object.
	 *
	 * @param {*} object
	 * @return {*} Object cleaned from undefined values
	 */
	const cleanEmptyObject = ( object ) => {
		if ( ! isObject( object ) ) {
			return object;
		}
		const cleanedNestedObjects = pickBy(
			mapValues( object, cleanEmptyObject ),
			identity
		);
		return isEqual( cleanedNestedObjects, {} )
			? undefined
			: cleanedNestedObjects;
	};

	const onChangeColor = ( name ) => ( value ) => {
		const colorObject = getColorObjectByColorValue( colors, value );
		const attributeName = name + 'Color';
		const newStyle = {
			...attributes.style,
			color: {
				...attributes?.style?.color,
				[ name ]: colorObject?.slug ? undefined : value,
			},
		};

		const newNamedColor = colorObject?.slug ? colorObject.slug : undefined;
		const newAttributes = {
			style: cleanEmptyObject( newStyle ),
			[ attributeName ]: newNamedColor,
		};

		setAttributes( newAttributes );

	}

	return (
		<div className={ containerClass }>
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
						value={ attributes.text }
						onChange={ ( val ) => setAttributes( { text: val } ) }
					/>
				</PanelBody>
				<PanelColorSettings 
					title={__('Color settings')}
					colorSettings={[
						{
							value: textColor.color,
							onChange: onChangeColor( 'text' ),
							label: __('Text color')
						},
						{
							value: backgroundColor.color,
							onChange: onChangeColor( 'background' ),
							label: __('Background color')
						},
					]}
				/>
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={ __( 'Show loading icon', 'formello' ) }
					checked={ showIcon}
					onChange={ ( val ) => setShowIcon( val ) }
				/>
				<SelectControl
			        label={ __( 'Label horizontal position', 'formello' ) }
			        value={ attributes.iconPosition }
			        options={ [
			            { label: 'over', value: 'ld-over' },
			            { label: 'left', value: 'ld-ext-left' },
			            { label: 'right', value: 'ld-ext-right' }
			        ] }
			        onChange={ ( val ) => { setAttributes( { iconPosition: val } ) } }
				/>
				<SelectControl
			        label={ __( 'Icon type', 'formello' ) }
			        value={ attributes.iconType }
			        options={ [
			            { label: 'ring', value: 'ld-ring' },
			            { label: 'hourglass', value: 'ld-hourglass' },
			            { label: 'spinner', value: 'ld-spinner' }
			        ] }
			        onChange={ ( val ) => { setAttributes( { iconType: val } ) } }
				/>
			</InspectorAdvancedControls>
			<div className={ buttonClass } style={ styleProp } >
				<span>{ attributes.text }</span>
				<div className={ iconClass }></div>
			</div>
		</div>
	);
}

export default compose( withColors( {textColor: 'color', backgroundColor: 'background-color'} ) )( Edit );