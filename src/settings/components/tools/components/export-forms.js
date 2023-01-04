import { Notice } from '@wordpress/components';

import { useState, Fragment, RawHTML } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ExportForms() {

	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState('');
	const [ messageType, setMessageType ] = useState('error');

	const exportForms = () => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/templates/export',
			method: 'POST',
		} ).then( (result) => {
			setLoading( false );
			setMessage( result.response );
			setMessageType( 'success' )
		}, (result) => {
			setMessage( result.response );
			setMessageType( 'error' )
		} );
	};

	return (
		<Fragment>

			<UpdateSettings
				onClick={ () => exportForms() }
				text={ __( 'Export forms', 'formello' ) }
				loading={ loading }
			/>
			{	message &&
                <Notice
                    status="success"
                    onRemove={ () => setMessage(false) }
                    isDismissible={ true }
                >
                    <RawHTML>
                        { sprintf(
                            /* translators: Number of templates. */
                            __(
                                'Your export is complete. Please click to %s.',
                                'formello-exporter'
                            ),
                            `<a rel="download" target="_blank" href="${ message }">download</a>`
                        ) }
                    </RawHTML>
                </Notice>    
            }
		</Fragment>
	);
}