import { __ } from '@wordpress/i18n';

import { useState, useEffect, useContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { useEntityProp } from '@wordpress/core-data';
import {
	store as blockEditorStore,
	InspectorControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';

import { ToolbarButton, ToolbarGroup, Disabled } from '@wordpress/components';
import { layout } from '@wordpress/icons';

import classnames from 'classnames';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/columns',
	'core/group',
	'formello/input',
	'formello/textarea',
	'formello/button',
	'formello/output',
	'formello/fieldset',
	'formello/select',
	'formello/multichoices',
];

import TemplatesModal from './templates-modal.js';
import { Settings } from '../settings/basic';
import { Controls } from '../settings/controls';
import { AdvancedSettings } from '../settings/advanced';
import {
	getConstraints,
	getFieldsName,
} from '../../../components/merge-tags/functions';

export default function Edit( props ) {
	const { attributes, className, clientId, hasInnerBlocks } = props;

	const { postType, postId, fields } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );

			return {
				postType: select( 'core/editor' ).getCurrentPostType(),
				postId: select( 'core/editor' ).getCurrentPostId(),
				fields: block.innerBlocks,
			};
		},
		[ clientId ]
	);

	const isDisabled = useContext( Disabled.Context );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		'formello_form',
		'meta',
		attributes.id
	);

	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		if ( ! meta || isDisabled ) {
			return;
		}

		const settings = {
			storeSubmissions: attributes.storeSubmissions,
			captchaEnabled: attributes.captchaEnabled,
			captchaType: attributes.captchaType,
			hide: attributes.hide,
			debug: attributes.debug,
			redirect_url: attributes.redirectUrl,
			fields: getFieldsName( clientId ),
			constraints: getConstraints( clientId ),
			messages: {
				success: attributes.successMessage,
				error: attributes.errorMessage,
			},
		};

		setMeta( { _formello_settings: settings } );
		if ( 'formello_form' !== postType || isDisabled ) {
			setMeta( { _formello_parent: postId } );
		}
	}, [ fields, attributes ] );

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

	{
		applyFilters( 'formello.form.allowedBlocks', ALLOWED_BLOCKS );
	}

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
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

	// It's a preview embed.
	if ( ! postType || isDisabled ) {
		return <div { ...innerBlocksProps }>{ children }</div>;
	}

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
					blockName={ props.name }
					setIsPatternSelectionModalOpen={ () =>
						setModalOpen( false )
					}
					clientId={ clientId }
				/>
			) }

			{ children }
		</div>
	);
}
