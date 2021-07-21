/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { 
	InspectorControls, 
	InspectorAdvancedControls, 
	BlockControls, 
	AlignmentToolbar,
	PanelColorSettings,
	withColors,
	getColorObjectByColorValue,
	useSetting
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	RangeControl,
	__experimentalBoxControl as BoxControl,
	FontSizePicker,
	SelectControl
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { pickBy, isEqual, isObject, identity, mapValues } from 'lodash';
import { useState, useEffect } from '@wordpress/element';

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
function Edit( props ) {
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

	const {
		attributes,
		setAttributes,
		mergeBlocks,
		onReplace,
		className,
		borderColor,
		backgroundColor,
		textColor,
		setBorderColor,
		setBackgroundColor,
		setTextColor,
	} = props;

	const {
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
	} = attributes;

    const units = [
        { value: 'px', label: 'px', default: 0 },
        { value: '%', label: '%', default: 10 },
        { value: 'em', label: 'em', default: 0 },
    ];

    const [ values, setValues ] = useState( {
		top: paddingTop,
		left: paddingLeft,
		right: paddingRight,
		bottom: paddingBottom,
    } );

    const setPadding = ( { top, right, bottom, left } ) => {
    	setAttributes( {
			paddingTop: top || undefined,
			paddingLeft: left || undefined,
			paddingRight: right || undefined,
			paddingBottom: bottom || undefined,
    	} )
    }

	const [ showIcon, setShowIcon ] = useState( false );
	const colors = useSetting( 'color.palette' ) || EMPTY_ARRAY;

	const buttonClass = classnames( 'button-span', textColor.class, backgroundColor.class, attributes.iconPosition, {
		'has-background': backgroundColor.value,
		[backgroundColor.class]: backgroundColor.class,
		[textColor.class]: textColor.class,
		'running': showIcon
	} );

	const iconClass = classnames( 'ld', 'ld-spin', attributes.iconType );

	const containerClass = classnames( className, attributes.alignment );

	const style = {
		'backgroundColor': backgroundColor.color,
		'color': textColor.color,
		'borderWidth': attributes.borderWidth,
		'borderRadius': attributes.borderRadius,
		'borderColor': borderColor.color,
		'paddingTop': paddingTop,
		'paddingRight': paddingRight,
		'paddingBottom': paddingBottom,
		'paddingLeft': paddingLeft,
	}

	useEffect(
		() => {
			if( undefined !== borderColor ){
				setAttributes( { customBorderColor: borderColor.color } )
			}
		},
		[ borderColor ]
	);

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
				<PanelBody title={ __( 'Options', 'formello' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Text', 'formello' ) }
						value={ attributes.text }
						onChange={ ( val ) => setAttributes( { text: val } ) }
					/>
				</PanelBody>
				<PanelColorSettings 
					title={ __( 'Color settings', 'formello' ) }
					colorSettings={[
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text color', 'formello' )
						},
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background color', 'formello' )
						},
						{
							value: borderColor.color,
							onChange: setBorderColor,
							label: __( 'Border color', 'formello' )
						},
					]}
				/>
				<PanelBody title={ __( 'Advanced Options', 'formello' ) } initialOpen={ false }>
					<RangeControl
						value={ attributes.borderWidth }
						label={ __( 'Border Width', 'formello' ) }
						onChange={ ( val ) => {
							setAttributes( { borderWidth: val } );
						} }
						min={ 0 }
						max={ 50 }
						allowReset
					/>
					<RangeControl
						value={ attributes.borderRadius }
						label={ __( 'Border Radius', 'formello' ) }
						onChange={ ( val ) => {
							setAttributes( { borderRadius: val } );
						} }
						min={ 0 }
						max={ 50 }
						allowReset
					/>
					<BoxControl
						label={ __( 'Padding', 'formello' ) }
						values={ values }
						units={ units }
            			onChange={ ( nextValues ) => { 
            				setValues( nextValues ) 
            				setPadding( nextValues ) 
            			} }
						showValues={ true }
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
			<div className={ buttonClass } style={ style } >
				<span>{ attributes.text }</span>
				<div className={ iconClass }></div>
			</div>
		</div>
	);
}

export default compose( withColors( 'backgroundColor', 'borderColor', { textColor: 'color' } ) )( Edit );