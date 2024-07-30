/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

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
		text,
		disabled,
		variant,
		isDestructive = false,
		withConfirm = false,
		confirmMessage = __( 'Are you sure?', 'formello' ),
	} = props;

	const [ showConfirmDialog, setShowConfirmDialog ] = useState( false );
	const [ loading, setLoading ] = useState( false );
	const { createNotice } = useDispatch( noticesStore );

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
					createNotice( 'info', '🎯 ' + data.response, {
						type: 'snackbar',
					} );
				} else {
					createNotice(
						'info',
						'🎯 ' + __( 'Settings saved.', 'formello' ),
						{
							type: 'snackbar',
						}
					);
				}
			} )
			.catch( ( error ) => {
				createNotice( 'error', '⚠️ ' + error.message, {
					type: 'snackbar',
					explicitDismiss: true,
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
				<ConfirmDialog
					isOpen={ showConfirmDialog }
					onConfirm={ runAction }
					onCancel={ () => setShowConfirmDialog( false ) }
				>
					{ confirmMessage }
				</ConfirmDialog>
			</div>
		</Fragment>
	);
}
