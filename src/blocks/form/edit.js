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

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withSelect, useSelect, select, dispatch, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	InnerBlocks,
	useBlockProps,
	URLInput
} from '@wordpress/block-editor';

import {
	isReusableBlock,
	createBlocksFromInnerBlocksTemplate,
	createBlock
} from '@wordpress/blocks';

import apiFetch from '@wordpress/api-fetch';
import BlockVariationPicker from './variation-picker';

import {
	BaseControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	Popover,
	SelectControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	Icon
} from '@wordpress/components';

import classnames from 'classnames';

import getIcon from '../../utils/get-icon';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'create-block/formello-conditional-fields',
	'formello/actions',
	'formello/columns',
	'formello/button',
	'formello/input',
	'formello/email',
	'formello/checkboxes',
	'formello/select',
];
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';

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
function Edit( {
	attributes,
	className,
	setAttributes,
	clientId,
	hasChildBlocks
} ) {

	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const postTitle = useSelect(
		( select ) => select( 'core/editor' ).getPostEdits().title,
		[]
	);

	useEffect(
		() => {
			if( 'formello_form' == postType && undefined !== postTitle ){
				setAttributes( { name: postTitle } )
			}
		},
		[ postTitle ]
	);

	const { __experimentalConvertBlocksToReusable } = useDispatch( reusableBlocksStore );
	useEffect(
		() => {
			let idx = clientId.substr( 2, 9 ).replace( '-', '' ).replace(/-/g, '')
			if( attributes.name.length < 1 ){
				setAttributes( {
					name: 'form-' + idx
				} )
			}
			if( 'formello_form' == postType && undefined !== postTitle ){
				setAttributes( { name: postTitle } )
			}
			if( undefined === attributes.id && 'wp_block' !== postType ){
				apiFetch( {
					path: '/formello/v1/form/create',
					method: 'POST',
					data: {
						name: 'form-' + idx
					},
				} ).then( ( result ) => {
					setAttributes({
						id: result.id
					});
				} );
			}
			setAttributes( {
				blockId: clientId,
			} )		
			return () => {
				//setAttributes({ id: undefined })
				/*apiFetch( {
					path: '/formello/v1/form/delete/',
					method: 'DELETE',
					data: {
						id: attributes.id
					}
				} )*/
			}
		},
		[]
	);

	const getBlockClassNames = () => {

		return classnames(
			className, 
			attributes.asRow
				? attributes.labelAlign
				: undefined,
			{
				'as-row': attributes.asRow,
				'is-bold': attributes.labelIsBold
			}
		);
	};

	const blockProps = useBlockProps( {
		className: getBlockClassNames(),
	} );

	return (
		<div {...blockProps}>
            <BlockControls>
                <ToolbarGroup>
	                <ToolbarButton
	                	label={ __( 'Add to reusable block' ) }
	                    icon={ 'controls-repeat' }
	                    onClick={ ()=> { 
							setAttributes( {
								id: undefined
							} )
							__experimentalConvertBlocksToReusable( [ clientId ] )
	                    } }
	                />
                </ToolbarGroup>
            </BlockControls>
			<InspectorControls>
				<PanelBody title="Form Settings" initialOpen={ true }>
					<TextControl
						label={ __( 'Name', 'formello' ) }
						value={ attributes.name }
						onChange={ ( val ) => setAttributes( { 'name': val } ) }
					/>
					<BaseControl
						label={ __( 'Redirect Url', 'formello' ) }
					>
						<URLInput
							value={ attributes.redirectUrl }
							onChange={ newURL => setAttributes( { redirectUrl: newURL } ) }
							className={ 'formello-urlinput' }
						/>
					</BaseControl>
					<ToggleControl
						label={ __( 'Store submissions', 'formello' ) }
						checked={ attributes.storeSubmissions }
						onChange={ ( val ) => setAttributes( { 'storeSubmissions': val } ) }
					/>
					<ToggleControl
						label={ __( 'Enable ReCaptcha', 'formello' ) }
						checked={ attributes.recaptchaEnabled }
						onChange={ ( val ) => {
							setAttributes( { 'recaptchaEnabled': val } ) 
						} }
					/>
					<ToggleControl
						label={ __(
							'Hide form after submission',
							'formello'
						) }
						checked={ attributes.hide }
						onChange={ ( val ) => setAttributes( { 'hide': val } ) }
					/>
					<TextareaControl
						label={ __( 'Success Message', 'formello' ) }
						value={ attributes.successMessage }
						onChange={ ( val ) => setAttributes( { 'successMessage': val } ) }
					/>
					<TextareaControl
						label={ __( 'Error Message', 'formello' ) }
						value={ attributes.errorMessage }
						onChange={ ( val ) => setAttributes( { 'errorMessage': val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={ __( 'Label on side', 'formello' ) }
					checked={ attributes.asRow }
					onChange={ ( val ) => setAttributes( { 'asRow': val } ) }
				/>
				{
					attributes.asRow && 
					<SelectControl
				        label={ __( 'Label horizontal position', 'formello' ) }
				        value={ attributes.labelAlign }
				        options={ [
				            { label: 'left', value: 'label-left' },
				            { label: 'right', value: 'label-right' }
				        ] }
				        onChange={ ( val ) => { setAttributes( { labelAlign: val } ) } }
					/>
				}
				<ToggleControl
					label={ __( 'Bolded label', 'formello' ) }
					checked={ attributes.labelIsBold }
					onChange={ ( val ) => setAttributes( { 'labelIsBold': val } ) }
				/>
			</InspectorAdvancedControls>

			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				templateLock={ false }
				renderAppender={ () => <InnerBlocks.ButtonBlockAppender /> }
			/>

		</div>
	);
}

function Placeholder ( props ) {

	const { className, blockType, defaultVariation, hasInnerBlocks, variations, clientId } = props;
	const {
		insertBlock,
		replaceInnerBlocks,
	} = dispatch( 'core/block-editor' );

	return (
		<BlockVariationPicker
			icon={ getIcon( 'form' ) }
			label={ 'Form' }
			instructions={ __( 'Select a form to start with.', 'formello' ) }
			variations={ variations }
			clientId={ clientId }
			allowSkip
			onSelect={ ( nextVariation = defaultVariation ) => {
				if ( nextVariation.attributes ) {
					setAttributes( nextVariation.attributes );
				}
				if ( nextVariation.innerBlocks ) {
					replaceInnerBlocks(
						props.clientId,
						createBlocksFromInnerBlocksTemplate(
							nextVariation.innerBlocks
						),
						true
					);
				}
			} }
		/>
	);
}

const applyWithSelect = withSelect( ( select, props ) => {
	const { getBlocks } = select( 'core/block-editor' );
	const { getBlocksByClientId } = select( 'core/editor' );
	const { getBlockType, getBlockVariations, getDefaultBlockVariation } = select( 'core/blocks' );
	const innerBlocks = getBlocks( props.clientId );

	return {
		// Subscribe to changes of the innerBlocks to control the display of the layout selection placeholder.
		blockType: getBlockType( props.name ),
		defaultVariation: typeof getDefaultBlockVariation === 'undefined' ? null : getDefaultBlockVariation( props.name ),
		getBlocksByClientId,
		hasInnerBlocks: select( 'core/block-editor' ).getBlocks( props.clientId ).length > 0,
		innerBlocks,
		variations: typeof getBlockVariations === 'undefined' ? null : getBlockVariations( props.name ),
	};
} );

const FormEdit = ( props ) => {
	const { clientId } = props;
	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);
	const Component = hasInnerBlocks
		? Edit
		: Placeholder;

	return <Component { ...props } />;
};

export default compose( [ applyWithSelect ] )( FormEdit );