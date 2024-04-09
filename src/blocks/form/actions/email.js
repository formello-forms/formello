import { addFilter } from '@wordpress/hooks';

import { ToggleControl, BaseControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import MergeTags from '../../../components/merge-tags';
import { Editor } from '@tinymce/tinymce-react';

export default function Email( content, clientId, action, handleUpdate ) {
	const id = `editor-${ clientId }`;

	const { settings } = window.wpEditorL10n.tinymce;

	return (
		<Fragment>
			<MergeTags
				clientId={ clientId }
				label="From"
				value={ action.from }
				onChange={ ( val ) => {
					handleUpdate( 'from', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label="To"
				value={ action.to }
				onChange={ ( val ) => {
					handleUpdate( 'to', val );
				} }
			/>

			<ToggleControl
				label={ __( 'CC/BCC', 'formello' ) }
				onChange={ ( val ) => {
					handleUpdate( 'advanced', val );
				} }
				checked={ action.advanced }
			/>

			{ action.advanced && (
				<Fragment>
					<MergeTags
						clientId={ clientId }
						label="CC"
						value={ action.cc }
						onChange={ ( val ) => {
							handleUpdate( 'cc', val );
						} }
					/>

					<MergeTags
						clientId={ clientId }
						label="BCC"
						value={ action.bcc }
						onChange={ ( val ) => {
							handleUpdate( 'bcc', val );
						} }
					/>
				</Fragment>
			) }

			<MergeTags
				clientId={ clientId }
				label={ __( 'Reply to', 'formello' ) }
				value={ action.replyTo }
				onChange={ ( val ) => {
					handleUpdate( 'replyTo', val );
				} }
			/>

			<MergeTags
				clientId={ clientId }
				label={ __( 'Subject', 'formello' ) }
				value={ action.subject }
				onChange={ ( val ) => {
					handleUpdate( 'subject', val );
				} }
			/>

			<BaseControl label={ __( 'Message', 'formello' ) } id={ id }>
				<Editor
					value={ action.message }
					init={ {
						menubar: false,
						plugins: settings.plugins,
						toolbar: [ settings.toolbar1, settings.toolbar2 ],
					} }
					onEditorChange={ ( val ) => handleUpdate( 'message', val ) }
				/>
			</BaseControl>
		</Fragment>
	);
}

addFilter( 'formello.modal.email', 'formello/actions-email', Email );

function withComponentAppended( FilteredComponent ) {
	return ( props ) => {
		const { settings } = props;
		if ( 'Email' === settings.name ) {
			return null;
		}
		return (
			<>
				<FilteredComponent { ...props } />
			</>
		);
	};
}

addFilter(
	'formello.modal.test',
	'formello/actions-email-promo',
	withComponentAppended
);
