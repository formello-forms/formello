/**
 * WordPress dependencies
 */
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

const MAXIMUM_SELECTED_BLOCKS = 6;

const transforms = {
	ungroup: ( attributes, innerBlocks ) => {
		return innerBlocks
		innerBlocks.flatMap( ( innerBlock ) => innerBlock.innerBlocks );
	},
};

export default transforms;
