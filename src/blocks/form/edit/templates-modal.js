/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import {
	BlockContextProvider,
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
} from '@wordpress/block-editor';
import { Modal, SearchControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

function PatternCategoriesList( {
	selectedCategory,
	patternCategories,
	onClickCategory,
} ) {
	const baseClassName = 'block-editor-block-patterns-explorer__sidebar';
	return (
		<div className={ `${ baseClassName }__categories-list` }>
			{ [ ...new Set( patternCategories ) ].map( ( name ) => {
				return (
					<Button
						key={ name }
						label={ name }
						className={ `${ baseClassName }__categories-list__item` }
						isPressed={ selectedCategory === name }
						onClick={ () => {
							onClickCategory( name );
						} }
					>
						{ name }
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
} ) {
	const baseClassName = 'block-editor-block-patterns-explorer__sidebar';
	return (
		<div className={ baseClassName }>
			<PatternsExplorerSearch
				searchValue={ searchValue }
				setSearchValue={ setSearchValue }
			/>
			{ ! searchValue && (
				<PatternCategoriesList
					selectedCategory={ selectedCategory }
					patternCategories={ patternCategories }
					onClickCategory={ onClickCategory }
				/>
			) }
		</div>
	);
}

function TemplatesModal( {
	clientId,
	blockName,
	setIsPatternSelectionModalOpen,
} ) {
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch( blockEditorStore );

	const [ searchValue, setSearchValue ] = useState( '' );
	const [ selectedCategory, setSelectedCategory ] = useState( 'all' );

	const onBlockPatternSelect = ( pattern ) => {
		if ( 'formello/library' === blockName ) {
			updateBlockAttributes( clientId, {
				ref: parseInt( pattern.blocks[ 0 ].attributes.id ),
			} );
			setIsPatternSelectionModalOpen( false );
		} else {
			replaceInnerBlocks( clientId, pattern.blocks[ 0 ].innerBlocks );
			setIsPatternSelectionModalOpen( false );
		}
	};

	const patterns = useSelect(
		( select ) => {
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );
			return getPatternsByBlockTypes( blockName, rootClientId );
		},
		[ clientId, blockName ]
	);

	const patternCategories = patterns
		.map( ( p ) => {
			return p.formello_categories;
		} )
		.join( ',' )
		.split( ',' );

	const shownPatterns = patterns.filter( ( p ) => {
		if ( searchValue ) {
			return p.title.toLowerCase().includes( searchValue );
		}
		if ( 'all' === selectedCategory ) {
			return true;
		}
		return p.formello_categories.includes( selectedCategory );
	} );

	return (
		<Modal
			isFullScreen
			title={ __( 'Choose a pattern' ) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
		>
			<div className="block-editor-block-patterns-explorer">
				<PatternExplorerSidebar
					selectedCategory={ selectedCategory }
					patternCategories={ patternCategories }
					onClickCategory={ setSelectedCategory }
					searchValue={ searchValue }
					setSearchValue={ setSearchValue }
				/>
				<div className="block-editor-block-patterns-explorer__list">
					<BlockContextProvider
						value={ { postType: 'formello_form' } }
					>
						<BlockPatternsList
							blockPatterns={ shownPatterns }
							shownPatterns={ shownPatterns }
							onClickPattern={ onBlockPatternSelect }
						/>
					</BlockContextProvider>
				</div>
			</div>
		</Modal>
	);
}

export default TemplatesModal;
