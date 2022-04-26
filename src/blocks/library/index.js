import getIcon from '../../utils/get-icon';
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata, {
	icon: getIcon( 'form' ),

	edit,

	save: () => {
		return null;
	},
} );
