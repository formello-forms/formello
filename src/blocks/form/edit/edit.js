import { __ } from '@wordpress/i18n';

import { useState, useEffect, useContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useEntityProp,
	EntityProvider,
} from '@wordpress/core-data';

import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	Warning,
} from '@wordpress/block-editor';

import {
	ToolbarButton,
	ToolbarGroup,
	Placeholder,
	Spinner,
	Disabled,
} from '@wordpress/components';
import { layout } from '@wordpress/icons';

import classnames from 'classnames';
import useSaveForm from '../hooks/use-save-form';
import useForm from '../hooks/use-form';

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
	'formello/checkboxes',
	'formello/select',
	'formello/fileupload',
];
import apiFetch from '@wordpress/api-fetch';

import TemplatesModal from '../../library/templates-modal.js';
import { Settings } from '../settings/basic';
import { Controls } from '../settings/controls';
import { AdvancedSettings } from '../settings/advanced';
import {
	getConstraints,
	getFieldsName,
} from '../../../components/merge-tags/functions';

export default function Edit( props ) {
	const { attributes, className, clientId, hasInnerBlocks } =
		props;

	const { postType, postId, fields } = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );

			return {
				postType: select( 'core/editor' ).getCurrentPostType(),
				postId: select( 'core/editor' ).getCurrentPostId(),
				fields: block.innerBlocks,
			};
		},
		[ clientId ]
	);

	const {
		isFormelloFormResolved,
		isFormelloFormMissing,
	} = useForm( attributes.id );

	const isDisabled = useContext( Disabled.Context );
	const [ status, setStatus ] = useEntityProp( 'postType', 'formello_form', 'status', attributes.id );
	const [ meta, setMeta ] = useEntityProp( 'postType', 'formello_form', 'meta', attributes.id );
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		return () => {
			// Bails when the block is inside a preview container.
			if ( 'formello_form' === postType || isDisabled ) {
				return;
			}

			if ( attributes.id ) {
				setStatus( 'formello-trash' );
			}
		};
	}, [] );

	useEffect( () => {
		if ( ! meta ) {
			return;
		}

		const settings = {
			storeSubmissions: attributes.storeSubmissions,
			recaptchaEnabled: attributes.recaptchaEnabled,
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

	const saved = useSaveForm();

	const updateTransient = () => {
		apiFetch( {
			path: '/formello/v1/patterns/',
			method: 'POST',
			data: {},
		} );
	};

	if ( saved ) {
		updateTransient();
	}

	const getBlockClassNames = () => {
		return classnames(
			className,
			{
				'as-row': attributes.asRow,
				'formello-label-right': 'right' === attributes.labelAlign,
			}
		);
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

	// It's a preview
	if( ! postType ){
		return (
			<div { ...innerBlocksProps }>
				{ children }
			</div>
		);
	}

	if ( isFormelloFormMissing && 'formello_form' !== postType ) {
		return (
			<div { ...blockProps }>
				<Warning>{ __( 'Form has been deleted or is unavailable.', 'formello' ) }</Warning>
			</div>
		);
	}

	if ( ! isFormelloFormResolved && 'formello_form' !== postType ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	return (
		<EntityProvider kind="postType" type="formello_form" id={ attributes.id }>
			<div { ...innerBlocksProps }>

				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Template', 'popper' ) }
							icon={ layout }
							onClick={ () => {
								setModalOpen( 'templates' );
							} }
						/>
					</ToolbarGroup>
					<Controls { ...props } />
				</BlockControls>

				<InspectorControls>
					<Settings { ...props } />
				</InspectorControls>
				<AdvancedSettings { ...props } />
				{ 'templates' === isModalOpen && (
					<TemplatesModal
						blockName={ props.name }
						setIsPatternSelectionModalOpen={ () => setModalOpen( false ) }
						clientId={ clientId }
					/>
				) }

				{ children }
			</div>
		</EntityProvider>
	);
}
