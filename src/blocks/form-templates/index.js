/**
 * Block: Template Library
 */

import edit from './edit';
import getIcon from '../../utils/get-icon';

import {
	__,
} from '@wordpress/i18n';

import {
	registerBlockType,
} from '@wordpress/blocks';

/**
 * Register our Grid block.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'formello/template-library', {
	title: __( 'Template Library', 'formello' ),
	icon: getIcon( 'form' ),
	category: 'formello',
	keywords: [
		__( 'template' ),
		__( 'library' ),
		__( 'formello' ),
	],
	edit,
	save: () => {
		return null;
	},
} );

import includes from "lodash/includes";

import { useSelect, select } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
const { PluginDocumentSettingPanel } = wp.editPost;
import { useEntityProp } from '@wordpress/core-data';
import {
	TextControl,
} from '@wordpress/components';

registerPlugin('formello-settings-panel', {
  render() {
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);

    if ( !includes(['formello_form'], postType) ) {
		return null;
    }

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta'
	);
	const metaFieldValue = meta['stocazzo'];
	function updateMetaValue( newValue ) {
		setMeta( { ...meta, 'stocazzo': newValue } );
	}

    return (
	    <PluginDocumentSettingPanel
	        title={ 'Position' }
	        icon={ () => '' }
	    >
	    	<TextControl
	    		label={ 'Show' }
				value={ metaFieldValue }
				onChange={ updateMetaValue }
	    	/>
	    </PluginDocumentSettingPanel>

    );
  },
});