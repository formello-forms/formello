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
	Disabled,
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

import { useState, useCallback, Fragment } from '@wordpress/element';
import { TemplatesModal } from '../form/edit/templates-modal';

export default function ReusableBlockEdit( {
	attributes: { ref },
	clientId,
	name,
	setAttributes,
} ) {
	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ isDisabled, setIsDisabled ] = useState( true );
	const [ titleTemp, createTitle ] = useState( '' );

	const { onNavigateToEntityRecord } = useSelect(
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
			postType: 'formello',
		} );
	};

	const hasAlreadyRendered = useHasRecursion( ref );
	const { record, hasResolved } = useEntityRecord(
		'postType',
		'formello',
		ref
	);

	const isMissing = hasResolved && ! record;

	const options = useSelect( ( select ) => {
		const forms = select( 'core' ).getEntityRecords(
			'postType',
			'formello',
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

	const create = useCallback(
		async ( title = null ) => {
			const template = {
				title,
				content: `<!-- wp:formello/form {"lock":{"move":false,"remove":true}} -->
				<form class="wp-block-formello-form" method="post" data-id="11" data-validate="true" novalidate action=""><input type="hidden" name="_formello_id" value="11"/><input type="text" name="_formello_h11" class="formello-hp" tabindex="-1"/><input type="hidden" name="action" value="formello"/><div class="formello-message" id="formello-message-11"></div></form>
				<!-- /wp:formello/form -->`,
				status: 'publish',
				excerpt: '',
			};

			return saveEntityRecord( 'postType', 'formello', template ).then(
				( response ) => {
					setAttributes( { ref: response.id } );
					setIsDisabled( true );
				}
			);
		},
		[ saveEntityRecord, setAttributes ]
	);

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'formello',
		{ id: ref }
	);

	const blockProps = useBlockProps( {
		className: 'block-library-block__reusable-block-container',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		value: blocks,
		onInput,
		onChange,
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
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Disabled isDisabled={ isDisabled }>
					<div { ...innerBlocksProps } />
				</Disabled>
			</div>
		</RecursionProvider>
	);
}
