import { useEffect, useRef } from '@wordpress/element';

export default function ClassicEdit( props ) {
	const { id, onChange, action } = props;

	const didMount = useRef( false );

	useEffect( () => {
		if ( ! didMount.current ) {
			return;
		}

		const editor = window.tinymce.get( id );
		const currentContent = editor?.getContent();

		if ( currentContent !== action.message ) {
			editor.setContent( action.message || '' );
		}
	}, [ action.message ] );

	console.log( 'TINYMCE', action.subject );
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
					editor.on( 'keydown', () => {
						//onChange( 'message', editor.getContent() );
					} );
					editor.on( 'blur', () => {
						onChange( editor.getContent() );
					} );
					/*editor.on( 'loadContent', () =>
						editor.setContent( action.message )
					);*/
				},
			},
		} );

		return () => {
			wp.oldEditor.remove( id );
		};
	}, [] );

	return <div id={ id } />;
}
