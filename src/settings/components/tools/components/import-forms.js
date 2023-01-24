import { FormFileUpload } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';
import { uploadMedia } from '@wordpress/media-utils'

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ImportForms() {

	const [ files, setFiles ] = useState( false );

	const importForms = () => {
		uploadMedia( {
			filesList: files,
			onFileChange: ( [ fileObj ] ) => req( fileObj ),
			onError: (error) => { console.log(error) },
		} );
	};

	const req = () => {
		var data = new FormData()
		data.append('file', files[0])

		return apiFetch( {
			path: '/formello/v1/templates/import',
			method: 'POST',
			body: data
		} ).finally( () => setFiles(false) )
	}

	return (
		<Fragment>
			<div className="setting-controls__save-settings">
				<FormFileUpload
					accept="application/json"
					onChange={ ( event ) => setFiles( event.target.files ) }
					variant="secondary"
				>
					{ __( 'Choose file', 'formello' ) }
				</FormFileUpload>
				{
					files && files[0]?.name
				}
			</div>

			<UpdateSettings
				req={ req }
				text={ __( 'Import forms', 'formello' ) }
				variant={ 'primary' }
				disabled={ !files }
			/>
		</Fragment>
	);
}