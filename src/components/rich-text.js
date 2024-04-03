/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useRef } from '@wordpress/element';

const decodeHTMLEntities = ( value ) => {
	const textArea = document.createElement( 'textarea' );
	textArea.innerHTML = value;

	return textArea.value;
};

const RichTextEditor = ( {
	label,
	value,
	onChange,
	help = '',
	allowRawHTML = false,
	area = '',
} ) => {
	const instanceId = useInstanceId( RichTextEditor );

	const editorRef = useRef( null );

	const removeEditor = () => {
		if ( editorRef?.current?.id !== undefined ) {
			wp.oldEditor.remove( editorRef.current.id );
		}
	};

	useEffect( () => {
		const settings = {
			classic_block_editor: true, // eslint-disable-line camelcase
			plugins:
				'lists,media,paste,tabfocus,wordpress,wpautoresize,wpeditimage,wpgallery,wplink,wpdialogs,wptextpattern,wpview',
			toolbar1:
				'formatselect,bold,italic,bullist,numlist,alignleft,aligncenter,alignright,link,unlink,spellchecker,wp_add_media',
		};

		// Disable forced p tags if raw HTML is allowed.
		if ( allowRawHTML ) {
			settings.force_p_newlines = false; // eslint-disable-line camelcase
			settings.forced_root_block = ''; // eslint-disable-line camelcase
		}

		wp.oldEditor.initialize( editorRef.current.id, {
			tinymce: { ...settings },
		} );

		const editor = window.tinymce.get( editorRef.current.id );

		editor.on( 'change', () => {
			onChange(
				allowRawHTML
					? decodeHTMLEntities( editor.getContent() )
					: editor.getContent()
			);
		} );

		return removeEditor;
	}, [] );

	const id = `inspector-textarea-control-${ instanceId }-${ area }`;

	const onChangeValue = ( e ) => onChange( e.target.value );

	return (
		<BaseControl id={ id } label={ label } help={ help }>
			<textarea
				id={ id }
				className="components-textarea-control__input"
				rows={ 4 }
				value={ value }
				onChange={ onChangeValue }
				ref={ editorRef }
			/>
		</BaseControl>
	);
};

export default RichTextEditor;
