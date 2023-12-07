import {
	Card,
	CardHeader,
	CardBody,
	withFilters, // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseNavigator as useNavigator,
	Button,
} from '@wordpress/components';

import { RawHTML, Fragment, createInterpolateElement } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const IntegrationsTab = () => {
	const navigator = useNavigator();
	const noticeString = ( text ) =>
		createInterpolateElement( text, {
			a: (
				<Button
					text={ __( 'addons page', 'search-console' ) }
					onClick={ () =>
						navigator.goTo( '/formello-addons/general' )
					}
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
							__( 'Go to <a /> to download your preferred integrations.', 'tropical-juice' )
						) }
					</p>
					<RawHTML>
						{ sprintf(
							/* translators: Link to addons. */
							__(
								'<p>Go to %s to download your preferred integrations. We are working on other integrations.</p>',
								'formello'
							),
							`<a href="https://formello.net/addons/" target="_blank">addons page</a>`
						) }
					</RawHTML>
				</CardBody>
			</Card>
		</Fragment>
	);
};

export default withFilters( 'formello.settings.integrations' )(
	IntegrationsTab
);
