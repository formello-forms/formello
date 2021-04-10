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
	Button
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import RulesList from "./rules";

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
	const [ rules, setRules ] = useState( metaFieldValue );

	function updateMetaValue( newValue ) {
		setMeta( { ...meta, 'stocazzo': newValue } );
	}

	const addNewRow = (e) => {
		setRules( [
				...rules,
				{ name: 'Rule ', where: '', condition: '', operator: 'is', selectedPosts: [] }
			]
		)
	}

	const handleChange = ( value, index, prop ) => {
		// 1. Make a shallow copy of the items
		let items = [...rules];
		// 2. Make a shallow copy of the item you want to mutate
		let item = {...rules[index]};
		// 3. Replace the property you're intested in
		item[prop] = value;
		// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		items[index] = item;
		// 5. Set the state to our new copy
		setRules( items );
		updateMetaValue( items );
	}

	const deleteRow = (record, index) => {
		let items = [...rules]; // make a separate copy of the array
		items.splice(index, 1);
		setRules( items );
		updateMetaValue( items );
	}

    return (
	    <PluginDocumentSettingPanel
	        title={ 'Position' }
	        icon={ () => '' }
	    >
	    	<TextControl
	    		label={ 'Show' }
				value={ metaFieldValue }
				onChange={ (val) => console.log(val) }
	    	/>
			<RulesList 
				add={ addNewRow.bind(this) }
				delete={ deleteRow }
				onChange={ handleChange }
				options={ rules }
			/>
			<Button 
				isSmall 
				isPrimary
				onClick={ addNewRow }
			>Add new</Button>

	    </PluginDocumentSettingPanel>

    );
  },
});