/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { Animate } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function MessageBox( props ) {
	const { handleClose, message, messageType } = props;

	useEffect( () => {
		let timer;
		if ( message ) {
			timer = setTimeout( () => {
				handleClose( false );
			}, 3000 );
		}
		return () => {
			clearTimeout( timer );
		};
	}, [ message ] );

	return (
		<Animate type="slide-in" options={ { origin: 'top' } }>
			{ ( { animateClassName } ) => (
				<span className={ clsx(
					'formello-message',
					animateClassName,
					messageType,
					{
						show: message,
					}
				) }
				>
					{ message }
				</span>
			) }
		</Animate>
	);
}
