import {
  BaseControl,
  Button,
  __experimentalInputControl as InputControl,
  CardBody,
  Card,
  CardHeader
} from '@wordpress/components';

import { RawHTML } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function AddonLicense(props) {

	const { title, license, saveSettingGroup } = props

	const validateLicense = ( group, field, value ) => {
		apiFetch( {
			path: '/formello/v1/license/activate',
			method: 'POST',
			data: {
				license: license,
			},
		} ).then( ( result ) => {
        	addNotice( 'info', __( 'Api Key valid', 'formello' ) );
		}, (result) => {
        	addNotice( 'error', result.message );
		})
	};

	return (
		<Card>

			<CardHeader>
				<h2>{ title }</h2>
			</CardHeader>

			<CardBody>
				<BaseControl>
					<InputControl
						label={ __( 'License Key', 'formello-mailchimp' ) }
						value={ license }
						onChange={ ( val ) => {
							saveSettingGroup( 'addon_licenses', title, val )
						} }
						suffix={
							<Button
								isSmall
								onClick={ validateLicense }
								icon={ 'admin-generic' }
							/>
						}
					/>
				</BaseControl>					
			</CardBody>
		</Card>
	);
}
