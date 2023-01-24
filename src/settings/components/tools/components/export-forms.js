import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ExportForms() {

	const exportForms = () => {
		return apiFetch( {
			path: '/formello/v1/templates/export',
			method: 'POST',
		} );
	};

	return (
		<UpdateSettings
			req={ exportForms }
			text={ __( 'Export forms', 'formello' ) }
			withNotice={ true }
			variant={ 'primary' }
		/>
	);
}