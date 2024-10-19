import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import { Logo } from '../../icons/icons';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {
	icon: Logo,

	edit,
} );
