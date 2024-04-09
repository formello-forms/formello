/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Animate,
	Button,
	Notice,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';
import { useState, RawHTML, Fragment } from '@wordpress/element';
import MessageBox from './message-box.js';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UpdateSettings( props ) {
	const {
		req,
		withNotice,
		text,
		disabled,
		variant,
		isDestructive = false,
		withConfirm = false,
		confirmMessage = __( 'Are you sure?', 'formello' ),
	} = props;

	const [ showConfirmDialog, setShowConfirmDialog ] = useState( false );
	const [ message, setMessage ] = useState( false );
	const [ loading, setLoading ] = useState( false );

	const action = () => {
		if ( withConfirm ) {
			setShowConfirmDialog( true );
		} else {
			runAction();
		}
	};

	const runAction = () => {
		setLoading( true );
		setShowConfirmDialog( false );
		req()
			.then( ( data ) => {
				if ( data?.success ) {
					setMessage( {
						type: data.success ? 'success' : 'error',
						message: data.response,
					} );
				} else {
					setMessage( {
						type: 'success',
						message: __( 'Settings saved.', 'formello' ),
					} );
				}
			} )
			.catch( ( error ) => {
				console.log(error)
				setMessage( {
					type: 'error',
					message: error.message,
				} );
			} )
			.finally( () => setLoading( false ) );
	};

	return (
		<Fragment>
			<div className="setting-controls__save-settings">
				<Button
					onClick={ action }
					isBusy={ loading }
					disabled={ disabled || loading }
					aria-disabled={ disabled || loading }
					variant={ variant }
					isDestructive={ isDestructive }
				>
					{ text }
				</Button>
				{ message && ! withNotice && (
					<MessageBox
						message={ message.message }
						messageType={ message.type }
						handleClose={ setMessage }
						key="message"
					/>
				) }
				<ConfirmDialog
					isOpen={ showConfirmDialog }
					onConfirm={ runAction }
					onCancel={ () => setShowConfirmDialog( false ) }
				>
					{ confirmMessage }
				</ConfirmDialog>
			</div>
			{ message && withNotice && (
				<Animate
					type="slide-in"
					options={ { origin: 'top' } }
					key="loading"
				>
					{ ( { className: animateClassName } ) => (
						<Notice
							status={ message.type }
							onRemove={ () => setMessage( false ) }
							isDismissible={ true }
							className={ classnames(
								'message',
								animateClassName
							) }
						>
							<RawHTML>{ message.message }</RawHTML>
						</Notice>
					) }
				</Animate>
			) }
		</Fragment>
	);
}
