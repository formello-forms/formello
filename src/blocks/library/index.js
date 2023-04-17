import {
	Form,
} from '../../icons/icons';
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata, {
	icon: Form,

	edit,

	save: () => {
		return null;
	},
} );
