import { useEffect, useContext } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import BlockVariationPicker from './variation-picker';

import { Disabled } from '@wordpress/components';

import Edit from './edit';
import FormPreview from './preview';

const FormEdit = ( props ) => {
	const { clientId, attributes, setAttributes, children } = props;

	const isDisabled = useContext( Disabled.Context );
	const { replaceBlock } = dispatch( blockEditorStore );

	const { wasBlockJustInserted, postType, postId } = useSelect(
		( select ) => {
			const { wasBlockJustInserted } = select( blockEditorStore );

			return {
				wasBlockJustInserted: wasBlockJustInserted( clientId ),
				postType: select( 'core/editor' )?.getCurrentPostType(),
				postId: select( 'core/editor' )?.getCurrentPostId(),
			};
		}
	);

	useEffect( () => {
		if (
			'formello_form' !== postType &&
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

		// if is a formello_form CPT always set id eq post_id
		if (
			Number( attributes.id ) !== postId &&
			'formello_form' === postType &&
			! isDisabled
		) {
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

	if ( isDisabled && children ) {
		return <FormPreview { ...props } />;
	}

	const Component = hasInnerBlocks ? Edit : BlockVariationPicker;

	return <Component { ...props } />;
};

export default FormEdit;
