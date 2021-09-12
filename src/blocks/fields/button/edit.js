/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
    useBlockProps,
    InspectorControls,
    AlignmentToolbar,
    BlockControls,
    InspectorAdvancedControls,
    useSetting,
    RichText,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUnitControl as UnitControl,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	RangeControl,
	__experimentalBoxControl as BoxControl,
	FontSizePicker,
	ColorPicker,
	ColorIndicator,
	ColorPalette,
	SelectControl
} from '@wordpress/components';
import { useCallback, useEffect, useState, useRef } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
//import './editor.scss';
import classnames from 'classnames';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( {
	className,
	attributes,
	setAttributes,
	toggleSelection,
	isSelected,
} ) {
	const {
		label,
		showLabel,
		placeholder,
		width,
		widthUnit,
		align,
		buttonText,
		buttonPosition,
		buttonUseIcon,
		style,
	} = attributes;

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
	const EMPTY_ARRAY = [];

	const [ showIcon, setShowIcon ] = useState( false );
	const colors = useSetting( 'color.palette' ) || EMPTY_ARRAY;

	const borderRadius = style?.border?.radius;
	const borderColor = style?.border?.color;
	const borderProps = useBorderProps( attributes );
	// not already merged in Gutenberg
	//const spacingProps = useSpacingProps( attributes );

	// Check for old deprecated numerical border radius. Done as a separate
	// check so that a borderRadius style won't overwrite the longhand
	// per-corner styles.
	if ( typeof borderRadius === 'number' ) {
		borderProps.style.borderRadius = `${ borderRadius }px`;
	}

	const colorProps = useColorProps( attributes );

	const iconClass = classnames( 'ld', 'ld-spin', attributes.iconType );

	const buttonClasses = classnames(
		'button-span',
		colorProps.className,
		attributes.iconPosition, {
			'running': showIcon,			
		}
	);
	const buttonStyles = {
		...colorProps.style,
		...borderProps.style,
		//...spacingProps.style
	};

	const getBlockClassNames = () => {
		return classnames(
			attributes.alignment,
			className
		);
	};

	const blockProps = useBlockProps({
		className: getBlockClassNames()
	});

	return (
		<div { ...blockProps }>
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
				<PanelBody title={ __( 'Options', 'formello' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Text', 'formello' ) }
						value={ attributes.text }
						onChange={ ( val ) => setAttributes( { text: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={ __( 'Show loading icon', 'formello' ) }
					checked={ showIcon}
					onChange={ ( val ) => setShowIcon( val ) }
				/>
				<SelectControl
			        label={ __( 'Icon position', 'formello' ) }
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
			<button className={ buttonClasses } style={ buttonStyles }>
				<RichText
					tagName="span"
					value={ attributes.text }
					onChange={ ( text ) => setAttributes( { text } ) }
					placeholder={ __( 'Enter button text...', 'formello' ) }
					allowedFormats={ [] }
				/>
				<div className={ iconClass }></div>
			</button>
		</div>
	);
}
