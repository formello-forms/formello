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

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withSelect, useSelect, select, dispatch, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { compose } from '@wordpress/compose';
import {
	getConstraints,
	getFieldsName
} from '../../components/merge-tags/functions';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	URLInput,
	Inserter
} from '@wordpress/block-editor';

import {
	isReusableBlock,
	createBlocksFromInnerBlocksTemplate,
	createBlock
} from '@wordpress/blocks';
const {
	getBlock,
	getBlocks,
	getClientIdsOfDescendants,
	getBlockRootClientId,
	getBlocksByClientId,
	getBlockHierarchyRootClientId,
	getPreviousBlockClientId,
	getBlockParents,
	getBlockCount
} = wp.data.select("core/block-editor");

import apiFetch from '@wordpress/api-fetch';
import BlockVariationPicker from './variation-picker';
import { ActionsModal } from './actions/modal';
import { getActions } from './actions/actions';

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
	Icon,
	Dropdown,
	DropdownMenu
} from '@wordpress/components';

import classnames from 'classnames';

import getIcon from '../../utils/get-icon';

import { Mailchimp, GetResponse, Email } from './actions/icons';

const icons = {
    mailchimp: Mailchimp,
    getresponse: GetResponse,
    email: Email,
};

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'core/group',
	'formello/button',
	'formello/input',
	'formello/email',
	'formello/checkboxes',
	'formello/select',
	'formello/fileupload',
];
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';
import { store as blocksStore } from '@wordpress/block-editor';
import usePostSaved from './savedHook';
import { TemplatesModal } from './library';

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

	const {
		attributes,
		className,
		setAttributes,
		clientId,
		hasChildBlocks,
		innerBlocks
	} = props;

	const saved = usePostSaved();

	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const postTitle = useSelect(
		( select ) => select( 'core/editor' ).getPostEdits().title,
		[]
	);

    const post_id = useSelect(select =>
        select("core/editor").getCurrentPostId()
    );

	if( saved ){

		apiFetch( {
			path: '/formello/v1/form/' + post_id,
			method: 'POST',
			data: {
				settings: {
					storeSubmissions: attributes.storeSubmissions,
					recaptchaEnabled: attributes.recaptchaEnabled,
					hide: attributes.hide,
					debug: attributes.debug,
					fields: getFieldsName( clientId ),
					constraints: getConstraints( clientId ),
					actions: attributes.actions,
				},
			},
		} ).then( ( result ) => {
			// DO NOTHING
		} );
	}

	const [ active, setActive ] = useState(false);
	const [ showActionsModal, setShowActionsModal ] = useState(false);
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect(
		() => {
			if( 'formello_form' == postType && undefined !== postTitle ){
				setAttributes( { name: postTitle } )
			}
		},
		[ postTitle ]
	);

	useEffect(
		() => {
			let idx = clientId.substr( 2, 9 ).replace( '-', '' ).replace(/-/g, '')
			if( attributes.name.length < 1 ){
				setAttributes( {
					name: 'form-' + idx
				} )
			}
			if( 'formello_form' === postType && undefined !== postTitle ){
				setAttributes( { name: postTitle } )
			}
			if( undefined === attributes.id || 0 === attributes.id || attributes.id !== post_id ){
				setAttributes({
					id: post_id
				});
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

	const actions = getActions()

	const addAction = (type) => {
		actions.map( (a) => {
			if( a.type === type ){
				setAttributes( { actions: [ ...attributes.actions, a ] } )
				//setShowActionsModal(a)
			}
		} )
	};

	const blockProps = useBlockProps( {
		className: getBlockClassNames(),
	} );
    //const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps );

	return (
		<div {...blockProps}>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Template', 'popper' ) }
							icon={ 'layout' }
							onClick={ () => {
								setModalOpen( 'templates' );
							}}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
					    <DropdownMenu
					        icon={ 'admin-generic' }
							label={ __( 'Add action', 'formello' ) }
					        controls={ 
					        	actions
					        	.map( (a) => {
					        		return {
						        		title: a.title,
						        		icon: icons[a.type],
						                onClick: () => {
											addAction( a.type ) 
						                },
						        	}
					        } ) }
					    />
					    {
					    	attributes.actions.map( ( a, i ) => {
					    		var action = _.find(actions, {type:a.type});
								return (
									<ToolbarButton
										label={ a.title }
										icon={ icons[a.type] }
										key={ i }
										onClick={ () => {
											setActive(i)
											setShowActionsModal( a )
										} }
									/>
								)
					    	} )
					    }
					</ToolbarGroup>
				</BlockControls>
				<PanelBody title={ __( 'Settings', 'formello' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Store submissions', 'formello' ) }
						checked={ attributes.storeSubmissions }
						onChange={ ( val ) => {
							setAttributes( { 'storeSubmissions': val } )
						} }
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
						onChange={ ( val ) => {
							setAttributes( { 'hide': val } )
						} }
					/>
					<div>
						<URLInput
							label={ __( 'Redirect Url', 'formello' ) }
							value={ attributes.redirectUrl }
							onChange={ newURL => setAttributes( { redirectUrl: newURL } ) }
							className={ 'formello-urlinput' }
						/>
					</div>
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
				<ToggleControl
					label={ __(
						'Enable debug',
						'formello'
					) }
					checked={ attributes.debug }
					onChange={ ( val ) => {
						setAttributes( { 'debug': val } )
					} }
				/>
			</InspectorAdvancedControls>
			{ 'templates' === isModalOpen &&
				<TemplatesModal
					type={ 'remote' }
					onRequestClose={ () => setModalOpen( false ) }
					clientId={ clientId }
				/>
			}
			{
				showActionsModal &&
				<ActionsModal
					{...props}
					action={ showActionsModal }
					actionId={ active }
					onRequestClose={ () => { 
						setShowActionsModal( false )
					} }
				/>
			}
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				templateLock={ false }
				template={ [ [ 'formello/button', {} ] ] }
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
		<div {...useBlockProps()}>
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
		</div>
	);
}

const applyWithSelect = withSelect( ( select, props ) => {
	const { getBlocks } = select( 'core/block-editor' );
	const { getBlockType, getBlockVariations, getDefaultBlockVariation } = select( 'core/blocks' );
	const innerBlocks = getBlocks( props.clientId );

	return {
		// Subscribe to changes of the innerBlocks to control the display of the layout selection placeholder.
		blockType: getBlockType( props.name ),
		defaultVariation: typeof getDefaultBlockVariation === 'undefined' ? null : getDefaultBlockVariation( props.name ),
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