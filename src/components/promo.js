import { __ } from '@wordpress/i18n';
import { Button, withFilters } from '@wordpress/components';

export const Promo = withFilters( 'formello.modal.test' )( () => {
	return (
		<div>
			<p>
				{ __(
					'This action is available only for pro users. You can try one month free.',
					'formello'
				) }
			</p>
			<Button
				variant="primary"
				href="https://formello.net"
				icon="download"
				iconPosition={ 'right' }
				target="_blank"
			>
				{ __( 'Try it now free!', 'formello' ) }
			</Button>
		</div>
	);
} );
