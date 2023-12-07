import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../../components/update-settings';

export default function ResetSettings() {
	const resetSettings = () => {
		return apiFetch( {
			path: '/formello/v1/settings/reset',
			method: 'POST',
		} );
	};

	return (
		<Fragment>
			<p>{ __( 'If you need to reset settings.', 'formello' ) }</p>
			<UpdateSettings
				req={ resetSettings }
				text={ __( 'Reset settings', 'formello' ) }
				isDestructive
				variant="secondary"
				withConfirm={ true }
				confirmMessage={ __(
					'This will reset all your settings. Are you sure?',
					'formello'
				) }
			/>
		</Fragment>
	);
}
