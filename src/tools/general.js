import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	Icon,
	SelectControl,
	ExternalLink,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import { RawHTML, useState, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const { apiFetch } = wp;

export default function General({ addNotice }) {
	const [loading, setLoading] = useState(false);

	const reSync = () => {
		setLoading(true);
		apiFetch({
			path: '/formello/v1/sync_template_library',
			method: 'POST',
		}).then((result) => {
			setLoading(false);
			addNotice('info', 'Template synced');
		});
	};

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{__('Template library', 'formello')}</h2>
				</CardHeader>

				<CardBody>
					<p>
						{__(
							'If you need to reset template library.',
							'formello'
						)}
					</p>

					<Button
						isPrimary
						aria-disabled={loading}
						isBusy={loading}
						target="_blank"
						onClick={() => reSync()}
					>
						{__('Re-Sync template', 'formello')}
					</Button>
				</CardBody>
			</Card>
			<Card>
				<CardHeader>
					<h2>{__('Logging', 'formello')}</h2>
				</CardHeader>

				<CardBody>
					<p>
						{__(
							'If you need to reset template library.',
							'formello'
						)}
					</p>

					<Button
						isPrimary
						aria-disabled={loading}
						isBusy={loading}
						target="_blank"
						onClick={() => reSync()}
					>
						{__('Re-Sync template', 'formello')}
					</Button>
				</CardBody>
			</Card>
		</Fragment>
	);
}
