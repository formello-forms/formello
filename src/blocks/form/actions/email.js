import { addFilter } from '@wordpress/hooks';

import {
	ToggleControl,
	TextareaControl,
	BaseControl,
	Notice,
	Button,
} from '@wordpress/components';
import { Fragment, useState, useEffect, useRef } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import ClassicEdit from '../../../components/editor.js';

export default function Email( content, props, settings, MergeTags, handleUpdate ) {
	const { clientId } = props;

	const id = `editor-${ clientId }`;
	const [ advanced, setAdvanced ] = useState( false );

	const onChangeMessage = ( val ) => {
		handleUpdate( 'message', val );
	};

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
				label={ __( 'Subject', 'formello' ) }
				value={ settings.subject }
				onChange={ ( val ) => {
					handleUpdate( 'subject', val );
				} }
			/>

			<BaseControl label={ __( 'Message', 'formello' ) }>
				<ClassicEdit
					id={ id }
					value={ settings.message }
					onChange={ onChangeMessage }
				/>
			</BaseControl>

		</Fragment>
	);
}

addFilter( 'formello.modal.email', 'formello/actions-email', Email );
