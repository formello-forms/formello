import { __ } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	withFilters,
} from '@wordpress/components';

export const Promo = withFilters( 'formello.modal.promo' )( () => {
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

export const PromoSettings = withFilters( 'formello.settings.promo' )( () => {
	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Go Pro', 'formello' ) }</h2>
			</CardHeader>
			<CardBody>
				<p>{ __( 'Empower your forms with our PRO extensions.' ) }</p>
				<ul>
					<li>{ __( 'Conditional fields', 'formello' ) }</li>
					<li>{ __( 'File upload', 'formello' ) }</li>
					<li>{ __( 'Frontend posting', 'formello' ) }</li>
					<li>{ __( 'Login form', 'formello' ) }</li>
					<li>{ __( 'Search autosuggest', 'formello' ) }</li>
					<li>{ __( 'Calculator formula', 'formello' ) }</li>
					<li>{ __( 'Web Hooks', 'formello' ) }</li>
					<li>{ __( 'Mail marketing integration', 'formello' ) }</li>
				</ul>
				<Button
					text={ __( 'Try now free', 'formello' ) }
					variant="primary"
				/>
			</CardBody>
		</Card>
	);
} );
