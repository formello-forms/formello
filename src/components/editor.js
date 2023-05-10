import { useEffect } from '@wordpress/element';
import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function ClassicEdit( props ) {
	const { id, onChange } = props;

	useEffect( () => {
		const { baseURL, suffix, settings } = window.wpEditorL10n.tinymce;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		wp.oldEditor.initialize( id, {
			tinymce: {
				...settings,
				setup( editor ) {
					/*editor.on( 'blur', () => {
						onChange( editor.getContent() );
					} );*/
					//editor.on( 'loadContent', () => editor.setContent( props.value ) );
				},
			},
		} );

		return () => {
			wp.oldEditor.remove( id );
		};
	}, [] );

	return <textarea { ...props } />;
}
