/**
 * External dependencies
 */
import classnames from 'classnames';
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate, Button, Modal, Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { cloud, Icon } from '@wordpress/icons';
import MessageBox from './message-box.js';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UpdateSettings( props ) {
	const [ status, setStatus ] = useState( 'saved' );
	const [ message, setMessage ] = useState('');
	const [ messageType, setMessageType ] = useState('error');
	const {
		settings,
		setSettings,
		hasUpdates,
		setHasUpdates,
		tabSettings,
	} = props;
	const { saveEntityRecord } = useDispatch( coreStore );
	const elementRef = useRef();

	const updateButton =
		status === 'saving'
			? __( 'Updating…', 'formello' )
			: __( 'Update', 'formello' );

	// Handle all setting changes, and save to the database.
	async function onSettingsChange( type = 'save' ) {
		let record = '';

		setStatus( 'saving' );
		record = { [tabSettings]: settings[tabSettings] };

		let response = '';
		response = await saveEntityRecord(
			'root',
			'site',
			record
		);

		if ( response ) {
			setSettings( response );
			setStatus( 'saved' );
			setMessageType( 'success' );
			setMessage( 
				__(
					'Settings updated.',
					'formello'
				) 
			);
			setHasUpdates( false );
		} else {
			setStatus( 'error' );
			setMessage( 
				__(
					'Update failed. Try again or get in touch with support.',
					'formello'
				) 
			);
		}
	}

	return (
		<div className="setting-controls__save-settings">
			<Button
				className={ classnames( 'save-settings__save-button', {
					'is-busy': status === 'saving',
				} ) }
				onClick={ () => onSettingsChange() }
				disabled={ ! hasUpdates && status !== 'error' }
				aria-disabled={ ! hasUpdates && status !== 'error' }
				isPrimary
			>
				{ updateButton }
			</Button>
			{ [
				status === 'saving' && (
					<Animate type="loading">
						{ ( { className: animateClassName } ) => (
							<span
								className={ classnames(
									'message',
									animateClassName
								) }
							>
								<Icon icon={ cloud } />
								{ __( 'Saving', 'formello' ) }
							</span>
						) }
					</Animate>
				)
			] }
			<MessageBox message={ message } messageType={ messageType } handleClose={ setMessage } />
		</div>
	);
}