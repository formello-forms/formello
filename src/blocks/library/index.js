import getIcon from '../../utils/get-icon';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata, {
  	icon: getIcon('form'),

  	edit: edit,

	save: ( props ) => {
		return null
	}
})