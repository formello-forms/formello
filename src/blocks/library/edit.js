/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	useEntityBlockEditor,
	useEntityRecord,
	store as coreStore,
} from '@wordpress/core-data';
import {
	Placeholder,
	Spinner,
	Button,
	Modal,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps,
	RecursionProvider,
	useHasRecursion,
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	Warning,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useState, useCallback, Fragment, useEffect } from '@wordpress/element';
import { TemplatesModal } from '../form/templates-modal';

const NOOP = () => {};

function setBlockEditMode( setEditMode, blocks ) {
	blocks.forEach( ( block ) => {
		const editMode = 'disabled';
		setEditMode( block.clientId, editMode );

		setBlockEditMode(
			setEditMode,
			block.innerBlocks,
			// Disable editing for nested patterns.
			block.name === 'disabled'
		);
	} );
}

export default function ReusableBlockEdit( {
	attributes: { ref },
	clientId,
	name,
	setAttributes,
} ) {
	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ isDisabled, setIsDisabled ] = useState( true );
	const [ titleTemp, createTitle ] = useState( '' );

	const { onNavigateToEntityRecord, innerBlocks, editingMode } = useSelect(
		( select ) => {
			const { canUser } = select( coreStore );
			const {
				getBlocks,
				getSettings,
				getBlockEditingMode: _getBlockEditingMode,
			} = select( blockEditorStore );
			const blocks = getBlocks( clientId );
			const canEdit = canUser( 'update', 'blocks', ref );

			// For editing link to the site editor if the theme and user permissions support it.
			return {
				innerBlocks: blocks,
				userCanEdit: canEdit,
				getBlockEditingMode: _getBlockEditingMode,
				onNavigateToEntityRecord:
					getSettings().onNavigateToEntityRecord,
				editingMode: _getBlockEditingMode( clientId ),
			};
		},
		[ clientId, ref ]
	);

	const handleEditOriginal = () => {
		onNavigateToEntityRecord( {
			postId: ref,
			postType: 'formello_form',
		} );
	};

	const hasAlreadyRendered = useHasRecursion( ref );
	const { record, hasResolved } = useEntityRecord(
		'postType',
		'formello_form',
		ref
	);

	const isMissing = hasResolved && ! record;

	const options = useSelect( ( select ) => {
		const forms = select( 'core' ).getEntityRecords(
			'postType',
			'formello_form',
			{
				per_page: -1,
			}
		);
		const opts = [
			{ value: '', label: __( 'Select a form', 'formello' ) },
		];

		forms?.forEach( ( post ) => {
			opts.push( {
				value: post.id,
				label: post.title.raw || __( 'No title', 'formello' ),
			} );
		} );

		return opts;
	}, [] );

	const { saveEntityRecord } = useDispatch( coreStore );
	const { setBlockEditingMode } = useDispatch( blockEditorStore );

	// Sync the editing mode of the pattern block with the inner blocks.
	useEffect( () => {
		setBlockEditMode(
			setBlockEditingMode,
			innerBlocks,
			// Disable editing if the pattern itself is disabled.
			editingMode === 'disabled'
		);
	}, [ editingMode, innerBlocks, setBlockEditingMode ] );

	const create = useCallback(
		async ( title = null ) => {
			const template = {
				title,
				content: `<!-- wp:formello/form {"lock":{"move":false,"remove":true}} -->
				<form method="post" class="wp-block-formello-form" novalidate>
				<input type="hidden" name="_formello_id"/>
				<input type="text" class="formello-hp" tabindex="-1"/>
				<input type="hidden" name="action" value="formello"/>
				</form>
				<!-- /wp:formello/form -->`,
				status: 'publish',
				excerpt: '',
			};

			return saveEntityRecord(
				'postType',
				'formello_form',
				template
			).then( ( response ) => {
				setAttributes( { ref: response.id } );
				setIsDisabled( true );
			} );
		},
		[ saveEntityRecord, setAttributes ]
	);

	const [ blocks ] = useEntityBlockEditor( 'postType', 'formello_form', {
		id: ref,
	} );

	const blockProps = useBlockProps( {
		className: 'block-library-block__reusable-block-container',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		value: blocks,
		onInput: NOOP,
		onChange: NOOP,
		editingMode: 'disabled',
		allowedBlocks: [ 'formello/form' ],
		renderAppender: blocks?.length
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	if ( hasAlreadyRendered ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __( 'Block cannot be rendered inside itself.' ) }
				</Warning>
			</div>
		);
	}

	if ( ! ref || isMissing ) {
		return (
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody
						title={ __( 'Form Settings', 'formello' ) }
						initialOpen={ true }
					>
						<SelectControl
							label={ __( 'Choose a form', 'formello' ) }
							options={ options }
							onChange={ ( val ) => {
								setAttributes( { ref: parseInt( val ) } );
							} }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</PanelBody>
				</InspectorControls>
				<Placeholder
					instructions={ __(
						'Insert from library or create a new form.',
						'formello'
					) }
					label={ __( 'Insert a form', 'formello' ) }
				>
					{ 'widgets' === window.pagenow ? (
						<SelectControl
							label={ __( 'Choose a form', 'formello' ) }
							value={ ref }
							options={ options }
							onChange={ ( val ) => {
								setAttributes( { ref: parseInt( val ) } );
							} }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) : (
						<Fragment>
							<Button
								isPrimary
								icon={ 'book' }
								onClick={ () => {
									setModalOpen( 'templates' );
								} }
							>
								{ __( 'Open Library', 'formello' ) }
							</Button>
							<Button
								variant="secondary"
								onClick={ () => {
									setModalOpen( 'create' );
								} }
							>
								{ __( 'Create a new form', 'formello' ) }
							</Button>
						</Fragment>
					) }
				</Placeholder>
				{ 'create' === isModalOpen && (
					<Modal
						title={ __( 'Create Reusable form' ) }
						onRequestClose={ () => {
							setModalOpen( false );
							createTitle( '' );
						} }
						overlayClassName="reusable-blocks-menu-items__convert-modal"
					>
						<form
							onSubmit={ ( event ) => {
								event.preventDefault();
								create( titleTemp );
								setModalOpen( false );
								createTitle( '' );
							} }
						>
							<VStack spacing="5">
								<TextControl
									__nextHasNoMarginBottom
									label={ __( 'Name' ) }
									value={ titleTemp }
									onChange={ createTitle }
								/>
								<HStack justify="right">
									<Button
										variant="tertiary"
										onClick={ () => {
											setModalOpen( false );
											createTitle( '' );
										} }
									>
										{ __( 'Cancel' ) }
									</Button>

									<Button variant="primary" type="submit">
										{ __( 'Save' ) }
									</Button>
								</HStack>
							</VStack>
						</form>
					</Modal>
				) }
				{ 'templates' === isModalOpen && (
					<TemplatesModal
						clientId={ clientId }
						onRequestClose={ () => setModalOpen( false ) }
						blockName={ name }
					/>
				) }
			</div>
		);
	}

	if ( isMissing ) {
		return (
			<div { ...blockProps }>
				<Warning
					actions={ [
						<Button
							variant="primary"
							onClick={ () => setAttributes( { ref: '' } ) }
							key="create-new"
						>
							{ __( 'Create a new form' ) }
						</Button>,
					] }
				>
					{ __( 'Block has been deleted or is unavailable.' ) }
				</Warning>
			</div>
		);
	}

	if ( ! hasResolved ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	return (
		<RecursionProvider uniqueId={ ref }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton onClick={ handleEditOriginal }>
						{ __( 'Edit form', 'formello' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Form Settings', 'formello' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Choose a form', 'formello' ) }
						value={ ref }
						options={ options }
						onChange={ ( val ) => {
							setAttributes( { ref: parseInt( val ) } );
						} }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</RecursionProvider>
	);
}
