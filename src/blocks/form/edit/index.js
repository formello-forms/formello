import { useEffect, useContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useEntityProp,
} from '@wordpress/core-data';

import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

import BlockVariationPicker from './variation-picker';

import {
	Disabled,
} from '@wordpress/components';

import Edit from './edit';

const FormEdit = ( props ) => {
	const { clientId, attributes, setAttributes } = props;

	const isDisabled = useContext( Disabled.Context );

	const { wasBlockJustInserted, postType, postId } = useSelect( ( select ) => {
		const { wasBlockJustInserted } = select(
			blockEditorStore
		);

		return {
			wasBlockJustInserted: wasBlockJustInserted(
				clientId,
			),
			postType: select( 'core/editor' ).getCurrentPostType(),
			postId: select( 'core/editor' ).getCurrentPostId(),
		};
	} );

	useEffect( () => {

		// if is a formello_form CPT always set id eq post_id
		if (
			Number( attributes.id ) !== postId && 'formello_form' === postType && ! isDisabled
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

	const Component = hasInnerBlocks ? Edit : BlockVariationPicker;

	return <Component { ...props } />;
};

export default FormEdit;
