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

import useCreateForm from '../hooks/use-create-form';

import Edit from './edit';

const FormEdit = ( props ) => {
	const { clientId, attributes, setAttributes } = props;

	const isDisabled = useContext( Disabled.Context );
	const [ status, setStatus ] = useEntityProp( 'postType', 'formello_form', 'status', attributes.id );

	const {
		create: createForm,
		status: createFormStatus,
		error: createFormError,
		value: createFormPost,
		isPending: isCreatingNavigationMenu,
		isSuccess: createFormIsSuccess,
		isError: createFormIsError,
	} = useCreateForm();

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
		if ( 'formello_form' !== postType && ! isDisabled ) {
			// if block is just inserted we need to provide a new id reference
			if ( ! Number( attributes.id ) || wasBlockJustInserted ) {
				createForm( 'Form-' + postId )
					.then( ( res ) => setAttributes( { id: res.id } ) );
			}
		}

		// if is a formello_form CPT always set id eq post_id
		if (
			Number( attributes.id ) !== postId && 'formello_form' === postType && ! isDisabled
		) {
			setAttributes( {
				id: postId,
			} );
			setStatus( 'formello-private' );
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
