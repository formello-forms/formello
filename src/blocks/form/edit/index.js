import { useEffect, useContext, useCallback } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import BlockVariationPicker from './variation-picker';

import { Disabled } from '@wordpress/components';
import Edit from './edit';
import FormPreview from './preview';

const FormEdit = ( props ) => {
	const { clientId, attributes, setAttributes } = props;

	const isDisabled = useContext( Disabled.Context );
	const { replaceBlock } = dispatch( blockEditorStore );

	const { postType, postId } = useSelect( ( select ) => {
		return {
			postType: select( 'core/editor' )?.getCurrentPostType(),
			postId: select( 'core/editor' )?.getCurrentPostId(),
		};
	} );

	useEffect( () => {
		if (
			'formello' !== postType &&
			Number( attributes.id ) &&
			! isDisabled
		) {
			replaceBlock(
				clientId,
				createBlock( 'formello/library', {
					ref: parseInt( attributes.id ),
				} )
			);
		}

		// if is a formello CPT always set id eq post_id
		if ( Number( attributes.id ) !== postId && 'formello' === postType ) {
			setAttributes( {
				id: postId,
			} );
		}
	}, [] );

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);

	const Component = hasInnerBlocks ? Edit : BlockVariationPicker;

	return <Component { ...props } />;
};

export default FormEdit;
