/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, RawHTML, Fragment } from '@wordpress/element';
import {
	Button,
	Notice,
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
	const { license, license_status, req, onChange } = props;

	const [ message, setMessage ] = useState( false );
	const [ loading, setLoading ] = useState( false );

	const action = () => {
		setLoading( true );
		req()
			.then( ( data ) => {
				if ( typeof data.response === 'object' ) {
					setMessage( {
						type: data.response.success ? 'success' : 'error',
						text: data.response.license,
					} );
				} else {
					setMessage( {
						type: 'error',
						text: data.response,
					} );
				}
			} )
			.catch( ( error ) => {
				setMessage( {
					type: 'error',
					text: error.message,
				} );
			} )
			.finally( () => {
				setLoading( false );
			} );
	};

	return (
		<Fragment>
			<InputControl
				type="text"
				autoComplete="new-password"
				label={ __( 'License Key', 'formello' ) }
				value={ license }
				onChange={ onChange }
				suffix={
					<Button
						onClick={ action }
						variant="secondary"
						aria-disabled={ loading }
						isBusy={ loading }
						disabled={ '' === license }
					>
						{ __( 'Check', 'formello' ) }
					</Button>
				}
			/>
			{ '' !== license && license_status && (
				<Notice
					isDismissible={ false }
					className={ clsx( 'message', {
						'is-success': 'valid' === license_status,
						'is-warning': 'valid' !== license_status,
					} ) }
				>
					<RawHTML>
						{ sprintf(
							/* translators: %1$s: License status. %2$s: License status. */
							__(
								'License status: <strong class="license-%1$s">%2$s</strong>',
								'formello'
							),
							`${ 'valid' === license_status || 'error' }`,
							`${ license_status }`
						) }
					</RawHTML>
				</Notice>
			) }
		</Fragment>
	);
}
