/**
 * Import CSS
 */
import './editor.scss';

/**
 * External dependencies
 */
import Masonry from 'react-masonry-component';
import classnames from 'classnames';
import LazyLoad from 'react-lazyload';

/**
 * WordPress dependencies
 */
import {
	Fragment,
	RawHTML,
	useState,
} from '@wordpress/element';

import {
	__,
	sprintf,
} from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import {
	compose,
} from '@wordpress/compose';

import {
	decodeEntities,
} from '@wordpress/html-entities';

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';

import {
	parse,
} from '@wordpress/blocks';

import {
	TabPanel,
	Spinner,
	SelectControl,
	Modal,
} from '@wordpress/components';
import { BlockPreview } from '@wordpress/block-editor';

function TemplatesModal ( props ) {

	const {
		insertTemplate,
		getTemplateData,
		onRequestClose,
		clientId,
		templates = false,
	} = props;

	const [ loading, setLoading ] = useState( false )
	const [ activeCategory, setActiveCategory ] = useState( {} )
	const [ error, setError ] = useState( false )

	const getSelectedCategory = ( type ) => {
		return activeCategory[ type ] || false;
	}

	const printCategorySelect = ( type ) => {
		const templates = getTemplates( type, '' );
		const categories = {};
		const selectData = [];

		templates.forEach( ( template ) => {
			if ( template.categories && template.categories.length ) {
				template.categories.forEach( ( catData ) => {
					if ( ! categories[ catData.slug ] ) {
						categories[ catData.slug ] = true;
						selectData.push( {
							value: catData.slug,
							label: catData.name,
						} );
					}
				} );
			}
		} );

		if ( selectData.length ) {
			selectData.unshift( {
				value: '',
				label: __( 'Select Category', 'formello' ),
			} );

			return (
				<SelectControl
					value={ getSelectedCategory( type ) }
					options={ selectData }
					onChange={ ( value ) => {
						setState( {
							activeCategory: {
								...activeCategory,
								...{
									[ type ]: value,
								},
							},
						} );
					} }
				/>
			);
		}

		return null;
	}

	const getTemplates = ( type, categorySelected = null ) => {

		if ( ! templates ) {
			return templates;
		}

		const result = [];

		categorySelected = null === categorySelected ? getSelectedCategory( type ) : '';

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

			// category check.
			if ( allow && categorySelected && template.categories ) {
				let categoryAllow = false;

				template.categories.forEach( ( catData ) => {
					if ( catData.slug && categorySelected === catData.slug ) {
						categoryAllow = true;
					}
				} );
				allow = categoryAllow;
			}

			if ( allow ) {
				result.push( template );
			}
		} );

		return result;
	}

	const allTemplates = getTemplates();
	const showLoadingSpinner = loading || ! allTemplates;

	return (
		<Modal
			title={ __( 'Templates', 'formello' ) }
			className={ classnames(
				'formello-plugin-templates-modal',
				'formello-plugin-templates-modal-hide-header',
				showLoadingSpinner ? 'formello-plugin-templates-modal-loading' : ''
			) }
			position="top"
			size="lg"
			onRequestClose={ onRequestClose }
		>

			{ showLoadingSpinner &&
				<div className="formello-plugin-templates-modal-loading-spinner"><Spinner /></div>
			}

			{ allTemplates &&
				<TabPanel
					className="formello-component-modal-tab-panel"
					tabs={ [
						{
							name: 'remote',
							title: (
								<span>
									{ __( 'Templates', 'formello' ) }
								</span>
							),
							className: 'formello-control-tabs-tab',
						},
						{
							name: 'local',
							title: (
								<span>
									{ __( 'Local Forms', 'formello' ) }
								</span>
							),
							className: 'formello-control-tabs-tab',
						},
					] }
				>
					{
						( tabData ) => {
							const tabType = tabData.name;
							const currentTemplates = getTemplates( tabType );
							const selectedCategory = getSelectedCategory( tabType );

							return (
								<Fragment>
									{ currentTemplates === false &&
										<div className="formello-plugin-templates-spinner"><Spinner /></div>
									}

									{ currentTemplates && ! currentTemplates.length &&
										<div>
											{ 'local' === tabType ? (
												<Fragment>
													<p>{ __( 'No templates found.', 'formello' ) }</p>
													<a className="components-button is-button is-primary" href={ formello.templatesURL } target="_blank" rel="noopener noreferrer">{ __( 'Add New', 'formello' ) }</a>
												</Fragment>
											) : (
												<p>{ __( 'No templates found.', 'formello' ) }</p>
											) }
										</div>
									}

									{ !! currentTemplates && !! currentTemplates.length &&
										<Fragment key={ `${ tabType }-${ selectedCategory }` }>
											<div className="formello-plugin-templates-categories-row">
												<div className="formello-plugin-templates-categories-select">
													{ printCategorySelect( tabType ) }</div>
												<div className="formello-plugin-templates-count">
													<RawHTML>
														{ sprintf(
															/* translators: Number of templates. */
															__( 'Templates: %s', 'formello' ),
															`<strong>${ currentTemplates.length }</strong>` )
														}
													</RawHTML>
												</div>
											</div>
											{ error }
											<ul className="formello-plugin-templates-list">
												{ currentTemplates.map( ( template ) => {
													const withPreview = !! template.content;
													const templateTitle = decodeEntities( template.title );

													return (
														<li
															className={ classnames( 'formello-plugin-templates-list-item', 'formello-plugin-templates-list-item-no-thumb' ) }
															key={ template.id }
														>
															<a
																onClick={ () => {
																	setLoading( true );
																	if ( template.content ) {
																		insertTemplate( template.content, clientId, ( errorResponse ) => {
																			if ( errorResponse ) {
																				setError( errorResponse );
																			} else {
																				onRequestClose();
																			}
																		} );
																	}
																	setLoading( true );

																} }
															>
																{ withPreview &&
																	<BlockPreview
																		blocks={ parse( template.content ) }
																	/>
																}
																<div className="formello-plugin-templates-list-item-title">{ templateTitle }</div>
															</a>
														</li>
													);
												} ) }
											</ul>

											{ 'local' === tabType &&
												<Fragment>
													<a className="components-button is-button is-primary" href={ formello.templatesURL } target="_blank" rel="noopener noreferrer">{ __( 'Add New', 'formello' ) }</a>
												</Fragment>
											}
										</Fragment>
									}
								</Fragment>
							);
						}
					}
				</TabPanel>
			}
		</Modal>
	);
}

const TemplatesModalWithSelect = compose( [
	withDispatch( ( dispatch ) => {
		const {
			replaceBlocks,
		} = dispatch( 'core/block-editor' );

		return {
			insertTemplate( content, clientId, cb ) {
				const parsedBlocks = parse( content );

				// remove the id attribute
				parsedBlocks[0].attributes.id = undefined

				if ( parsedBlocks.length ) {
					replaceBlocks( clientId, parsedBlocks );

					cb( false );
				}
			},
		};
	} ),
	withSelect( ( select ) => {
		const templates = select( 'formello/templates' ).getTemplates();

		return {
			templates,
			getTemplateData( data, cb ) {
				console.log(cb)
				let type = data.type;

				if ( 'local' !== type ) {
					type = 'remote';
				}

				apiFetch( {
					path: `/formello/v1/get_template_data/?id=${ data.id }&type=${ type }`,
					method: 'GET',
				} ).then( ( result ) => {
					cb( result );
				} );
			},
		};
	} ),
] )( TemplatesModal );

export { TemplatesModalWithSelect as TemplatesModal };
