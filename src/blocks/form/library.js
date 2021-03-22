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
					className="formello-control-tabs formello-component-modal-tab-panel"
					tabs={ [
						{
							name: 'local',
							title: (
								<span>
									{ __( 'Local Forms', 'formello' ) }
								</span>
							),
							className: 'formello-control-tabs-tab',
						},
						{
							name: 'blocks',
							title: (
								<span>
									{ __( 'Blocks', 'formello' ) }
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
													<p style={ {
														marginTop: 0,
													} }>{ __( 'No templates found.', 'formello' ) }</p>
													<a className="components-button is-button is-primary" href={ formello.templatesURL } target="_blank" rel="noopener noreferrer">{ __( 'Add New', 'formello' ) }</a>
												</Fragment>
											) : (
												__( 'No templates found.', 'formello' )
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
											<Masonry
												className="formello-plugin-templates-list"
												elementType="ul"
												disableImagesLoaded={ false }
												updateOnEachImageLoad={ true }
												options={ {
													transitionDuration: 0,
												} }
											>
												{ currentTemplates.map( ( template ) => {
													const withThumb = !! template.thumbnail;
													const templateTitle = decodeEntities( template.title );

													let thumbAspectRatio = false;

													if ( template.thumbnail_height && template.thumbnail_width ) {
														thumbAspectRatio = template.thumbnail_height / template.thumbnail_width;
													}

													return (
														<li
															className={ classnames( 'formello-plugin-templates-list-item', withThumb ? '' : 'formello-plugin-templates-list-item-no-thumb' ) }
															key={ template.id }
														>
															<button
																onClick={ () => {
																	setLoading( true );
																	getTemplateData( {
																		id: template.id,
																		type: tabType,
																	}, ( data ) => {
																		if ( data && data.success && data.response && data.response.content ) {
																			insertTemplate( data.response.content, clientId, ( errorResponse ) => {
																				if ( errorResponse ) {
																					setError( errorResponse );
																				} else {
																					onRequestClose();
																				}
																			} );
																		}
																		setLoading( true );
																	} );
																} }
															>
																{ withThumb &&
																	<div className="formello-plugin-templates-list-item-image">
																		{ thumbAspectRatio &&
																			<div
																				className="formello-plugin-templates-list-item-image-sizer"
																				style={ { paddingTop: `${ 100 * thumbAspectRatio }%` } }
																			/>
																		}

																		<LazyLoad overflow once>
																			<img
																				src={ template.thumbnail }
																				alt={ template.title }
																			/>
																		</LazyLoad>
																	</div>
																}
																<div className="formello-plugin-templates-list-item-title">{ templateTitle }</div>
															</button>
														</li>
													);
												} ) }
											</Masonry>

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
