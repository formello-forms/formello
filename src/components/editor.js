import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useEffect } from '@wordpress/element';

 export default function ClassicEdit(props) {

 	const { initialValue, save } = props;

	const editorRef = useRef(null);

	const [value, setValue] = useState( initialValue ?? '' );
	useEffect(() => setValue( initialValue ?? ''), [initialValue]);

	 return (
		<>
			<Editor
				onInit={ (evt, editor) => {
					editorRef.current = editor
				} }
				initialValue={ initialValue }
				value={ value }
				tinymceScriptSrc={ 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js' }
				init={{
					height: 300,
					menubar: false,
					plugins: [
						'lists link image charmap',
						'fullscreen',
						'media paste'
					],
					fixed_toolbar_container_target: editorRef,
					toolbar: 'undo redo | formatselect | ' +
						'bold italic | alignleft aligncenter ' +
						'alignright alignjustify | bullist numlist | ' +
						'link unlink |' + 
						'removeformat | help',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
				}}
				onEditorChange={ save }
			/>
		</>
	 );
 }