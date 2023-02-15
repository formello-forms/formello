import { __, sprintf } from '@wordpress/i18n';

import { useState, useEffect } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

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
	ToolbarButton,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';

import classnames from 'classnames';
import useFormSaved from './useFormSaved';

import { 
	Form
} from '../../icons/icons';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'core/group',
	'formello/button',
	'formello/fieldset',
	'formello/input',
	'formello/textarea',
	'formello/email',
	'formello/checkboxes',
	'formello/select',
	'formello/fileupload',
];
import apiFetch from '@wordpress/api-fetch';

import TemplatesModal from '../library/templates-modal.js';
import { Settings } from './settings/basic';
import { AdvancedSettings } from './settings/advanced';
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
	const { attributes, className, setAttributes, clientId, hasInnerBlocks } =
		props;

	const { postType } = useSelect( ( select ) => ( {
		postType: select( 'core/editor' ).getCurrentPostType()
	} ) );

	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getCurrentPostId()
	} ) );

	const saved = useFormSaved();
    const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
	const registeredActions = getActions();
    const actions = meta[ '_actions' ];

	const updateTransient = () => {
		apiFetch( {
			path: '/formello/v1/patterns/',
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
					actions: actions,
					messages: {
						success: attributes.successMessage,
						error: attributes.errorMessage,
					}
				},
			},
		} ).then( () => {
			updateTransient();
		} );
	}

	const [ active, setActive ] = useState( false );
	const [ showActionsModal, setShowActionsModal ] = useState( false );
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		if (
			undefined === attributes.id ||
			0 === attributes.id ||
			Number(attributes.id )!== postId
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
				'formello-label-right': 'right' === attributes.labelAlign,
			}
		);
	};

	const addAction = ( type ) => {
		registeredActions.forEach( ( a ) => {
			if ( a.type === type ) {
				setMeta( { _actions: [ ...meta['_actions'], a ] } );
				setShowActionsModal(a)
			}
		} );
	};

	const updateAction = ( settings ) => {
		// 1. Make a shallow copy of the items
		const items = [ ...actions ];
		// 2. Make a shallow copy of the item you want to mutate
		items[ active ] = settings;

		setMeta( { _actions: items } );
	};

	const deleteAction = ( actionId ) => {
		const items = [ ...actions ]; // make a separate copy of the array
		items.splice( active, 1 );
		setMeta( { _actions: items } );
		setShowActionsModal( false );
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

	return (
		<div { ...innerBlocksProps }>
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
						controls={ registeredActions.map( ( a ) => {
							return {
								title: a.title,
								icon: a.icon,
								onClick: () => {
									addAction( a.type );
								},
							};
						} ) }
					/>
					{ actions.map( ( a, i ) => {
						let action = registeredActions.find(obj => {
						  return obj.type === a.type
						})
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
			<InspectorControls>
				<Settings {...props} />
			</InspectorControls>
			<AdvancedSettings { ...props } />
			{ 'templates' === isModalOpen && (
				<TemplatesModal
					blockName={ props.name }
					setIsPatternSelectionModalOpen={ () => setModalOpen( false ) }
					clientId={ clientId }
				/>
			) }
			{ showActionsModal && (
				<ActionsModal
					action={ showActionsModal }
					actionId={ active }
					className={ 'formello-modal' }
					clientId={ clientId }
					deleteAction={ deleteAction }
					updateAction={ updateAction }
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
				icon={ Form }
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
