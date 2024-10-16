/**
 * WordPress dependencies
 */
import { useSelect, useDispatch, dispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { Modal, SearchControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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

export function TemplatesModal( { clientId, blockName, onRequestClose } ) {
	const { replaceBlock } = useDispatch( blockEditorStore );
	const onBlockPatternSelect = ( pattern ) => {
		replaceBlock( clientId, pattern.blocks );
	};

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
			name: __( 'All', 'popper' ),
		},
		{
			slug: 'promo',
			name: __( 'Promo', 'popper' ),
		},
		{
			slug: 'top-bar',
			name: __( 'Top bar', 'popper' ),
		},
		{
			slug: 'ad-block',
			name: __( 'Ad Block', 'popper' ),
		},
	];

	const patternCategories2 = patterns
		.map( ( p ) => {
			return p.categories;
		} )
		.join( ',' )
		.split( ',' );

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
				/>
				<div className="block-editor-block-patterns-explorer__list">
					<BlockContextProvider value={ { postType: 'formello' } }>
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
