/**
 * External dependencies
 */
import classnames from 'classnames';
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function MessageBox( props ) {
	const { handleClose, message, messageType } = props;

	useEffect(() => {
		if ( message ) {
			setTimeout(() => {
				handleClose( false );
			}, 3000);
		}
	}, [ message ]);

	return (
			<Animate type="slide-in" options={ { origin: 'top' } }>
				{ ( { animateClassName } ) => (
						<span className={ classnames(
								'formello-message',
								animateClassName,
								messageType,
								{
									'show': message
								}
							) }
						>
							{ message }
						</span>
				) }
			</Animate>
		)
}