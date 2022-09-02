/**
 * Import CSS
 */
//import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Fragment, RawHTML, useState } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

import { decodeEntities } from '@wordpress/html-entities';

import { useDispatch, useSelect } from '@wordpress/data';

import { parse, cloneBlock } from '@wordpress/blocks';

import { Spinner, Modal } from '@wordpress/components';
import { BlockPreview } from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import './style.scss';

function BlockPattern( { isDraggable, pattern, onClick } ) {
	const { content } = pattern;
	const instanceId = useInstanceId( BlockPattern );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;

	return (

				<div
					className="block-editor-block-patterns-list__list-item"
					aria-label={ pattern.title }
					aria-describedby={
						pattern.description ? descriptionId : undefined
					}
				>
					<p>Stocazzo</p>
					<div
						role="option"
						className="block-editor-block-patterns-list__item"
						onClick={ () => onClick( content ) }
					>
						<BlockPreview
							blocks={ parse(content) }
						/>
						{ !! pattern.description && (
							<VisuallyHidden id={ descriptionId }>
								{ pattern.description }
							</VisuallyHidden>
						) }
					</div>
				</div>
	);
}

export function TemplatesModal( props ) {
	const { onRequestClose, type, clientId, name } = props;

	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( false );

	const templates = useSelect(
		( select ) => select( 'formello/templates' ).getTemplates(),
		[]
	);

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	const insertTemplate = ( content, clientId, cb ) => {
		const parsedBlocks = parse( content );

		if ( parsedBlocks.length ) {
			replaceInnerBlocks( clientId, parsedBlocks[ 0 ].innerBlocks );

			cb( false );
		}
	};

	const getTemplates = ( type ) => {
		if ( ! templates ) {
			return templates;
		}

		const result = [];

		templates.forEach( ( template ) => {
			let allow = ! type;

			// type check.
			if ( ! allow && template.types ) {
				template.types.forEach( ( typeData ) => {
					if ( typeData.slug && type === typeData.slug ) {
						allow = true;
					}
				} );
			}

			if ( allow ) {
				result.push( template );
			}
		} );

		return result;
	};

    const { patterns } = useSelect( select => {
        const { getSettings } = select( 'core/block-editor' );

       	return {
            patterns: getSettings().__experimentalBlockPatterns
        }
    } );

    const onBlockPatternSelect = (content) => {
    	console.log(content)
		const parsedBlocks = parse( content );

		if ( parsedBlocks.length ) {
			replaceInnerBlocks( clientId, parsedBlocks[ 0 ].innerBlocks );
			onRequestClose();
		}
	}

	const allTemplates = getTemplates( type );
	const showLoadingSpinner = loading || ! allTemplates;
console.log(allTemplates)
	return (
		<Modal
			title={ __( 'Forms', 'formello' ) }
			className={ classnames(
				'block-editor-query-pattern__selection-modal',
				'formello-templates-modal',
				'formello-templates-modal-hide-header',
				showLoadingSpinner ? 'formello-templates-modal-loading' : ''
			) }
			position="top"
			isFullScreen
			onRequestClose={ onRequestClose }
		>
			{ showLoadingSpinner && (
				<div className="formello-templates-modal-loading-spinner">
					<Spinner />
				</div>
			) }
			<Fragment>
				<div className="formello-templates-categories-row">
					<div className="formello-templates-count">
						<RawHTML>
							{ sprintf(
								/* translators: Number of templates. */
								__( 'Templates: %s', 'formello' ),
								`<strong>${
									allTemplates.length
										? allTemplates.length
										: 0
								}</strong>`
							) }
						</RawHTML>
					</div>
				</div>

				{ allTemplates && ! allTemplates.length && (
					<div>
						{ 'local' === type ? (
							<Fragment>
								<p>{ __( 'No templates found.', 'formello' ) }</p>
								<a
									className="components-button is-button is-primary"
									href={ formello.templatesURL }
									target="_blank"
									rel="noopener noreferrer"
								>
									{ __( 'Add New', 'formello' ) }
								</a>
							</Fragment>
						) : (
							<p>{ __( 'No templates found.', 'formello' ) }</p>
						) }
					</div>
				) }

					<div className="block-editor-block-pattern-setup view-mode-grid">
						<div className="block-editor-block-pattern-setup__grid">
							<div id="id-lc1bms" role="listbox" className="block-editor-block-pattern-setup__container" aria-label="Elenco dei pattern">
							{ allTemplates && allTemplates.map( ( template ) => {
								return (
									<BlockPattern
										key={ template.name }
										pattern={ template }
										onClick={ onBlockPatternSelect }
										isDraggable={ false }
									/>
								)
							} ) }
							</div>
						</div>
					</div>
			</Fragment>
		</Modal>
	);
}
