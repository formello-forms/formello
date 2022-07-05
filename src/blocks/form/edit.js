import { __, sprintf } from '@wordpress/i18n';

import { useState, useEffect, RawHTML } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { useSelect, dispatch, select } from '@wordpress/data';

import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	URLInput,
	InnerBlocks,
} from '@wordpress/block-editor';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';

import BlockVariationPicker from './settings/variation-picker';
import { ActionsModal } from './actions/modal';
import { getActions } from './actions/actions';

import {
	TextareaControl,
	ToggleControl,
	PanelBody,
	ToolbarButton,
	ToolbarGroup,
	ToolbarDropdownMenu,
	Notice,
} from '@wordpress/components';

import classnames from 'classnames';
import useFormSaved from './useFormSaved';

import getIcon from '../../utils/get-icon';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'core/group',
	'formello/button',
	'formello/fieldset',
	'formello/input',
	'formello/email',
	'formello/checkboxes',
	'formello/select',
	'formello/fileupload',
];
import apiFetch from '@wordpress/api-fetch';
import { TemplatesModal } from './settings/library';
import { AdvancedSettings } from './settings/advanced';
import {
	getConstraints,
	getFieldsName,
} from '../../components/merge-tags/functions';
import { find } from 'lodash';

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
	const { attributes, className, setAttributes, clientId, hasInnerBlocks } =
		props;

	const saved = useFormSaved();

	const updateTransient = () => {
		apiFetch( {
			path: '/formello/v1/sync_template_library/',
			method: 'POST',
			data: {},
		} );
	};

	if ( saved ) {
		apiFetch( {
			path: '/formello/v1/form/' + attributes.id,
			method: 'PUT',
			data: {
				settings: {
					storeSubmissions: attributes.storeSubmissions,
					recaptchaEnabled: attributes.recaptchaEnabled,
					hide: attributes.hide,
					debug: attributes.debug,
					redirect_url: attributes.redirectUrl,
					fields: getFieldsName( clientId ),
					constraints: getConstraints( clientId ),
					actions: attributes.actions,
					messages: {
						success: attributes.successMessage,
						error: attributes.errorMessage,
					},
				},
			},
		} ).then( () => {
			updateTransient();
		} );
	}

	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const postTitle = useSelect(
		( select ) => select( 'core/editor' ).getPostEdits().title,
		[]
	);

	const postId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);

	const [ active, setActive ] = useState( false );
	const [ showActionsModal, setShowActionsModal ] = useState( false );
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		if ( 'formello_form' === postType && undefined !== postTitle ) {
			setAttributes( { name: postTitle } );
		}
	}, [ postTitle ] );

	useEffect( () => {
		const idx = clientId.substr( 2, 9 ).replace( '-', '' ).replace( /-/g, '' );
		if ( attributes.name.length < 1 ) {
			setAttributes( {
				name: 'form-' + idx,
			} );
		}
		if ( 'formello_form' === postType && undefined !== postTitle ) {
			setAttributes( { name: postTitle } );
		}
		if (
			undefined === attributes.id ||
			0 === attributes.id ||
			attributes.id !== postId
		) {
			setAttributes( {
				id: postId,
			} );
		}
	}, [] );

	const getBlockClassNames = () => {
		return classnames(
			className,
			attributes.asRow ? attributes.labelAlign : undefined,
			{
				'as-row': attributes.asRow,
				'is-bold': attributes.labelIsBold,
				'formello-label-right': 'right' === attributes.labelAlign,
			}
		);
	};

	const actions = getActions();

	const addAction = ( type ) => {
		actions.forEach( ( a ) => {
			if ( a.type === type ) {
				setAttributes( { actions: [ ...attributes.actions, a ] } );
				setShowActionsModal(a)
			}
		} );
	};

	const blockProps = useBlockProps( {
		className: getBlockClassNames(),
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
		template: [ [ 'formello/button' ] ],
		renderAppender: hasInnerBlocks ? InnerBlocks.ButtonBlockAppender : null,
	} );

	const settingsUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello_form',
		page: 'formello-settings',
		tab: 'recaptcha',
	} );

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Template', 'popper' ) }
							icon={ 'layout' }
							onClick={ () => {
								setModalOpen( 'templates' );
							} }
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={ 'admin-generic' }
							label={ __( 'Add action', 'formello' ) }
							controls={ actions.map( ( a ) => {
								return {
									title: a.title,
									icon: a.icon,
									onClick: () => {
										addAction( a.type );
									},
								};
							} ) }
						/>
						{ attributes.actions.map( ( a, i ) => {
							let action = find(actions, {type:a.type});
							if( ! action ){
								return
							}
							return (
								<ToolbarButton
									label={ a.title }
									icon={ action.icon }
									key={ i }
									onClick={ () => {
										setActive( i );
										setShowActionsModal( a );
									} }
								/>
							);
						} ) }
					</ToolbarGroup>
				</BlockControls>
				<PanelBody
					title={ __( 'Settings', 'formello' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Store submissions', 'formello' ) }
						checked={ attributes.storeSubmissions }
						onChange={ ( val ) => {
							setAttributes( { storeSubmissions: val } );
						} }
					/>
					<ToggleControl
						label={ __( 'Enable ReCaptcha', 'formello' ) }
						checked={ attributes.recaptchaEnabled }
						onChange={ ( val ) => {
							setAttributes( { recaptchaEnabled: val } );
						} }
					/>
					{ '' === formello.settings.reCaptcha.site_key ||
						( '' === formello.settings.reCaptcha.secret_key &&
							attributes.recaptchaEnabled && (
							<div className="block-editor-contrast-checker">
								<Notice
									status="warning"
									isDismissible={ false }
								>
									<RawHTML>
										{ sprintf(
											/* translators: Number of templates. */
											__(
												'Please be sure to add a ReCaptcha API key on %s',
												'formello'
											),
											`<a href="${ settingsUrl }">settings page</a>`
										) }
									</RawHTML>
								</Notice>
							</div>
						) ) }
					<ToggleControl
						label={ __( 'Hide form after submission', 'formello' ) }
						checked={ attributes.hide }
						onChange={ ( val ) => {
							setAttributes( { hide: val } );
						} }
					/>
					<div>
						<URLInput
							label={ __( 'Redirect Url', 'formello' ) }
							value={ attributes.redirectUrl }
							onChange={ ( newURL ) =>
								setAttributes( { redirectUrl: newURL } )
							}
							className={ 'formello-urlinput' }
						/>
					</div>
					<TextareaControl
						label={ __( 'Success Message', 'formello' ) }
						value={ attributes.successMessage || formello.settings.messages.form.success }
						onChange={ ( val ) =>
							setAttributes( { successMessage: val } )
						}
					/>
					<TextareaControl
						label={ __( 'Error Message', 'formello' ) }
						value={ attributes.errorMessage || formello.settings.messages.form.error }
						onChange={ ( val ) => setAttributes( { errorMessage: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<AdvancedSettings { ...props } />
			{ 'templates' === isModalOpen && (
				<TemplatesModal
					type={ 'remote' }
					onRequestClose={ () => setModalOpen( false ) }
					clientId={ clientId }
				/>
			) }
			{ showActionsModal && (
				<ActionsModal
					{ ...props }
					action={ showActionsModal }
					actionId={ active }
					className={ 'formello-modal' }
					onRequestClose={ () => {
						setShowActionsModal( false );
					} }
				/>
			) }

			{ children }
		</div>
	);
}

function Placeholder( props ) {
	const { name, clientId, setAttributes } = props;

	const { replaceInnerBlocks } = dispatch( 'core/block-editor' );

	const { getBlockVariations, getDefaultBlockVariation } =
		select( 'core/blocks' );

	const defaultVariation = useSelect( () => {
		return typeof getDefaultBlockVariation === 'undefined'
			? null
			: getDefaultBlockVariation( props.name );
	}, [ name ] );

	const variations = useSelect( () => {
		return getBlockVariations( name, 'block' );
	}, [ name ] );

	return (
		<div { ...useBlockProps() }>
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
	const Component = hasInnerBlocks ? Edit : Placeholder;

	return <Component { ...props } />;
};

export default FormEdit;
