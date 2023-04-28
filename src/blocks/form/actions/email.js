import { addFilter } from '@wordpress/hooks';

import {
	ToggleControl,
	BaseControl,
	Notice,
	Button,
} from '@wordpress/components';
import { Fragment, useState, useEffect, useRef } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

export default function Email( content, props, settings, MergeTags, ClassicEdit, handleUpdate ) {
	const { clientId } = props;

	const id = `editor-${ clientId }`;
	const [ advanced, setAdvanced ] = useState( false );

	const editorRef = useRef( null );
	const [ dirty, setDirty ] = useState( false );
	useEffect( () => setDirty( false ), [ settings.message ] );

	const save = () => {
		if ( editorRef.current ) {
			const message = editorRef.current.getContent();
			setDirty( false );
			editorRef.current.setDirty( false );
			// an application would save the editor content to the server here
			handleUpdate( 'message', message );
		}
	};
console.log( settings.message );

	return (
		<Fragment>
			<MergeTags
				clientId={ clientId }
				label="From"
				value={ settings.from }
				onChange={ ( val ) => {
					handleUpdate( 'from', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label="To"
				value={ settings.to }
				onChange={ ( val ) => {
					handleUpdate( 'to', val );
				} }
			/>

			<ToggleControl
				label={ __( 'CC/BCC', 'formello' ) }
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
							handleUpdate( 'cc', val );
						} }
					/>

					<MergeTags
						clientId={ clientId }
						label="BCC"
						value={ settings.bcc }
						onChange={ ( val ) => {
							handleUpdate( 'bcc', val );
						} }
					/>
				</>
			) }

			<MergeTags
				clientId={ clientId }
				label={ __( 'Reply to', 'formello' ) }
				value={ settings.replyTo }
				onChange={ ( val ) => {
					handleUpdate( 'replyTo', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label="Subject"
				value={ settings.subject }
				onChange={ ( val ) => {
					handleUpdate( 'subject', val );
				} }
			/>

			<BaseControl id={ id } label={ __( 'Message', 'formello' ) } __nextHasNoMarginBottom={ true }>
				<ClassicEdit
					id={ id } 
					defaultValue={ settings.message }
					onChange={ handleUpdate }
				/>
			</BaseControl>

			{ dirty && (
				<Notice status="warning" isDismissible={ false }>
					<span>{ __( 'You have unsaved content! ', 'formello' ) }</span>

					<Button isPrimary isSmall onClick={ save } disabled={ ! dirty }>
						{ __( 'Save', 'formello' ) }
					</Button>
				</Notice>
			) }
		</Fragment>
	);
}

addFilter( 'formello.modal.email', 'formello/actions-email', Email );
