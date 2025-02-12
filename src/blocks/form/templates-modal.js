/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
	BlockContextProvider,
} from '@wordpress/block-editor';
import {
	Modal,
	SearchControl,
	Button,
	__experimentalConfirmDialog as ConfirmDialog,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { parse } from '@wordpress/blocks';

function PatternCategoriesList( {
	selectedCategory,
	patternCategories,
	onClickCategory,
} ) {
	const baseClassName = 'block-editor-block-patterns-explorer__sidebar';
	return (
		<div className={ `${ baseClassName }__categories-list` }>
			{ [ ...new Set( patternCategories ) ].map( ( category ) => {
				return (
					<Button
						key={ category.slug }
						label={ category.name }
						className={ `${ baseClassName }__categories-list__item` }
						isPressed={ selectedCategory === category.slug }
						onClick={ () => {
							onClickCategory( category.slug );
						} }
					>
						{ category.name }
					</Button>
				);
			} ) }
		</div>
	);
}

function PatternsExplorerSearch( { searchValue, setSearchValue } ) {
	const baseClassName = 'block-editor-block-patterns-explorer__search';
	return (
		<div className={ baseClassName }>
			<SearchControl
				__nextHasNoMarginBottom
				onChange={ setSearchValue }
				value={ searchValue }
				label={ __( 'Search for patterns' ) }
				placeholder={ __( 'Search' ) }
			/>
		</div>
	);
}

function PatternExplorerSidebar( {
	selectedCategory,
	patternCategories,
	onClickCategory,
	searchValue,
	setSearchValue,
	blockName,
} ) {
	const baseClassName = 'block-editor-block-patterns-explorer__sidebar';
	return (
		<div className={ baseClassName }>
			<PatternsExplorerSearch
				searchValue={ searchValue }
				setSearchValue={ setSearchValue }
			/>
			{ ! searchValue && 'formello/form' === blockName && (
				<PatternCategoriesList
					selectedCategory={ selectedCategory }
					patternCategories={ patternCategories }
					onClickCategory={ onClickCategory }
				/>
			) }
		</div>
	);
}

export function TemplatesModal( { clientId, blockName, onRequestClose } ) {
	const [ showConfirmDialog, setShowConfirmDialog ] = useState( false );
	const [ searchValue, setSearchValue ] = useState();
	const [ selectedCategory, setSelectedCategory ] = useState( 'all' );

	const patterns = useSelect(
		( select ) => {
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );
			return getPatternsByBlockTypes( blockName, rootClientId );
		},
		[ clientId, blockName ]
	);
	console.log( blockName );
	const { replaceBlock } = useDispatch( blockEditorStore );
	const onBlockPatternSelect = ( pattern ) => {
		if ( pattern.isPro ) {
			setShowConfirmDialog( true );
		} else {
			replaceBlock( clientId, pattern.blocks );
		}
	};

	const shownPatterns = patterns.filter( ( p ) => {
		if ( searchValue ) {
			return p.title.toLowerCase().includes( searchValue );
		}
		if ( 'all' === selectedCategory ) {
			return true;
		}
		return p.categories.includes( selectedCategory );
	} );

	const patternCategories = [
		{
			slug: 'all',
			name: __( 'All', 'formello' ),
		},
		{
			slug: 'contact',
			name: __( 'Contact', 'formello' ),
		},
		{
			slug: 'leads',
			name: __( 'Top bar', 'formello' ),
		},
		{
			slug: 'question',
			name: __( 'Ad Block', 'formello' ),
		},
		{
			slug: 'login',
			name: __( 'Login', 'formello' ),
		},
	];

	return (
		<Modal
			className="block-editor-query-pattern__selection-modal"
			isFullScreen
			title={ __( 'Choose a form', 'formello' ) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ onRequestClose }
		>
			<div className="block-editor-block-patterns-explorer">
				<PatternExplorerSidebar
					selectedCategory={ selectedCategory }
					patternCategories={ patternCategories }
					onClickCategory={ setSelectedCategory }
					searchValue={ searchValue }
					setSearchValue={ setSearchValue }
					blockName={ blockName }
				/>
				<div className="block-editor-block-patterns-explorer__list">
					<BlockContextProvider
						value={ { postType: 'formello_form' } }
					>
						<ConfirmDialog
							isOpen={ showConfirmDialog }
							onConfirm={ () => console.log( 'CONFIRM' ) }
							onCancel={ () => setShowConfirmDialog( false ) }
						>
							CIAO STRONZO
						</ConfirmDialog>

						{ patterns.length ? (
							<BlockPatternsList
								blockPatterns={ shownPatterns }
								shownPatterns={ shownPatterns }
								onClickPattern={ onBlockPatternSelect }
							/>
						) : (
							<Spinner />
						) }
					</BlockContextProvider>
				</div>
			</div>
		</Modal>
	);
}
