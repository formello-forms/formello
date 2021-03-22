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
	TabPanel
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { pickBy, isEqual, isObject, identity, mapValues } from 'lodash';
import { useState, Fragment } from '@wordpress/element';
import ColorPicker from '../../components/color-picker';
import hexToRGBA from '../../../utils/hex-to-rgba';

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
function Edit( { attributes, setAttributes, context, className } ) {

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
	} = attributes;

	const style = {
		color: textColor ? hexToRGBA( textColor ) : undefined,
		backgroundColor: backgroundColor ? hexToRGBA( backgroundColor, backgroundColorOpacity ) : undefined,
		borderColor: borderColor ? hexToRGBA( borderColor, borderColorOpacity ) : undefined
	}

	return (
		<div className={ className }>
			<InspectorControls>
				<PanelBody title="Options" initialOpen={ true }>
					<TextControl
						label={ __( 'Text', 'formello' ) }
						value={ attributes.text }
						onChange={ ( val ) => setAttributes( { text: val } ) }
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
													alpha={ true }
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
													value={ textColor }
													alpha={ false }
													key={ 'buttonTextColor' }
													onChange={ ( nextTextColor ) =>
														setAttributes( {
															textColor: nextTextColor,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Border Color', 'formello' ) }
													value={ borderColor }
													alpha={ true }
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
													key={ 'buttonTextColorHover' }
													onChange={ ( nextTextColorHover ) =>
														setAttributes( {
															textColorHover: nextTextColorHover,
														} )
													}
												/>

												<ColorPicker
													label={ __( 'Border Color', 'formello' ) }
													value={ borderColorHover }
													alpha={ true }
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
				</PanelBody>

			</InspectorControls>

			<div className='button-span' style={ style }>
				<span>{ attributes.text }</span>
			</div>
		</div>
	);
}

export default Edit;