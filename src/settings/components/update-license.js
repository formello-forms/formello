/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, RawHTML, Fragment } from '@wordpress/element';
import MessageBox from './message-box.js';
import {
	Button,
	Notice, 
	BaseControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UpdateLicense( props ) {
	const {
		license,
		license_status,
		req,
		withNotice,
		onChange,
		saveSettings,
		optionName
	} = props;

	const [ message, setMessage ] = useState(false)
	const [ loading, setLoading ] = useState(false)

	const action = () => {

		const endpoint =
			'valid' !== license_status ? 'activate' : 'deactivate';

		setLoading( true )
		req()
			.then( (data) => {
				if ( typeof data.response === 'object' ) {
					setMessage({
						type: data.response.success ? 'success' : 'error',
						message: data.response.license
					})
				} else {
					setMessage({
						type: 'error',
						message: data.response
					})
				}
			} )
			.catch( (error) => {
				setMessage({
					type: 'error',
					message: error.message
				})
			} )
			.finally( () => {
				setLoading(false)
			} )
	}

	return (
		<Fragment>
			<InputControl
				type="text"
				autoComplete="new-password"
				label={ __( 'License Key', 'formello' ) }
				value={ license }
				onChange={ onChange }
				readOnly={ 'valid' === license_status }
				suffix={
					<Button
						onClick={ action }
						isPrimary={ 'valid' !== license_status }
						isSecondary={
							'valid' === license_status
						}
						aria-disabled={ loading }
						isBusy={ loading }
						disabled={ '' === license }
					>
						{ 'valid' !== license_status
							? 'Activate'
							: 'Deactivate' }
					</Button>
				}
			/>
			{ 
				message && ! withNotice && (
					<MessageBox message={ message.message } messageType={ message.type } handleClose={ setMessage } key="message" />
				)
			}
			{ '' !== license && license_status && (
                <Notice
                    //status={ message.type }
                    onRemove={ () => setMessage( false ) }
                    isDismissible={ false }
					className={ classnames(
						'message',
						{
							'is-success': 'valid' === license_status,
							'is-warning': 'valid' !== license_status,
						}
					) }
                >
                    <RawHTML>
						{ sprintf(
							/* translators: License status. */
							__(
								'License status: <strong class="license-%s">%s</strong>',
								'formello'
							),
							`${ 'valid' === license_status || 'error' }`,
							`${ license_status }`,
						) }
                    </RawHTML>
                </Notice>
			) }
		</Fragment>
	);
}