/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	useEntityBlockEditor,
	useEntityProp,
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
	__experimentalRecursionProvider as RecursionProvider,
	__experimentalUseHasRecursion as useHasRecursion,
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';

import { edit } from '@wordpress/icons';
import { useState, useCallback, Fragment } from '@wordpress/element';
import TemplatesModal from '../form/edit/templates-modal';

export default function ReusableBlockEdit( {
	attributes: { ref },
	clientId,
	setAttributes,
} ) {
	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ isDisabled, setIsDisabled ] = useState( true );
	const [ titleTemp, createTitle ] = useState( '' );

	const hasAlreadyRendered = useHasRecursion( ref );
	const { record, hasResolved } = useEntityRecord(
		'postType',
		'formello_form',
		ref
	);

	const isMissing = hasResolved && ! record;

	const options = useSelect(
		( select ) => {
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
		},
		[ clientId ]
	);

	const { saveEntityRecord } = useDispatch( coreStore );

	const create = useCallback(
		async (
			title = null,
			blocks = [],
			postStatus = 'formello-private'
		) => {
			const record = {
				title,
				content: `<!-- wp:formello/form {"lock":{"move":false,"remove":true},"className":""} -->
							<form class="wp-block-formello-form" method="post" data-id="2908" 
							data-validate="true" novalidate action="">
							<input type="hidden" name="_formello_id" value="2908"/>
							<input type="text" name="_formello_h2908" class="formello-hp" 
								autocomplete="nope" 
								aria-label="If you are human, leave this field blank." 
								tabindex="-1"/>
							<input type="hidden" name="action" value="formello"/>
							<div class="formello-message" id="formello-message-2908"></div></form>
							<!-- /wp:formello/form -->`,
				status: 'publish',
				excerpt: '',
			};

			// Return affords ability to await on this function directly
			return saveEntityRecord( 'postType', 'formello_form', record )
				.then( ( response ) => {
					setAttributes( { ref: response.id } );
					setIsDisabled( false );
				} )
				.catch( ( err ) => {
					console.log( err );
				} );
		},
		[ saveEntityRecord ]
	);

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'formello_form',
		{ id: ref }
	);
	const [ title, setTitle ] = useEntityProp(
		'postType',
		'formello_form',
		'title',
		ref
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
					{ 'widgets' === pagenow ? (
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
						blockName={ 'formello/library' }
						setIsPatternSelectionModalOpen={ () =>
							setModalOpen( false )
						}
						clientId={ clientId }
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
					<ToolbarButton
						onClick={ () => setIsDisabled( ! isDisabled ) }
						label={ __( 'Toggle form edit', 'formello' ) }
						icon={ edit }
						isPressed={ ! isDisabled }
						showTooltip
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Form Settings', 'formello' ) }
					initialOpen={ true }
				>
					{ ! isDisabled && (
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Name' ) }
							value={ title }
							onChange={ setTitle }
						/>
					) }
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
