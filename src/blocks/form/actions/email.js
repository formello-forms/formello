const { addFilter } = wp.hooks; 

import {
  TextControl,
  TextareaControl,
  Button,
  SelectControl,
  Icon,
} from '@wordpress/components';
import {
	Fragment,
	RawHTML,
	useState,
	useEffect
} from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import { __ } from '@wordpress/i18n';

export default function email( content, props, MergeTags, handleUpdate ) {

	const {
		action,
		clientId,
	} = props;

	const [ settings, setSettings ] = useState( Object.assign( {}, action ) );

	const updateSettings = ( prop, val ) => {
		setSettings( { ...settings, [prop]: val } )
		handleUpdate( { ...settings, [prop]: val } )
	}

	return (
		<Fragment>
			<TextControl
				label="Name"
				value={ settings.title }
				onChange={ ( val ) => { updateSettings( 'title', val ) } }
			/>
			<MergeTags 
				clientId={ clientId }
				label="From"
				value={ settings.from }
				onChange={ ( val ) => { updateSettings( 'from', val ) } }
			/>

			<MergeTags
				clientId={ clientId }			
				label="To"
				value={ settings.to }
				onChange={ ( val ) => { updateSettings( 'to', val ) } }
			/>

			<MergeTags
				clientId={ clientId }			
				label="Reply To"
				value={ settings.replyTo }
				onChange={ ( val ) => { updateSettings( 'replyTo', val ) } }
			/>

			<MergeTags
				clientId={ clientId }			
				label="Subject"
				value={ settings.subject }
				onChange={ ( val ) => { updateSettings( 'subject', val ) } }
			/>

			<TextareaControl
				label="Message"
				value={ settings.message }
				onChange={ ( val ) => { updateSettings( 'message', val ) } }
				placeholder={ __( 'Enter message...', 'formello' ) }
			/>
		</Fragment>
	)
}

addFilter(
	'formello.modal.email',
	'formello/actions-email',
	email
);