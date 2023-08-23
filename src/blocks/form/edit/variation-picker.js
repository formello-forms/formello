/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
	Button, 
	Placeholder,
	Modal,
	Flex
} from '@wordpress/components';
import { layout } from '@wordpress/icons';
import TemplatesModal from './templates-modal.js';
import { useState } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
import {
	useBlockProps,
	__experimentalBlockPatternSetup as BlockPatternSetup,
} from '@wordpress/block-editor';
import {
	store as blocksStore,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

function BlockVariationPicker( props ) {
	const { clientId, setAttributes } = props;
	const [ isModalOpen, setModalOpen ] = useState( false );
	const { replaceInnerBlocks } = dispatch( 'core/block-editor' );

	const { getBlockVariations, getDefaultBlockVariation } =
		select( blocksStore );

	const variations = useSelect( () => {
		return getBlockVariations( 'formello/form', 'block' );
	}, [] );

	const defaultVariation = useSelect( () => {
		return typeof getDefaultBlockVariation === 'undefined'
			? null
			: getDefaultBlockVariation( props.name );
	}, [ name ] );

	const classes = classnames( 'block-editor-block-variation-picker', {
		'has-many-variations': variations.length > 4,
	} );

	const blockProps = useBlockProps( {
		className: classes,
	} );

	const onBlockPatternSelect = ( blocks ) => {
		replaceInnerBlocks( clientId, blocks[ 0 ].innerBlocks );
		setIsPatternSelectionModalOpen( false );
	};

	const onSelect = ( nextVariation = defaultVariation ) => {
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
	};

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ layout }
				label={ __( 'Choose variation' ) }
				instructions={ __( 'Select a form to start with.', 'formello' ) }
			>
				{ /*
				 * Disable reason: The `list` ARIA role is redundant but
				 * Safari+VoiceOver won't announce the list otherwise.
				 */
				/* eslint-disable jsx-a11y/no-redundant-roles */ }
				<ul
					className="block-editor-block-variation-picker__variations"
					role="list"
					aria-label={ __( 'Block variations', 'formello' ) }
				>
					{ variations.map( ( variation ) => (
						<li key={ variation.name }>
							<Button
								isSecondary
								icon={ variation.icon }
								iconSize={ 48 }
								onClick={ () => onSelect( variation ) }
								className="block-editor-block-variation-picker__variation"
								label={ variation.description || variation.title }
							/>
							<span
								className="block-editor-block-variation-picker__variation-label"
								role="presentation"
							>
								{ variation.title }
							</span>
						</li>
					) ) }
				</ul>

				<Flex justify={ 'start' }>
					<Button
						isPrimary
						icon={ 'book' }
						onClick={ () => {
							setModalOpen( 'templates' );
						} }
					>
						{ __( 'Open Library', 'formello' ) }
					</Button>
					<Button isLink onClick={ () => onSelect() }>
						{ __( 'Skip', 'formello' ) }
					</Button>
				</Flex>

				{ 'templates' === isModalOpen && (
					<TemplatesModal
						blockName={ props.name }
						setIsPatternSelectionModalOpen={ () => setModalOpen( false ) }
						clientId={ clientId }
					/>
				) }
			</Placeholder>
		</div>
	);
}

export default BlockVariationPicker;
