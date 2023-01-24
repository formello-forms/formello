/**
 * External dependencies
 */
import classnames from 'classnames';
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate, Button, Notice, Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, RawHTML, Fragment } from '@wordpress/element';
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
	const {
		req,
		withNotice,
		text,
		disabled,
		variant,
		isDestructive=false
	} = props;

	const [ message, setMessage ] = useState(false)
	const [ loading, setLoading ] = useState(false)

	const action = () => {
		setLoading( true )
		req()
			.then( (data) => {
				if( data?.success ){
					setMessage({
						type: data.success ? 'success' : 'error',
						message: data.response
					})
				}else {
					setMessage({
						type: 'success',
						message: __( 'Settings saved.', 'formello' )
					})					
				}
			} )
			.catch( (error) => {
				setMessage({
					type: 'error',
					message: error.message
				})
			} )
			.finally( () => setLoading(false) )
	}

	return (
		<Fragment>
			<div className="setting-controls__save-settings">
				<Button
					onClick={ action }
					isBusy={ loading }
					disabled={ disabled || loading }
					variant={ variant }
					isDestructive={ isDestructive }
				>
					{ text }
				</Button>
				{ 
					message && ! withNotice && (
						<MessageBox message={ message.message } messageType={ message.type } handleClose={ setMessage } key="message" />
					)
				}
			</div>
			{ message && withNotice && (
				<Animate type="slide-in" options={ { origin: 'top' } } key="loading">
					{ ( { className: animateClassName } ) => (

		                <Notice
		                    status={ message.type }
		                    onRemove={ () => setMessage(false) }
		                    isDismissible={ true }
							className={ classnames(
								'message',
								animateClassName
							) }
		                >
		                    <RawHTML>
		                        { message.message }
		                    </RawHTML>
		                </Notice>  

					) }
				</Animate>
				)
			}
		</Fragment>
	);
}