/**
 * Import CSS
 */
//import './editor.scss';

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
	useSelect
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

export function TemplatesModal ( props ) {

	const {
		insertTemplate,
		getTemplateData,
		onRequestClose,
		clientId,
	} = props;

	const [ loading, setLoading ] = useState( false )
	const [ error, setError ] = useState( false )

	const allTemplates = true;
	const showLoadingSpinner = loading || ! allTemplates;
    const templates = useSelect(
        ( select ) => select( 'formello/templates' ).getTemplates(),
        []
    );

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
	}

	const localTemplates = getTemplates( 'local' );

	return (
		<Modal
			title={ __( 'Forms', 'formello' ) }
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
			<Fragment>
			{ localTemplates && localTemplates.length && 
				<ul className="formello-plugin-templates-list">
					{ localTemplates.map( ( template ) => {
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
										onRequestClose( template.id );
										setLoading( false );
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
			}
			</Fragment>
		</Modal>
	);
}