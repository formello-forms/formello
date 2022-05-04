import { __, sprintf } from '@wordpress/i18n';

import { useState, useEffect, RawHTML } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { withSelect, useSelect, dispatch, select } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	URLInput,
} from '@wordpress/block-editor';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';

import BlockVariationPicker from './variation-picker';
import { ActionsModal } from './actions/modal';
import { getActions } from './actions/actions';

import {
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelBody,
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
	DropdownMenu,
	Notice,
} from '@wordpress/components';

import classnames from 'classnames';
import useFormSaved from './useFormSaved';

import getIcon from '../../utils/get-icon';

import { Mailchimp, GetResponse, Email, WebHooks, Mailpoet } from './actions/icons';
import apiFetch from '@wordpress/api-fetch';

const icons = {
	mailchimp: Mailchimp,
	mailpoet: Mailpoet,
	getresponse: GetResponse,
	email: Email,
	webhooks: WebHooks
};

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

import { TemplatesModal } from './library';
import {
	getConstraints,
	getFieldsName,
} from '../../components/merge-tags/functions';

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
	const { attributes, className, setAttributes, clientId } = props;

	const saved = useFormSaved();

	const updateTransient = () => {
		apiFetch( {
			path: '/formello/v1/sync_template_library/',
			method: 'POST',
			data: {},
		} );
	};

	if( saved ){
		apiFetch( {
			path: '/formello/v1/form/' + attributes.id,
			method: 'PUT',
			data: {
				settings: {
					storeSubmissions: attributes.storeSubmissions,
					recaptchaEnabled: attributes.recaptchaEnabled,
					hide: attributes.hide,
					debug: attributes.debug,
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
				//setShowActionsModal(a)
			}
		} );
	};

	const blockProps = useBlockProps( {
		className: getBlockClassNames(),
	} );

	const changeRequiredText = ( value ) => {
		setAttributes( { requiredText: value } );

		// Update the child block's attributes
		const children =
			select( 'core/block-editor' ).getBlocksByClientId( clientId )[ 0 ]
				.innerBlocks;
		children.forEach( ( child ) => {
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				child.clientId,
				{ requiredText: value }
			);
		} );
	};

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
		template: [ [ 'formello/button' ] ],
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
						<DropdownMenu
							icon={ 'admin-generic' }
							label={ __( 'Add action', 'formello' ) }
							controls={ actions.map( ( a ) => {
								return {
									title: a.title,
									icon: icons[ a.type ],
									onClick: () => {
										addAction( a.type );
									},
								};
							} ) }
						/>
						{ attributes.actions.map( ( a, i ) => {
							return (
								<ToolbarButton
									label={ a.title }
									icon={ icons[ a.type ] }
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
						value={ attributes.successMessage }
						onChange={ ( val ) =>
							setAttributes( { successMessage: val } )
						}
					/>
					<TextareaControl
						label={ __( 'Error Message', 'formello' ) }
						value={ attributes.errorMessage }
						onChange={ ( val ) => setAttributes( { errorMessage: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={ __( 'Label on side', 'formello' ) }
					checked={ attributes.asRow }
					onChange={ ( val ) => setAttributes( { asRow: val } ) }
				/>
				{ attributes.asRow && (
					<SelectControl
						label={ __( 'Label horizontal position', 'formello' ) }
						value={ attributes.labelAlign }
						options={ [
							{ label: 'left', value: 'left' },
							{ label: 'right', value: 'right' },
						] }
						onChange={ ( val ) => {
							setAttributes( { labelAlign: val } );
						} }
					/>
				) }
				<ToggleControl
					label={ __( 'Bolded label', 'formello' ) }
					checked={ attributes.labelIsBold }
					onChange={ ( val ) => setAttributes( { labelIsBold: val } ) }
				/>
				<ToggleControl
					label={ __( 'Enable debug', 'formello' ) }
					checked={ attributes.debug }
					onChange={ ( val ) => {
						setAttributes( { debug: val } );
					} }
				/>
				<TextControl
					label={ __( 'Required Field Indicator', 'formello' ) }
					value={ attributes.requiredText }
					onChange={ changeRequiredText }
				/>
			</InspectorAdvancedControls>
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
	const { defaultVariation, variations, clientId, setAttributes } = props;
	const { replaceInnerBlocks } = dispatch( 'core/block-editor' );

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

const applyWithSelect = withSelect( ( select, props ) => {
	const { getBlocks } = select( 'core/block-editor' );
	const { getBlockType, getBlockVariations, getDefaultBlockVariation } =
		select( 'core/blocks' );
	const innerBlocks = getBlocks( props.clientId );

	return {
		// Subscribe to changes of the innerBlocks to control the display of the layout selection placeholder.
		blockType: getBlockType( props.name ),
		defaultVariation:
			typeof getDefaultBlockVariation === 'undefined'
				? null
				: getDefaultBlockVariation( props.name ),
		hasInnerBlocks:
			select( 'core/block-editor' ).getBlocks( props.clientId ).length > 0,
		innerBlocks,
		variations:
			typeof getBlockVariations === 'undefined'
				? null
				: getBlockVariations( props.name ),
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
	const Component = hasInnerBlocks ? Edit : Placeholder;

	return <Component { ...props } />;
};

export default compose( [ applyWithSelect ] )( FormEdit );
