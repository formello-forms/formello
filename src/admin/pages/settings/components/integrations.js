import {
	Card,
	CardHeader,
	CardBody,
	withFilters,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseNavigator as useNavigator,
	Button,
} from '@wordpress/components';
import {
	RawHTML,
	Fragment,
	createInterpolateElement,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { useHistory } from '../../../router';
import { integrations, icons } from '../../../../blocks/form/actions/constants';

const Integrations = withFilters( 'formello.settings.integrations' )( () => {
	return <p>This is for premium users.</p>;
} );

const IntegrationsTab = () => {

	const history = useHistory();
	const noticeString = ( text ) =>
		createInterpolateElement( text, {
			a: (
				<Button
					text={ __( 'addons page', 'search-console' ) }
					onClick={ () => {
						history.push( { page: 'formello-addons' } );
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
			<Integrations integrations={ integrations } icons={ icons } />
		</Fragment>
	);
};

export default IntegrationsTab;
