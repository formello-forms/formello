import { __ } from '@wordpress/i18n';

import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { layout } from '@wordpress/icons';

import classnames from 'classnames';

import { TemplatesModal } from './templates-modal.js';
import { Settings } from '../settings/basic';
import { Controls } from '../settings/controls';
import { AdvancedSettings } from '../settings/advanced';
import { useFormFields } from './use-form-fields';

export default function Edit( props ) {
	const { attributes, className, clientId, hasInnerBlocks, name } = props;

	const { postType, postId, isPreview } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return {
			postType: select( 'core/editor' ).getCurrentPostType(),
			postId: select( 'core/editor' ).getCurrentPostId(),
			isPreview: getSettings().__unstableIsPreviewMode,
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const [ isModalOpen, setModalOpen ] = useState( false );

	const data = useFormFields( clientId );

	useEffect( () => {
		const settings = {
			...meta._formello_settings,
			fields: data.fields,
			constraints: data.constraints,
		};
		if ( 'formello_form' === postType && ! isPreview && meta ) {
			setMeta( {
				...meta,
				_formello_settings: settings,
			} );
		}
	}, [ data ] );

	useEffect( () => {
		const settings = {
			...meta._formello_settings,
			storeSubmissions: attributes.storeSubmissions,
			captchaEnabled: attributes.captchaEnabled,
			captchaType: attributes.captchaType,
			hide: attributes.hide,
			debug: attributes.debug,
			redirect_url: attributes.redirectUrl,
			messages: {
				success: attributes.successMessage,
				error: attributes.errorMessage,
			},
		};
		if ( 'formello_form' === postType && ! isPreview && meta ) {
			setMeta( {
				...meta,
				_formello_settings: settings,
			} );
		}
	}, [ attributes ] );

	const getBlockClassNames = () => {
		return classnames( className, {
			'as-row': attributes.asRow,
			'formello-label-right': 'right' === attributes.labelAlign,
			'is-style-bolded': attributes.labelIsBold,
		} );
	};

	const blockProps = useBlockProps( {
		className: getBlockClassNames(),
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		//templateLock: false,
		template: [ [ 'formello/button' ] ],
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: null,
		prioritizedInserterBlocks: [
			'formello/input',
			'formello/select',
			'formello/textarea',
			'formello/multichoices',
		],
	} );

	return (
		<div { ...innerBlocksProps }>
			<BlockControls>
				{ 'formello_form' === postType && (
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Template', 'popper' ) }
							icon={ layout }
							onClick={ () => {
								setModalOpen( 'templates' );
							} }
						/>
					</ToolbarGroup>
				) }
				<Controls { ...props } />
			</BlockControls>

			<InspectorControls>
				<Settings { ...props } />
			</InspectorControls>
			<AdvancedSettings { ...props } />
			{ 'templates' === isModalOpen && (
				<TemplatesModal
					clientId={ clientId }
					onRequestClose={ () => setModalOpen( false ) }
					blockName={ name }
				/>
			) }
			{ children }
		</div>
	);
}
