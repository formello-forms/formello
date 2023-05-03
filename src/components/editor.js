import { useEffect } from '@wordpress/element';
import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function ClassicEdit( props ) {

	useEffect( () => {
		const { baseURL, suffix, settings } = window.wpEditorL10n.tinymce;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		window.wp.oldEditor.initialize( props.id, {
			tinymce: {
				...settings,
				setup( editor ) {
					editor.on( 'change', (val) => {
						props.onChange( 'message', editor.getContent() );
					} );
				},
			},
		} );

		return () => {
			window.wp.oldEditor.remove( props.id );
		};
	}, [] );

	return <textarea { ...props } />;
}
