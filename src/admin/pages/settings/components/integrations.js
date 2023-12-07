import {
	Card,
	CardHeader,
	CardBody,
	withFilters, // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseNavigator as useNavigator,
	Button,
} from '@wordpress/components';

import {
	RawHTML,
	Fragment,
	createInterpolateElement,
} from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const IntegrationsTab = () => {
	const navigator = useNavigator();
	const noticeString = ( text ) =>
		createInterpolateElement( text, {
			a: (
				<Button
					text={ __( 'addons page', 'search-console' ) }
					onClick={ () => {
						window.dispatchEvent(
							new CustomEvent( 'changePage', {
								detail: '?page=formello-addons',
							} )
						);
						navigator.goTo( '/formello-addons/general' );
					} }
					variant="link"
				/>
			),
		} );
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{ __( 'Integrations', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ noticeString(
							__(
								'Go to <a /> to enable your preferred integrations.',
								'formello'
							)
						) }
					</p>
				</CardBody>
			</Card>
		</Fragment>
	);
};

export default withFilters( 'formello.settings.integrations' )(
	IntegrationsTab
);
