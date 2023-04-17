import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ResetSettings() {
	const resetSettings = () => {
		if ( confirm( __( 'This will reset all your settings. Are you sure?', 'formello' ) ) ) {
			return apiFetch( {
				path: '/formello/v1/settings/reset',
				method: 'POST',
			} );
		}
		return Promise.reject( false ); // do nothing
	};

	return (
		<Fragment>
			<p>
				{ __(
					'If you need to reset settings.',
					'formello'
				) }
			</p>
			<UpdateSettings
				req={ resetSettings }
				text={ __( 'Reset settings', 'formello' ) }
				isDestructive={ true }
			/>
		</Fragment>
	);
}
