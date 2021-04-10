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
	__experimentalUseEditorFeature as useEditorFeature
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	RangeControl,
	FontSizePicker,
	SelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBoxControl as BoxControl,
	TabPanel
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { pickBy, isEqual, isObject, identity, mapValues } from 'lodash';
import { useState, Fragment, useEffect } from '@wordpress/element';
import ColorPicker from '../../components/color-picker';
import hexToRGBA from '../../../utils/hex-to-rgba';
import buildCSS from '../../../utils/build-css';
import { useSelect } from '@wordpress/data';
import MainCSS from './generateCss';

import './editor.scss';
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
function Edit( { attributes, setAttributes, context, className, clientId } ) {

	const {
		backgroundColor,
		backgroundColorOpacity,
		backgroundColorHover,
		backgroundColorHoverOpacity,
		textColor,
		textColorHover,
		borderColor,
		borderColorOpacity,
		borderColorHover,
		borderColorHoverOpacity,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		fontSize,
		iconPosition,
		showIcon,
		iconType,
		alignment
	} = attributes;

    const units = [
        { value: 'px', label: 'px', default: 0 },
        { value: '%', label: '%', default: 10 },
        { value: 'em', label: 'em', default: 0 },
    ];

    const fontSizes = [
        {
            name: __( 'Small' ),
            slug: 'small',
            size: 12,
        },
        {
            name: __( 'Medium' ),
            slug: 'medium',
            size: 14,
        },
        {
            name: __( 'Big' ),
            slug: 'big',
            size: 16,
        },
    ];
    const fallbackFontSize = 16;

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

	const buttonClass = classnames( 'button-span', iconPosition, {
		'running': showIcon
	} );

	const iconClass = classnames( 'ld', 'ld-spin', iconType );
	const containerClass = classnames( className, alignment );

	let form_id, block_id;

	useSelect( (select)=>{
		let form = select( 'core/block-editor' ).getBlockParentsByBlockName( clientId, 'formello/form' )
		form_id = select( 'core/block-editor' ).getBlock( form[0] ).attributes.id
		block_id = form[0]
	} )

	useEffect(
		() => {
			setAttributes( { form_id: form_id } )
		}
	)

    const [ values, setValues ] = useState( {
		top: paddingTop,
		left: paddingLeft,
		right: paddingRight,
		bottom: paddingBottom,
    } );

    const setPadding = ( { top, right, bottom, left } ) => {
    	setAttributes( {
			paddingTop: top || paddingTop,
			paddingLeft: left || paddingLeft,
			paddingRight: right || paddingRight,
			paddingBottom: bottom || paddingBottom,
    	} )
    }

	return (
		<>
		<MainCSS { ...attributes } formid={ 'block-' + clientId } />
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
			        <FontSizePicker
			            fontSizes={ fontSizes }
			            value={ fontSize }
			            fallbackFontSize={ fallbackFontSize }
			            onChange={ ( newFontSize ) => {
			                setAttributes( { fontSize: newFontSize } );
			            } }
			        />
				</PanelBody>
				<PanelBody>
					<TabPanel className="layout-tab-panel formello-control-tabs"
						activeClass="active-tab"
						tabs={ [
							{
								name: 'button-colors',
								title: __( 'Normal', 'formello' ),
								className: 'button-colors',
							},
							{
								name: 'button-colors-hover',
								title: __( 'Hover', 'formello' ),
								className: 'button-colors-hover',
							},
						] }>
						{
							( tab ) => {
								const isNormal = tab.name === 'button-colors';

								return (
									<div>
										{ isNormal ? (
											<Fragment>
												<ColorPicker
													label={ __( 'Background Color', 'formello' ) }
													value={ backgroundColor }
													alpha={ false }
													valueOpacity={ backgroundColorOpacity }
													attrOpacity={ 'backgroundColorOpacity' }
													key={ 'buttonBackgroundColor' }
													onChange={ ( value ) =>
														setAttributes( {
															backgroundColor: value,
														} )
													}
													onOpacityChange={ ( value ) =>
														setAttributes( {
															backgroundColorOpacity: value,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Text Color', 'formello' ) }
													value={ textColorHover }
													alpha={ false }
													key={ 'buttonColor' }
													onChange={ ( nextColor ) =>
														setAttributes( {
															textColorHover: nextColor,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Border Color', 'formello' ) }
													value={ borderColor }
													alpha={ false }
													valueOpacity={ borderColorOpacity }
													attrOpacity={ 'borderColorOpacity' }
													key={ 'buttonBorderColor' }
													onChange={ ( value ) =>
														setAttributes( {
															borderColor: value,
														} )
													}
													onOpacityChange={ ( value ) =>
														setAttributes( {
															borderColorOpacity: value,
														} )
													}
												/>

											</Fragment>

										) : (

											<Fragment>
												<ColorPicker
													label={ __( 'Background Color', 'formello' ) }
													value={ backgroundColorHover }
													alpha={ true }
													valueOpacity={ backgroundColorHoverOpacity }
													attrOpacity={ 'backgroundColorHoverOpacity' }
													key={ 'buttonBackgroundColorHover' }
													onChange={ ( nextBackgroundColorHover ) =>
														setAttributes( {
															backgroundColorHover: nextBackgroundColorHover,
														} )
													}
													onOpacityChange={ ( value ) =>
														setAttributes( {
															backgroundColorHoverOpacity: value,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Text Color', 'formello' ) }
													value={ textColorHover }
													alpha={ false }
													key={ 'buttonColorHover' }
													onChange={ ( nextColorHover ) =>
														setAttributes( {
															textColorHover: nextColorHover,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Border Color', 'formello' ) }
													value={ borderColorHover }
													alpha={ false }
													valueOpacity={ borderColorHoverOpacity }
													attrOpacity={ 'borderColorHoverOpacity' }
													key={ 'buttonBorderColorHover' }
													onChange={ ( value ) =>
														setAttributes( {
															borderColorHover: value,
														} )
													}
													onOpacityChange={ ( value ) =>
														setAttributes( {
															borderColorHoverOpacity: value,
														} )
													}
												/>
											</Fragment>
										) }
									</div>
								);
							}
						}
					</TabPanel>
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

			<button className={ buttonClass } disabled>
				<span>{ attributes.text }</span>
			</button>
		</div>
		</>
	);
}

export default Edit;