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

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UpdateSettings( props ) {
	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState( false );
	const {
		onClick,
		text
	} = props;
	const elementRef = useRef();

	const updateButton =
		status === 'saving'
			? __( 'Updating…', 'formello' )
			: __( 'Update', 'formello' );

	return (
		<div className="setting-controls__save-settings">
			<Button
				className={ classnames( 'save-settings__save-button', {
					'is-busy': status === 'saving',
				} ) }
				onClick={ () => onClick() }
				isPrimary
			>
				{ text }
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
		</div>
	);
}