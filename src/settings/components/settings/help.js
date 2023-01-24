import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function Help() {
	return (
		<div className="ads-container">
			<Card>
				<CardHeader>
					<h2>{ __( 'Need help?', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'Detailed documentation is available on the plugin website.',
							'formello'
						) }
					</p>

					<ExternalLink href="https://docs.formello.net">
						{ __( 'Documentation', 'formello' ) }
					</ExternalLink>
					<p>
						{ __(
							'We would love to help you out if you need any help.',
							'formello'
						) }
					</p>

					<ExternalLink href="https://wordpress.org/support/plugin/formello/">
						{ __( 'Ask a question', 'formello' ) }
					</ExternalLink>

				</CardBody>
			</Card>
			<Card className="ads-container__reviews">
				<CardHeader>
					<h2>{ __( 'Do you like the plugin?', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'If you like the Formello you can share a review to help us and spread some love!',
							'formello'
						) }
					</p>
					<ExternalLink href="https://wordpress.org/support/plugin/formello/reviews/#new-post">
						{ __( 'Rate 5 stars!', 'formello' ) }
					</ExternalLink>
				</CardBody>
			</Card>
		</div>
	);
}
