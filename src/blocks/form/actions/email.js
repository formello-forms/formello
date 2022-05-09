const { addFilter } = wp.hooks;

import {
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment, useState, useEffect, useRef } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { Editor } from '@tinymce/tinymce-react';

export default function Email( content, props, MergeTags, handleUpdate ) {
	const { action, clientId } = props;

	const [ settings, setSettings ] = useState( Object.assign( {}, action ) );
	const [ advanced, setAdvanced ] = useState( false );

	const updateSettings = ( prop, val ) => {
		setSettings( { ...settings, [ prop ]: val } );
		handleUpdate( { ...settings, [ prop ]: val } );
	};

	const editorRef = useRef(null);
	const [dirty, setDirty] = useState(false);
	useEffect(() => setDirty(false), [settings.message]);

	const save = () => {
		if (editorRef.current) {
			const content = editorRef.current.getContent();
			setDirty(false);
			editorRef.current.setDirty(false);
			// an application would save the editor content to the server here
			updateSettings( 'message', content )
		}
	};

	return (
		<Fragment>
			<TextControl
				label="Name"
				value={ settings.title }
				onChange={ ( val ) => {
					updateSettings( 'title', val );
				} }
			/>
			<MergeTags
				clientId={ clientId }
				label="From"
				value={ settings.from }
				onChange={ ( val ) => {
					updateSettings( 'from', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label="To"
				value={ settings.to }
				onChange={ ( val ) => {
					updateSettings( 'to', val );
				} }
			/>

			<ToggleControl
				label={ __( 'More', 'formello' ) }
				onChange={ ( val ) => {
					setAdvanced( val );
				} }
				checked={ advanced }
			/>

			{ advanced && (
				<>
					<MergeTags
						clientId={ clientId }
						label="CC"
						value={ settings.cc }
						onChange={ ( val ) => {
							updateSettings( 'cc', val );
						} }
					/>

					<MergeTags
						clientId={ clientId }
						label="BCC"
						value={ settings.bcc }
						onChange={ ( val ) => {
							updateSettings( 'bcc', val );
						} }
					/>
				</>
			) }

			<MergeTags
				clientId={ clientId }
				label="Reply To"
				value={ settings.replyTo }
				onChange={ ( val ) => {
					updateSettings( 'replyTo', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label="Subject"
				value={ settings.subject }
				onChange={ ( val ) => {
					updateSettings( 'subject', val );
				} }
			/>
			<label>{ __( 'Message', 'formello' ) }</label>
			<Editor 
				initialValue={ settings.message }
				onInit={ (evt, editor) => editorRef.current = editor }
				onDirty={ () => setDirty(true) }
				init={{
					height: 200,
					menubar: false,
					plugins: [
						'lists link image charmap'
					],
					toolbar: 'bold italic | aligncenter | bullist numlist | link unlink | undo redo ',
				}}
			/>
			<button onClick={ save } disabled={ ! dirty }>{ __( 'Save', 'formello' ) }</button>
			{dirty && <p>You have unsaved content!</p>}

		</Fragment>
	);
}

addFilter( 'formello.modal.email', 'formello/actions-email', Email );
