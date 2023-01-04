import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Icon,
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

					<Button
						isSecondary
						href="https://docs.formello.net"
						target="_blank"
						icon="external"
						iconPosition="right"
					>
						{ __( 'Documentation', 'formello' ) }
					</Button>

					<p>
						{ __(
							'We would love to help you out if you need any help.',
							'formello'
						) }
					</p>

					<Button
						isSecondary
						target="_blank"
						href="https://wordpress.org/support/plugin/formello/"
						icon="external"
						iconPosition="right"
					>
						{ __( 'Ask a question', 'formello' ) }
					</Button>
				</CardBody>
			</Card>
			<Card className="ads-container__reviews">
				<CardHeader>
					<h2>{ __( 'Do you like the plugin?', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'If you like the plugin you can share a review to help us and spread some love!',
							'formello'
						) }
					</p>

					<Button
						variant="secondary"
						target="_blank"
						className="formello-ratings"
						href="https://wordpress.org/support/plugin/formello/reviews/#new-post"
					>
						{ __( 'Rate', 'formello' ) }
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
					</Button>
				</CardBody>
			</Card>
		</div>
	);
}
