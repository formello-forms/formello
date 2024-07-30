import { useInstanceId } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

const sanitizedName = ( content ) => {
	return (
		content
			// Convert anything that's not a letter or number to a hyphen.
			.replace( /[^\p{L}\p{N}]+/gu, '_' )
			// Convert to lowercase
			.toLowerCase()
			// Remove any remaining leading or trailing hyphens.
			.replace( /(^-+)|(-+$)/g, '' )
	);
};

export function useInputId( Input, props ) {
	const { attributes, setAttributes } = props;
	const { type, label, name, id } = attributes;
	const instanceId = useInstanceId( Input );
	const { postId } = useSelect( ( select ) => {
		return {
			postId: select( 'core/editor' ).getCurrentPostId(),
		};
	}, [] );

	const idx = 'field_' + postId + '-' + type + '-' + instanceId;

	useEffect( () => {
		if ( ! id || ! id === idx ) {
			setAttributes( {
				id: idx,
			} );
		}
		if ( ! name ) {
			setAttributes( {
				name: label.length ? sanitizedName( label ) : idx,
			} );
		}
	} );

	return idx;
}
